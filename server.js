const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// --- Conexión a MongoDB (sin cambios) ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Conectado a MongoDB Atlas.');
    })
    .catch((err) => {
        console.error('❌ Error al conectar a MongoDB:', err);
    });

// --- NUEVO: Esquema y Modelo para Personas ---
const PersonaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true }, // Campo específico para personas
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Usamos el nombre de la colección desde el .env
const Persona = mongoose.model('Persona', PersonaSchema, process.env.PERSONA_COLLECTION);


// --- NUEVO: Esquema y Modelo para Empresas ---
const EmpresaSchema = new mongoose.Schema({
    razonSocial: { type: String, required: true }, // Campo específico para empresas
    nit: { type: String, required: true, unique: true }, // Campo específico para empresas
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Usamos el nombre de la colección desde el .env
const Empresa = mongoose.model('Empresa', EmpresaSchema, process.env.EMPRESA_COLLECTION);


// --- NUEVO: Ruta de registro para Personas ---
app.post('/api/register/persona', async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificamos que el email no exista en NINGUNA de las dos colecciones
        const existingPersona = await Persona.findOne({ email });
        const existingEmpresa = await Empresa.findOne({ email });
        if (existingPersona || existingEmpresa) {
            return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newPersona = new Persona({
            nombre,
            apellido,
            email,
            password: hashedPassword
        });

        await newPersona.save();
        res.status(201).json({ message: 'Usuario (persona) registrado con éxito.' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error: error.message });
    }
});

// --- NUEVO: Ruta de registro para Empresas ---
app.post('/api/register/empresa', async (req, res) => {
    const { razonSocial, nit, email, password } = req.body;

    if (!razonSocial || !nit || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Verificamos que el email o NIT no existan
        const existingPersona = await Persona.findOne({ email });
        const existingEmpresa = await Empresa.findOne({ $or: [{ email }, { nit }] });
        if (existingPersona || existingEmpresa) {
            return res.status(409).json({ message: 'El correo electrónico o NIT ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmpresa = new Empresa({
            razonSocial,
            nit,
            email,
            password: hashedPassword
        });

        await newEmpresa.save();
        res.status(201).json({ message: 'Usuario (empresa) registrado con éxito.' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error: error.message });
    }
});


// --- MODIFICADO: Ruta de Login unificada ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    try {
        // Buscamos primero en la colección de personas
        let user = await Persona.findOne({ email });
        let userType = 'persona';

        // Si no se encuentra, buscamos en la colección de empresas
        if (!user) {
            user = await Empresa.findOne({ email });
            userType = 'empresa';
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }
        
        // Devolvemos un nombre de usuario según el tipo
        const userName = userType === 'persona' ? user.nombre : user.razonSocial;
        
        res.status(200).json({ 
            message: `¡Bienvenido de vuelta, ${userName}!`,
            userName: userName,
            userType: userType // Opcional: devolver el tipo de usuario al frontend
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error: error.message });
    }
});

// --- MODIFICADO: Ruta para cambiar contraseña unificada ---
app.post('/api/change-password', async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Buscamos el usuario en ambas colecciones
        let user = await Persona.findOne({ email });
        if (!user) {
            user = await Empresa.findOne({ email });
        }

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save(); // Mongoose sabe a qué colección pertenece el documento 'user'

        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor.', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});