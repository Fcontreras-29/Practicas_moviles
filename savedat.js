// Configuración de Supabase
const SUPABASE_URL = 'https://ibgomcgcxxntvcgxrtqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZ29tY2djeHhudHZjZ3hydHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDEyNTcsImV4cCI6MjA1ODUxNzI1N30.qdCrovV1vhKfLc7zSdfsyDFaEMlAcixDmqA3GOCeNuk';

document.addEventListener('DOMContentLoaded', function() {
    const loadButton = document.getElementById('loadButton');
    const userForm = document.getElementById('userForm');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const formMessage = document.getElementById('formMessage');
    const tableBody = document.querySelector('#userTable tbody');

    // Función para determinar el tipo de usuario
    function getUserType(user) {
        if (user.usuario_superadministrador) {
            return '<span class="badge badge-superadmin">Super Admin</span>';
        } else if (user.usuario_administrador) {
            return '<span class="badge badge-admin">Administrador</span>';
        } else {
            return '<span class="badge badge-normal">Usuario Normal</span>';
        }
    }

    // Función para cargar los usuarios
    async function loadUsers() {
        loadingMessage.style.display = 'block';
        loadingMessage.textContent = 'Cargando datos...';
        errorMessage.style.display = 'none';
        tableBody.innerHTML = '';

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?select=*`, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const users = await response.json();

            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay usuarios registrados</td></tr>';
            } else {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id_Usuario || 'N/A'}</td>
                        <td>${user.Identificacion || 'N/A'}</td>
                        <td>${user.Nombre_Usuario || 'N/A'}</td>
                        <td>${getUserType(user)}</td>
                        <td>${user.email || 'N/A'}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Error al cargar usuarios: ${error.message}`;
            console.error('Error:', error);
        } finally {
            loadingMessage.style.display = 'none';
        }
    }

    // Función para registrar un nuevo usuario
    async function registerUser(userData) {
        formMessage.style.display = 'none';
        loadingMessage.style.display = 'block';
        loadingMessage.textContent = 'Registrando usuario...';

        try {
            // Determinar el tipo de usuario
            let usuarioData = {
                Identificacion: parseInt(userData.Identificacion),
                Nombre_Usuario: userData.Nombre_Usuario,
                Clave_Encriptada: userData.Clave_Encriptada,
                email: userData.email,
                Usuario_Normal: 0,
                Usuario_Administrador: 0,
                Usuario_Superadministrador: 0
            };

            // Asignar el tipo de usuario correcto
            switch(userData.tipo_usuario) {
                case 'normal':
                    usuarioData.usuario_normal = 1;
                    break;
                case 'administrador':
                    usuarioData.usuario_administrador = 1;
                    break;
                case 'superadministrador':
                    usuarioData.usuario_superadministrador = 1;
                    break;
            }

            const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify([usuarioData])
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const newUser = await response.json();

            formMessage.style.display = 'block';
            formMessage.textContent = 'Usuario registrado con éxito!';
            formMessage.className = 'message success';

            // Limpiar el formulario
            userForm.reset();

            // Actualizar la lista de usuarios
            await loadUsers();
        } catch (error) {
            formMessage.style.display = 'block';
            formMessage.textContent = `Error al registrar usuario: ${error.message}`;
            formMessage.className = 'message error';
            console.error('Error:', error);
        } finally {
            loadingMessage.style.display = 'none';
        }
    }

    // Evento para cargar usuarios
    loadButton.addEventListener('click', loadUsers);

    // Evento para enviar el formulario
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userData = {
            Identificacion: document.getElementById('Identificacion').value,
            Nombre_Usuario: document.getElementById('Nombre_Usuario').value,
            Clave_Encriptada: document.getElementById('Clave_Encriptada').value,
            email: document.getElementById('email').value,
            tipo_usuario: document.querySelector('input[name="tipo_usuario"]:checked').value
        };

        registerUser(userData);
    });

    // Cargar usuarios al iniciar
    loadUsers();
});