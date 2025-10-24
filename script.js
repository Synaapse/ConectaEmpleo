document.addEventListener('DOMContentLoaded', function() {

    // --- FUNCIÓN REUTILIZABLE PARA INICIALIZAR EL DESPLEGABLE DE EMPLEOS ---
    function initializeEmpleosDropdown() {
        const empleosNavLink = document.getElementById('empleos-nav-link');
        const empleosDropdown = document.getElementById('empleos-dropdown');
        if (empleosNavLink && empleosDropdown) {
            empleosNavLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                empleosDropdown.classList.toggle('show');
                // Toggle 'open' class on the parent <li> element for the arrow animation
                empleosNavLink.parentElement.classList.toggle('open');
            });
        }
    }

    // --- GESTIÓN DE ESTADO DE LOGIN (UNIFICADO) ---
    function checkLoginStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const loggedInCompany = localStorage.getItem('loggedInCompany');
        const userActionsDiv = document.querySelector('.user-actions');
        const pageMode = document.body.getAttribute('data-page-mode');

        if (!userActionsDiv) return;

        // --- Lógica para el modo EMPRESA ---
        if (pageMode === 'empresas') {
            if (loggedInCompany) {
                userActionsDiv.innerHTML = `
                    <div class="user-menu">
                        <button id="user-menu-btn" class="user-menu-name">
                            Empresa: ${loggedInCompany} &#9662;
                        </button>
                        <div id="dropdown-menu" class="dropdown-menu">
                            <a href="panel-empresa.html#publicar-oferta">Publicar Oferta</a>
                            <a href="panel-empresa.html#ofertas-publicadas">Mis Ofertas</a>
                            <a href="#" id="logout-btn">Cerrar Sesión</a>
                        </div>
                    </div>
                `;
            } else {
                 userActionsDiv.innerHTML = `<a href="cuenta-empresa.html" class="btn btn-secondary">Acceso Empresas</a>`;
            }
        // --- Lógica para el modo PERSONA ---
        } else {
            if (loggedInUser) {
                userActionsDiv.innerHTML = `
                    <div class="user-menu">
                        <button id="user-menu-btn" class="user-menu-name">
                            Hola, ${loggedInUser} &#9662;
                        </button>
                        <div id="dropdown-menu" class="dropdown-menu">
                            <a href="mi-cuenta.html#postulaciones">Mis Postulaciones</a>
                            <a href="mi-cuenta.html#favoritos">Favoritos</a>
                            <a href="mi-cuenta.html#mis-cursos">Mis Cursos</a>
                            <a href="mi-cuenta.html#hoja-de-vida">Mi Hoja de Vida</a>
                            <a href="mi-cuenta.html#cambiar-password">Cambiar Contraseña</a>
                            <a href="#" id="logout-btn">Cerrar Sesión</a>
                        </div>
                    </div>
                `;
            } else {
                userActionsDiv.innerHTML = `<a href="cuenta.html" class="btn btn-secondary">Ingresar</a>`;
            }
        }
        
        // --- Lógica común para desplegables y logout ---
        const userMenuBtn = document.getElementById('user-menu-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        if (userMenuBtn && dropdownMenu) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear(); // Limpia todo para asegurar un logout completo
                window.location.href = 'index.html';
            });
        }
    }
    
    // --- Cierre global de desplegables ---
    document.addEventListener('click', (e) => {
        const userDropdown = document.getElementById('dropdown-menu');
        if (userDropdown && userDropdown.classList.contains('show') && !e.target.closest('.user-menu')) {
            userDropdown.classList.remove('show');
        }
        
        const empleosDropdown = document.getElementById('empleos-dropdown');
        if (empleosDropdown && empleosDropdown.classList.contains('show') && !e.target.closest('.dropdown')) {
            empleosDropdown.classList.remove('show');
            // Also remove the 'open' class for the arrow animation to reset
            empleosDropdown.parentElement.classList.remove('open');
        }
    });

    // --- DATOS GLOBALES (EMPLEOS Y CURSOS) ---
    // LISTA DE EMPLEOS PARA "VER OFERTAS"
    const initialVerOfertasJobs = [
        { id: 1, title: 'Desarrollador Frontend (React)', company: 'Tech Solutions Inc.', location: 'Remoto (Colombia)', type: 'Tiempo Completo', sector: 'Tecnología', description: 'Buscamos un desarrollador con 3+ años de experiencia en React, Redux, y TypeScript para crear interfaces de usuario modernas y eficientes.\n\nResponsabilidades:\n- Desarrollar componentes reutilizables.\n- Colaborar con el equipo de backend.\n- Optimizar la aplicación para máximo rendimiento.' },
        { id: 2, title: 'Especialista en Soporte al Cliente Bilingüe', company: 'Global Connect', location: 'Remoto (LATAM)', type: 'Tiempo Completo', sector: 'Atención al Cliente', description: 'Se requiere un agente de soporte bilingüe (español/inglés) para atender las consultas de nuestros clientes por chat, email y teléfono. Excelentes habilidades de comunicación son indispensables.' },
        { id: 8, title: 'Analista de Datos Jr.', company: 'Data Insights', location: 'Remoto', type: 'Tiempo Completo', sector: 'Tecnología', description: 'Buscamos un analista de datos junior para procesar y analizar grandes conjuntos de datos. Se requiere conocimiento en SQL y Python. ¡Gran oportunidad de crecimiento!' }
    ];

    // LISTA DE EMPLEOS PARA "BUSCAR EMPLEO"
    const initialBuscarEmpleoJobs = [
        { id: 3, title: 'Asistente Administrativo Virtual', company: 'Oficina Eficaz', location: 'Remoto', type: 'Medio Tiempo', sector: 'Administrativo', description: 'Organización de agenda, gestión de correos electrónicos, preparación de reportes y otras tareas administrativas. Se requiere proactividad y manejo de herramientas ofimáticas.' },
        { id: 7, title: 'Diseñador Gráfico UI/UX', company: 'Pixel Perfect', location: 'Remoto', type: 'Freelance', sector: 'Diseño', description: 'Diseñador con experiencia en la creación de interfaces intuitivas y atractivas para aplicaciones móviles y web. Es fundamental presentar un portafolio de trabajos previos.' },
        { id: 9, title: 'Project Manager Remoto', company: 'Innovate Co.', location: 'Remoto (Global)', type: 'Tiempo Completo', sector: 'Administrativo', description: 'Liderar proyectos de desarrollo de software, gestionando equipos remotos y asegurando la entrega a tiempo. Se requiere experiencia con metodologías ágiles como Scrum.'}
    ];

    function getAllPublishedJobs() {
        return JSON.parse(localStorage.getItem('publishedJobs')) || [];
    }

    function getAllCourses() {
        return [
            { id: 101, title: 'Curso de JavaScript Moderno (ES6+)', category: 'desarrollo-web', level: 'intermedio', hours: 40, description: 'Aprende las características más recientes de JavaScript, incluyendo promesas, async/await, módulos y más. Este curso es ideal para quienes ya tienen una base y quieren modernizar sus habilidades.' },
            { id: 102, title: 'Introducción a React y Hooks', category: 'desarrollo-web', level: 'intermedio', hours: 35, description: 'Crea interfaces de usuario interactivas y dinámicas con React, la librería más popular del mercado. Aprenderás a usar componentes, estado, props y los nuevos Hooks para una gestión del estado más sencilla.' },
            { id: 103, title: 'Fundamentos de Marketing Digital', category: 'marketing-digital', level: 'introductorio', hours: 20, description: 'Descubre el mundo del marketing online. Aprenderás sobre SEO, SEM, redes sociales y email marketing para lanzar y posicionar una marca en internet desde cero.' },
            { id: 104, title: 'Comunicación Efectiva para Equipos Remotos', category: 'habilidades-blandas', level: 'introductorio', hours: 10, description: 'Mejora tus habilidades de comunicación para colaborar de manera más eficiente en un entorno de teletrabajo. Aprenderás a usar herramientas de comunicación asíncrona y a dar feedback constructivo.' },
            { id: 105, title: 'Node.js: De Cero a Experto', category: 'desarrollo-web', level: 'avanzado', hours: 60, description: 'Conviértete en un desarrollador backend con Node.js. Crearás APIs RESTful, te conectarás a bases de datos y aprenderás a desplegar tus aplicaciones en la nube.' },
        ];
    }
    
    // --- LÓGICA PARA LA PÁGINA DE EMPLEOS ---
    if (document.getElementById('page-empleos')) {
        const publishedJobs = getAllPublishedJobs();
        const jobsForVerOfertasView = [...publishedJobs, ...initialVerOfertasJobs];
        const jobsForBuscarEmpleoView = [...publishedJobs, ...initialBuscarEmpleoJobs];
        
        // Unimos todas las ofertas posibles para poder buscar detalles sin importar la vista
        const allPossibleJobs = [...new Map([...jobsForVerOfertasView, ...jobsForBuscarEmpleoView].map(job => [job.id, job])).values()];

        const verOfertasView = document.getElementById('ver-ofertas-view');
        const buscarEmpleoView = document.getElementById('buscar-empleo-view');
        const detailContainerAll = document.getElementById('job-detail-container-all');
        const detailContainerSearch = document.getElementById('job-detail-container-search');
    
        function handleHash() {
            const hash = window.location.hash;
    
            if (hash.includes('#buscar-empleo')) {
                verOfertasView.style.display = 'none';
                buscarEmpleoView.style.display = 'block';
            } else {
                verOfertasView.style.display = 'block';
                buscarEmpleoView.style.display = 'none';
            }
    
            if (hash.includes('&job=')) {
                const jobIdToSelect = parseInt(hash.split('&job=')[1], 10);
                if (!isNaN(jobIdToSelect)) {
                    setTimeout(() => {
                        const cardToSelect = document.querySelector(`.card[data-job-id="${jobIdToSelect}"]`);
                        if (cardToSelect) {
                            document.querySelectorAll('.card.active-job').forEach(card => card.classList.remove('active-job'));
                            cardToSelect.classList.add('active-job');
                            const detailContainer = verOfertasView.style.display === 'block' ? detailContainerAll : detailContainerSearch;
                            renderJobDetails(jobIdToSelect, detailContainer);
                            cardToSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                }
            }
        }
        window.addEventListener('hashchange', handleHash);
    
        function renderJobDetails(jobId, container) {
            const job = allPossibleJobs.find(j => j.id === jobId);
            if (!job || !container) return;
    
            const appliedJobs = JSON.parse(localStorage.getItem('userApplications')) || [];
            const favoriteJobs = JSON.parse(localStorage.getItem('userFavorites')) || [];
            const isApplied = appliedJobs.includes(job.id);
            const isFavorite = favoriteJobs.includes(job.id);
    
            container.innerHTML = `
                <div class="job-detail-content">
                    <h2>${job.title}</h2>
                    <p class="card-meta">${job.company}</p>
                    <div class="card-details">
                        <span>📍 ${job.location}</span>
                        <span>📄 ${job.type}</span>
                        <span>🔍 ${job.sector}</span>
                    </div>
                    <div class="job-description">${job.description || 'No hay una descripción disponible para esta oferta.'}</div>
                    <div class="card-actions">
                        <button class="btn btn-favorite" data-job-id="${job.id}">${isFavorite ? '★ Guardada' : '☆ Guardar'}</button>
                        <button class="btn btn-apply" data-job-id="${job.id}" ${isApplied ? 'disabled' : ''}>${isApplied ? 'Postulado' : 'Postularse'}</button>
                    </div>
                </div>`;
        }
        
        function resetDetailView(container) {
            if (container) {
                 container.innerHTML = `
                    <div class="job-detail-placeholder">
                        <h3>Selecciona una oferta</h3>
                        <p>Los detalles del empleo aparecerán aquí.</p>
                    </div>`;
            }
        }
    
        function renderJobs(container, jobList) {
             if (!container) return;
             container.innerHTML = jobList.length === 0 ? '<p>No se encontraron ofertas.</p>' : '';
             jobList.forEach(job => {
                const card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-job-id', job.id);
                card.innerHTML = `
                    <h3>${job.title}</h3>
                    <p class="card-meta">${job.company}</p>
                    <div class="card-details">
                        <span>📍 ${job.location}</span>
                        <span>📄 ${job.type}</span>
                    </div>`;
                container.appendChild(card);
            });
        }
    
        // Render inicial de la vista "Ver Ofertas"
        const allJobsContainer = document.getElementById('all-jobs-container');
        renderJobs(allJobsContainer, jobsForVerOfertasView);
        handleHash(); 
        
        const searchInput = document.getElementById('search-job');
        const typeFilter = document.getElementById('tipo-empleo');
        const sectorFilter = document.getElementById('sector-empleo');
        const searchResultsContainer = document.getElementById('job-listings-search-results');
        
        function filterAndRenderJobs() {
            if (!searchResultsContainer) return;
            searchResultsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Filtrando...</p>';

            setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedType = typeFilter.value;
                const selectedSector = sectorFilter.value;
        
                const filteredJobs = jobsForBuscarEmpleoView.filter(job => 
                    (job.title.toLowerCase().includes(searchTerm) || job.company.toLowerCase().includes(searchTerm)) &&
                    (selectedType === 'todos' || job.type === selectedType) &&
                    (selectedSector === 'todos' || job.sector === selectedSector)
                );
                renderJobs(searchResultsContainer, filteredJobs);
                resetDetailView(detailContainerSearch);
            }, 200);
        }
        
        if(searchInput && typeFilter && sectorFilter) {
            [searchInput, typeFilter, sectorFilter].forEach(el => el.addEventListener('input', filterAndRenderJobs));
            // Render inicial de la vista "Buscar Empleo"
            filterAndRenderJobs();
        }
        
        document.getElementById('page-empleos').addEventListener('click', function(e) {
            const clickedCard = e.target.closest('.card');
            
            if (clickedCard && clickedCard.dataset.jobId) {
                const jobId = parseInt(clickedCard.dataset.jobId, 10);
                const detailContainer = verOfertasView.style.display === 'block' ? detailContainerAll : detailContainerSearch;
                
                if (clickedCard.classList.contains('active-job')) {
                    clickedCard.classList.remove('active-job');
                    resetDetailView(detailContainer);
                } else {
                    document.querySelectorAll('.card.active-job').forEach(card => card.classList.remove('active-job'));
                    clickedCard.classList.add('active-job');
                    renderJobDetails(jobId, detailContainer);
                }
            }
    
            const user = localStorage.getItem('loggedInUser');
            const isActionButton = e.target.classList.contains('btn-apply') || e.target.classList.contains('btn-favorite');
            
            if (isActionButton && !user) {
                alert('Debes iniciar sesión para realizar esta acción.');
                window.location.href = 'cuenta.html';
                return;
            }
    
            if (e.target.classList.contains('btn-apply')) {
                const hasCV = localStorage.getItem('userHasCV') === 'true';
                if (!hasCV) {
                    alert('Por favor, sube primero tu hoja de vida en la sección "Mi Cuenta".');
                    window.location.href = 'mi-cuenta.html#hoja-de-vida';
                    return;
                }
                const button = e.target;
                const jobId = parseInt(button.dataset.jobId, 10);
                let appliedJobs = JSON.parse(localStorage.getItem('userApplications')) || [];
                if (!appliedJobs.includes(jobId)) {
                    appliedJobs.push(jobId);
                    localStorage.setItem('userApplications', JSON.stringify(appliedJobs));
                    alert('¡Postulación exitosa!');
                    button.textContent = 'Postulado';
                    button.disabled = true;
                }
            }
    
            if (e.target.classList.contains('btn-favorite')) {
                const button = e.target;
                const jobId = parseInt(button.dataset.jobId, 10);
                let favoriteJobs = JSON.parse(localStorage.getItem('userFavorites')) || [];
                if (favoriteJobs.includes(jobId)) {
                    favoriteJobs = favoriteJobs.filter(id => id !== jobId);
                    button.textContent = '☆ Guardar';
                } else {
                    favoriteJobs.push(jobId);
                    button.textContent = '★ Guardada';
                }
                localStorage.setItem('userFavorites', JSON.stringify(favoriteJobs));
            }
        });
    }

    
    // --- LÓGICA PARA LA PÁGINA "MI CUENTA" (USUARIO) ---
    if (document.body.getAttribute('data-page') === 'mi-cuenta') {
        const allJobs = [...getAllPublishedJobs(), ...initialVerOfertasJobs, ...initialBuscarEmpleoJobs];
        
        function renderAppliedJobs() {
            const applicationsContainer = document.getElementById('applications-container');
            if (!applicationsContainer) return;
            const appliedJobIds = JSON.parse(localStorage.getItem('userApplications')) || [];
            if (appliedJobIds.length === 0) {
                applicationsContainer.innerHTML = '<p>Aún no te has postulado a ninguna oferta.</p>';
                return;
            }
            
            const appliedJobs = allJobs.filter(job => appliedJobIds.includes(job.id));
            applicationsContainer.innerHTML = ''; 
            appliedJobs.forEach(job => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3><a href="empleos.html#ver-ofertas&job=${job.id}">${job.title}</a></h3>
                    <p class="card-meta">${job.company}</p>
                    <div class="card-details">
                        <span>📍 ${job.location}</span>
                        <span>📄 ${job.type}</span>
                    </div>`;
                applicationsContainer.appendChild(card);
            });
        }
        
        function renderFavoriteJobs() {
            const favoritesContainer = document.getElementById('favorites-container');
            if (!favoritesContainer) return;
            const favoriteJobIds = JSON.parse(localStorage.getItem('userFavorites')) || [];
            if (favoriteJobIds.length === 0) {
                favoritesContainer.innerHTML = '<p>No has guardado ninguna oferta como favorita.</p>';
                return;
            }
            
            const favoriteJobs = allJobs.filter(job => favoriteJobIds.includes(job.id));
            favoritesContainer.innerHTML = ''; 
            favoriteJobs.forEach(job => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3><a href="empleos.html#ver-ofertas&job=${job.id}">${job.title}</a></h3>
                    <p class="card-meta">${job.company}</p>
                    <div class="card-details">
                        <span>📍 ${job.location}</span>
                        <span>📄 ${job.type}</span>
                    </div>`;
                favoritesContainer.appendChild(card);
            });
        }

        function renderEnrolledCourses() {
            const container = document.getElementById('courses-container');
            if (!container) return;
    
            const enrolledCourseIds = JSON.parse(localStorage.getItem('userCourses')) || [];
            if (enrolledCourseIds.length === 0) {
                container.innerHTML = '<p>No te has inscrito a ningún curso todavía.</p>';
                return;
            }
    
            const allCourses = getAllCourses();
            const enrolledCourses = allCourses.filter(course => enrolledCourseIds.includes(course.id));
    
            container.innerHTML = '';
            enrolledCourses.forEach(course => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${course.title}</h3>
                    <div class="card-details">
                        <span>📚 ${course.category.replace('-', ' ')}</span>
                        <span>⭐ Nivel: ${course.level}</span>
                        <span>🕐 Horas: ${course.hours}</span>
                    </div>`;
                container.appendChild(card);
            });
        }

        const uploadCvForm = document.getElementById('upload-cv-form');
        const uploadedCvView = document.getElementById('uploaded-cv-view');
        const deleteCvBtn = document.getElementById('delete-cv-btn');
        
        function renderCVSection() {
            if (!uploadCvForm || !uploadedCvView) return;
            if (localStorage.getItem('userHasCV') === 'true') {
                uploadCvForm.style.display = 'none';
                uploadedCvView.style.display = 'block';
            } else {
                uploadCvForm.style.display = 'block';
                uploadedCvView.style.display = 'none';
            }
        }

        if (uploadCvForm) {
            uploadCvForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (document.getElementById('cv-file').files.length > 0) {
                    localStorage.setItem('userHasCV', 'true');
                    alert('¡Hoja de vida subida con éxito!');
                    renderCVSection();
                } else {
                    alert('Por favor, selecciona un archivo PDF.');
                }
            });
        }

        if (deleteCvBtn) {
            deleteCvBtn.addEventListener('click', function() {
                if (confirm('¿Estás seguro? Se eliminarán también tus postulaciones guardadas.')) {
                    localStorage.removeItem('userHasCV');
                    localStorage.removeItem('userApplications');
                    alert('Hoja de vida eliminada.');
                    renderCVSection();
                    renderAppliedJobs();
                }
            });
        }
        
        renderAppliedJobs();
        renderFavoriteJobs();
        renderEnrolledCourses();
        renderCVSection();
    }

    // --- LÓGICA PARA PÁGINAS DE CUENTA (LOGIN/REGISTRO) ---
    if (document.querySelector('.account-container')) {
        document.querySelectorAll('.tab-link').forEach(tab => {
            tab.addEventListener('click', () => {
                const target = document.getElementById(tab.dataset.tab);
                document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                target.classList.add('active');
            });
        });

        const userLoginForm = document.getElementById('user-login-form');
        if (userLoginForm) {
            userLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userName = document.getElementById('login-email').value.split('@')[0];
                localStorage.setItem('loggedInUser', userName);
                alert('¡Inicio de sesión exitoso!');
                window.location.href = 'mi-cuenta.html';
            });
        }

        const userRegisterForm = document.getElementById('user-register-form');
        if (userRegisterForm) {
            userRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const userName = document.getElementById('reg-name').value;
                localStorage.setItem('loggedInUser', userName);
                alert('¡Cuenta creada con éxito!');
                window.location.href = 'mi-cuenta.html';
            });
        }
        
        const companyLoginForm = document.getElementById('company-login-form');
        if (companyLoginForm) {
            companyLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const companyName = document.getElementById('login-email-empresa').value.split('@')[0];
                localStorage.setItem('loggedInCompany', companyName);
                alert('¡Inicio de sesión de empresa exitoso!');
                window.location.href = 'panel-empresa.html';
            });
        }

        const companyRegisterForm = document.getElementById('company-register-form');
        if (companyRegisterForm) {
            companyRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const companyName = document.getElementById('reg-company-name').value;
                localStorage.setItem('loggedInCompany', companyName);
                alert('¡Empresa registrada con éxito!');
                window.location.href = 'panel-empresa.html';
            });
        }
    }
    
    // --- LÓGICA PARA PÁGINA DE EMPRESA (PANEL) ---
    if (document.body.getAttribute('data-page') === 'panel-empresa') {
        const loggedInCompany = localStorage.getItem('loggedInCompany');
        if (!loggedInCompany) {
            alert('Debes iniciar sesión como empresa para acceder a este panel.');
            window.location.href = 'cuenta-empresa.html';
            return;
        }

        const publishForm = document.getElementById('publish-job-form');
        const publishedContainer = document.getElementById('published-jobs-container');
        const editingJobIdInput = document.getElementById('editing-job-id');
        const publishBtn = document.getElementById('publish-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const formTitle = document.getElementById('form-title');

        function resetForm() {
            publishForm.reset();
            editingJobIdInput.value = '';
            publishBtn.textContent = 'Publicar Oferta';
            formTitle.textContent = 'Publicar Nueva Oferta';
            cancelEditBtn.style.display = 'none';
        }

        publishForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let publishedJobs = getAllPublishedJobs();
            const editingId = parseInt(editingJobIdInput.value, 10);
            
            const jobData = {
                title: document.getElementById('job-title').value,
                company: loggedInCompany,
                location: document.getElementById('job-location').value,
                type: document.getElementById('job-type').value,
                sector: document.getElementById('job-sector').value,
                description: document.getElementById('job-description').value,
            };

            if (editingId) {
                let found = false;
                publishedJobs = publishedJobs.map(job => {
                    if (job.id === editingId) {
                        found = true;
                        return { ...job, ...jobData };
                    }
                    return job;
                });

                if (found) {
                     alert('¡Oferta actualizada con éxito!');
                } else {
                    jobData.id = new Date().getTime();
                    publishedJobs.unshift(jobData);
                }
               
            } else {
                jobData.id = new Date().getTime();
                publishedJobs.unshift(jobData);
                alert('¡Oferta publicada con éxito!');
            }
            
            localStorage.setItem('publishedJobs', JSON.stringify(publishedJobs));
            resetForm();
            renderPublishedJobs();
        });

        publishedContainer.addEventListener('click', (e) => {
            const target = e.target;
            const jobId = parseInt(target.getAttribute('data-job-id'), 10);
            if (!jobId) return;

            if (target.classList.contains('btn-delete')) {
                if (confirm('¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.')) {
                    let publishedJobs = getAllPublishedJobs();
                    publishedJobs = publishedJobs.filter(job => job.id !== jobId);
                    localStorage.setItem('publishedJobs', JSON.stringify(publishedJobs));
                    renderPublishedJobs();
                    resetForm();
                }
            }

            if (target.classList.contains('btn-edit')) {
                const allJobs = [...getAllPublishedJobs(), ...initialVerOfertasJobs, ...initialBuscarEmpleoJobs];
                const jobToEdit = allJobs.find(job => job.id === jobId);
                if (jobToEdit) {
                    document.getElementById('job-title').value = jobToEdit.title;
                    document.getElementById('job-location').value = jobToEdit.location;
                    document.getElementById('job-type').value = jobToEdit.type;
                    document.getElementById('job-sector').value = jobToEdit.sector;
                    document.getElementById('job-description').value = jobToEdit.description;
                    editingJobIdInput.value = jobToEdit.id;
                    
                    formTitle.textContent = 'Editando Oferta';
                    publishBtn.textContent = 'Actualizar Oferta';
                    cancelEditBtn.style.display = 'inline-block';
                    document.getElementById('publicar-oferta').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        cancelEditBtn.addEventListener('click', resetForm);

        function renderPublishedJobs() {
            if (!publishedContainer) return;
            const myJobs = getAllPublishedJobs().filter(job => job.company === loggedInCompany);

            if (myJobs.length === 0) {
                publishedContainer.innerHTML = '<p>Aún no has publicado ninguna oferta.</p>';
                return;
            }
            publishedContainer.innerHTML = '';
            myJobs.forEach(job => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <h3>${job.title}</h3>
                    <div class="card-details">
                        <span>📍 ${job.location}</span>
                        <span>📄 ${job.type}</span>
                        <span>🔍 ${job.sector}</span>
                    </div>
                    <p class="card-description">${job.description}</p>
                    <div class="published-job-actions">
                        <button class="btn btn-edit" data-job-id="${job.id}">Editar</button>
                        <button class="btn btn-delete" data-job-id="${job.id}">Eliminar</button>
                    </div>`;
                publishedContainer.appendChild(card);
            });
        }
        renderPublishedJobs();
    }

    // --- LÓGICA PARA LA PÁGINA DE CAPACITACIÓN ---
    if (document.getElementById('buscar-cursos')) {
        const pageContainer = document.getElementById('buscar-cursos');
        const courseListings = document.getElementById('course-listings');
        const searchInput = document.getElementById('search-course');
        const categoryFilter = document.getElementById('categoria-curso');
        const levelFilter = document.getElementById('nivel-curso');
        const detailContainer = document.getElementById('course-detail-container');
        const allCourses = getAllCourses();

        function renderCourseDetails(courseId, container) {
            const course = allCourses.find(c => c.id === courseId);
            if (!course || !container) return;
            
            const enrolledCourses = JSON.parse(localStorage.getItem('userCourses')) || [];
            const isEnrolled = enrolledCourses.includes(course.id);
        
            container.innerHTML = `
                <div class="course-detail-content">
                    <h2>${course.title}</h2>
                    <div class="card-details">
                        <span>📚 ${course.category.replace('-', ' ')}</span>
                        <span>⭐ Nivel: ${course.level}</span>
                        <span>🕐 Horas: ${course.hours}</span>
                    </div>
                    <p class="course-description">${course.description || 'No hay una descripción disponible para este curso.'}</p>
                    <div class="card-actions">
                        <button class="btn btn-primary btn-full btn-enroll" data-course-id="${course.id}" ${isEnrolled ? 'disabled' : ''}>
                            ${isEnrolled ? '✔ Inscrito' : 'Inscribirse Ahora'}
                        </button>
                    </div>
                </div>`;
        }
        
        function resetCourseDetailView(container) {
            if (container) {
                 container.innerHTML = `
                    <div class="course-detail-placeholder">
                        <h3>Selecciona un curso</h3>
                        <p>Los detalles completos del curso aparecerán aquí.</p>
                    </div>`;
            }
        }

        function renderCourses(courses) {
            if (!courseListings) return;
            courseListings.innerHTML = courses.length === 0 ? '<p>No se encontraron cursos que coincidan con tu búsqueda.</p>' : '';
            courses.forEach(course => {
                const card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('data-course-id', course.id);
                card.innerHTML = `
                    <h3>${course.title}</h3>
                    <div class="card-details">
                        <span>📚 Categoría: ${course.category.replace('-', ' ')}</span>
                        <span>⭐ Nivel: ${course.level}</span>
                    </div>`;
                courseListings.appendChild(card);
            });
        }

        function filterAndRenderCourses() {
            if (!courseListings) return;
            courseListings.innerHTML = '<p style="text-align:center; padding: 20px;">Filtrando...</p>';
            
            setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedCategory = categoryFilter.value;
                const selectedLevel = levelFilter.value;
                const filteredCourses = allCourses.filter(c => 
                    c.title.toLowerCase().includes(searchTerm) &&
                    (selectedCategory === 'todos' || c.category === selectedCategory) &&
                    (selectedLevel === 'todos' || c.level === selectedLevel)
                );
                renderCourses(filteredCourses);
                resetCourseDetailView(detailContainer);
            }, 200);
        }

        [searchInput, categoryFilter, levelFilter].forEach(el => el.addEventListener('input', filterAndRenderCourses));

        pageContainer.addEventListener('click', function(e) {
            const clickedCard = e.target.closest('.card');
        
            if (clickedCard && clickedCard.dataset.courseId) {
                const courseId = parseInt(clickedCard.dataset.courseId, 10);
        
                if (clickedCard.classList.contains('active-course')) {
                    clickedCard.classList.remove('active-course');
                    resetCourseDetailView(detailContainer);
                } else {
                    document.querySelectorAll('.card.active-course').forEach(card => card.classList.remove('active-course'));
                    clickedCard.classList.add('active-course');
                    renderCourseDetails(courseId, detailContainer);
                }
            }

            if (e.target.classList.contains('btn-enroll')) {
                const user = localStorage.getItem('loggedInUser');
                if (!user) {
                    alert('Debes iniciar sesión para inscribirte a un curso.');
                    window.location.href = 'cuenta.html';
                    return;
                }
    
                const button = e.target;
                const courseId = parseInt(button.dataset.courseId, 10);
                let enrolledCourses = JSON.parse(localStorage.getItem('userCourses')) || [];
    
                if (!enrolledCourses.includes(courseId)) {
                    enrolledCourses.push(courseId);
                    localStorage.setItem('userCourses', JSON.stringify(enrolledCourses));
                    alert('¡Inscripción exitosa!');
                    button.textContent = '✔ Inscrito';
                    button.disabled = true;
                }
            }
        });

        renderCourses(allCourses);
    }

    // --- LÓGICA: WIDGET DE CHAT POP-UP ---
    if (document.querySelector('.chat-popup-widget')) {
        const toggleBtn = document.getElementById('chat-toggle-btn');
        const chatContainer = document.getElementById('ai-chat-container');
        const chatForm = document.getElementById('chat-form');
        const chatWindow = document.getElementById('chat-window');
        const chatInput = document.getElementById('chat-input');
        
        toggleBtn.addEventListener('click', () => {
             chatContainer.classList.toggle('show');
             if (chatContainer.classList.contains('show') && chatWindow.children.length === 0) {
                appendMessage('¡Hola! Soy tu asistente virtual de ConectaEmpleo. ¿Cómo puedo ayudarte?', 'ai');
             }
        });

        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userMessage = chatInput.value.trim();
            if (userMessage) {
                appendMessage(userMessage, 'user');
                chatInput.value = '';
                const thinkingMessage = appendMessage('Procesando...', 'ai thinking');
                
                const randomDelay = Math.random() * 1200 + 800;

                setTimeout(() => {
                    const pageMode = document.body.getAttribute('data-page-mode') || 'personas';
                    const response = getIntelligentAIResponse(userMessage, pageMode);
                    thinkingMessage.innerHTML = response;
                    thinkingMessage.classList.remove('thinking');
                }, randomDelay);
            }
        });

        function appendMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${type}`;
            messageDiv.innerHTML = text;
            chatWindow.appendChild(messageDiv);
            chatWindow.scrollTop = chatWindow.scrollHeight;
            return messageDiv;
        }

        function getIntelligentAIResponse(message, mode) {
            const msg = message.toLowerCase();

            function getIntent(text) {
                if (/\b(publicar|postear|subir|crear)\b.*\b(oferta|vacante|empleo)\b/.test(text)) return 'CREATE_JOB';
                if (/\b(editar|modificar|cambiar)\b.*\b(oferta|vacante|publicaci.n)\b/.test(text)) return 'EDIT_JOB';
                if (/\b(eliminar|borrar|quitar)\b.*\b(oferta|vacante|publicaci.n)\b/.test(text)) return 'DELETE_JOB';
                if (/\b(costo|precio|gratis|pagar)\b/.test(text)) return 'GET_COST';
                if (/\b(candidatos|postulantes|ver CV)\b/.test(text)) return 'VIEW_CANDIDATES';
                if (/\b(postularme|aplicar|enviar CV)\b/.test(text)) return 'APPLY_JOB';
                if (/\b(contrase.a|clave|password)\b/.test(text)) return 'CHANGE_PASSWORD';
                if (/\b(CV|hoja de vida|curr.culum)\b/.test(text)) return 'UPLOAD_CV';
                if (/\b(favoritos|guardados)\b/.test(text)) return 'VIEW_FAVORITES';
                if (/\b(cursos|capacitaci.n|aprender)\b/.test(text)) return 'VIEW_COURSES';
                if (/\b(hola|buenas|saludos)\b/.test(text)) return 'GREETING';
                if (/\b(gracias|agradezco)\b/.test(text)) return 'THANKS';
                if (/\b(soporte|ayuda|contacto)\b/.test(text)) return 'GET_SUPPORT';
                return 'UNKNOWN';
            }

            const intent = getIntent(msg);

            switch (intent) {
                case 'CREATE_JOB':
                    if (mode === 'empresas') return '¡Claro! Para publicar una nueva oferta, solo tienes que ir a tu <strong>Panel de Empresa</strong> y llenar el formulario en la sección "Publicar Nueva Oferta". Es rápido y sencillo.';
                    else return 'Parece que quieres publicar una oferta. Para eso, necesitas estar en el modo <strong>Empresas</strong>. Puedes cambiar de modo en la parte superior de la página.';
                case 'EDIT_JOB':
                     if (mode === 'empresas') return 'Para modificar una de tus ofertas, dirígete a tu <strong>Panel de Empresa</strong>. En la sección "Mis Ofertas Publicadas", encontrarás el botón "Editar" en cada una de tus vacantes.';
                     else return 'La edición de ofertas es una función para empresas. Si tienes una cuenta de empresa, por favor, ingresa en ese modo para gestionar tus publicaciones.';
                case 'DELETE_JOB':
                     if (mode === 'empresas') return 'Puedes eliminar cualquier oferta desde tu <strong>Panel de Empresa</strong>. Ve a "Mis Ofertas Publicadas" y haz clic en el botón "Eliminar" de la vacante que ya no necesites. Ten en cuenta que esta acción es definitiva.';
                     else return 'Solo las empresas pueden eliminar ofertas de empleo. Si eres el representante de una, por favor, ingresa al modo Empresas.';
                case 'GET_COST':
                    return 'Publicar tus ofertas de empleo en <strong>ConectaEmpleo</strong> es ¡totalmente <strong>gratuito</strong>! Nuestro objetivo es facilitar la conexión entre el talento y las oportunidades sin barreras.';
                case 'VIEW_CANDIDATES':
                    return 'Actualmente, la gestión de candidatos se realiza fuera de la plataforma. Estamos trabajando para integrar un panel de seguimiento de postulantes muy pronto. ¡Gracias por tu paciencia!';
                case 'APPLY_JOB':
                    if (mode === 'personas') return '¡Excelente! Para postularte a un empleo, primero debes subir tu Hoja de Vida en la sección <a href="mi-cuenta.html#hoja-de-vida">Mi Cuenta</a>. Una vez hecho, simplemente navega a la página de <a href="empleos.html">Empleos</a> y presiona el botón "Postularse".';
                    else return 'Entiendo que quieres postularte a un empleo. Esa función está disponible en el modo <strong>Personas</strong>. Puedes cambiar de modo en la parte superior de la página.';
                case 'CHANGE_PASSWORD':
                    return 'Puedes cambiar tu contraseña en cualquier momento desde tu panel de usuario. Solo tienes que ir a la sección <a href="mi-cuenta.html#cambiar-password">"Cambiar mi Contraseña"</a>.';
                case 'UPLOAD_CV':
                    return 'Puedes subir y gestionar tu Hoja de Vida (CV) en formato PDF desde tu panel de usuario. Dirígete a <a href="mi-cuenta.html#hoja-de-vida">Mi Cuenta</a> para empezar.';
                case 'VIEW_FAVORITES':
                    return 'Puedes ver todas las ofertas que has guardado en la sección de <a href="mi-cuenta.html#favoritos">Mis Ofertas Favoritas</a> dentro de tu panel de usuario.';
                case 'VIEW_COURSES':
                    return 'Descubre todos los cursos que tenemos para ti en nuestra sección de <a href="capacitacion.html">Capacitación</a>. ¡Es una gran forma de mejorar tu perfil!';
                case 'GREETING':
                    return '¡Hola! Es un gusto ayudarte. ¿Qué información necesitas?';
                case 'THANKS':
                    return '¡De nada! Estoy aquí para lo que necesites. Si tienes otra duda, solo pregunta.';
                case 'GET_SUPPORT':
                    return 'Entendido. Si necesitas ayuda de un humano, puedes contactar a nuestro excelente equipo en la página de <a href="soporte.html">Soporte</a>.';
                case 'UNKNOWN':
                default:
                    return 'Hmm, no estoy seguro de haber entendido. Puedo ayudarte con preguntas sobre cómo postularte a empleos, publicar vacantes o gestionar tu cuenta. ¿Podrías intentar reformular tu pregunta?';
            }
        }
    }
    
    // --- LÓGICA PARA LA PÁGINA DE SOPORTE (HEADER DINÁMICO) ---
    if (document.getElementById('soporte-contacto')) {
        const lastMode = localStorage.getItem('lastVisitedMode') || 'personas';
        const switcherContainer = document.querySelector('.mode-switcher');
        const navContainer = document.querySelector('.nav');

        if (lastMode === 'empresas') {
            document.body.setAttribute('data-page-mode', 'empresas');
            if (switcherContainer) switcherContainer.innerHTML = `<a href="index.html" class="mode-link">Personas</a><a href="empresas.html" class="mode-link active">Empresas</a>`;
            if (navContainer) navContainer.innerHTML = `
                <ul>
                    <li><a href="empresas.html">Inicio Empresas</a></li>
                    <li><a href="panel-empresa.html#publicar-oferta">Publicar Oferta</a></li>
                    <li><a href="soporte.html" class="active">Soporte</a></li>
                </ul>`;
        } else {
             document.body.setAttribute('data-page-mode', 'personas');
             if (switcherContainer) switcherContainer.innerHTML = `<a href="index.html" class="mode-link active">Personas</a><a href="empresas.html" class="mode-link">Empresas</a>`;
             if (navContainer) navContainer.innerHTML = `
                <ul>
                    <li><a href="index.html">Inicio</a></li>
                    <li class="dropdown">
                        <a href="empleos.html" id="empleos-nav-link" class="dropdown-toggle">Empleos <span class="nav-arrow"></span></a>
                        <div class="navbar-dropdown" id="empleos-dropdown">
                            <a href="empleos.html#ver-ofertas" class="navbar-item">Ver Ofertas</a>
                            <a href="empleos.html#buscar-empleo" class="navbar-item">Buscar Empleo</a>
                        </div>
                    </li>
                    <li><a href="capacitacion.html">Capacitación</a></li>
                    <li><a href="soporte.html" class="active">Soporte</a></li>
                </ul>`;
        }
        
        initializeEmpleosDropdown(); 
        checkLoginStatus();

    } else {
        const currentMode = document.body.getAttribute('data-page-mode');
        if (currentMode) {
            localStorage.setItem('lastVisitedMode', currentMode);
        }
        initializeEmpleosDropdown();
        checkLoginStatus();
    }

    // --- LÓGICA: MENÚS DESPLEGABLES PERSONALIZADOS ---
    function initializeCustomSelects() {
        const selectWrappers = document.querySelectorAll('.custom-select-wrapper');

        selectWrappers.forEach(wrapper => {
            const trigger = wrapper.querySelector('.custom-select-trigger');
            const options = wrapper.querySelectorAll('.custom-option');
            const nativeSelect = wrapper.querySelector('.native-select');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.custom-select-wrapper.open').forEach(openWrapper => {
                    if (openWrapper !== wrapper) {
                        openWrapper.classList.remove('open');
                    }
                });
                wrapper.classList.toggle('open');
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedValue = option.getAttribute('data-value');
                    const selectedText = option.textContent;

                    if (wrapper.querySelector('.custom-option.selected')) {
                        wrapper.querySelector('.custom-option.selected').classList.remove('selected');
                    }
                    option.classList.add('selected');
                    trigger.querySelector('span').textContent = selectedText;
                    nativeSelect.value = selectedValue;
                    nativeSelect.dispatchEvent(new Event('input', { bubbles: true }));
                    wrapper.classList.remove('open');
                });
            });
        });

        window.addEventListener('click', () => {
            document.querySelectorAll('.custom-select-wrapper.open').forEach(wrapper => {
                wrapper.classList.remove('open');
            });
        });
    }

    initializeCustomSelects();

});