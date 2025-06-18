// Elementos del DOM
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const loginMessage = document.getElementById('login-message');
const messageText = document.getElementById('message-text');
const rememberMeCheckbox = document.getElementById('remember-me');
const loginButton = document.getElementById('login-button');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');

// Variable para almacenar los usuarios
let users = [];

// Verificar si hay credenciales guardadas
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedUsername && savedPassword) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }
    
    // Cargar usuarios desde la API
    fetchUsers();
});

// Función para cargar usuarios desde la API
async function fetchUsers() {
    try {
        const response = await fetch('https://dummyjson.com/users?limit=100');
        if (!response.ok) throw new Error('Error al obtener usuarios');
        const data = await response.json();
        users = data.users;
        console.log('Usuarios cargados:', users.length);
    } catch (error) {
        console.error('Error fetching users:', error);
        showMessage('Error al cargar usuarios. Por favor, inténtalo más tarde.', 'danger');
    }
}

// Función para mostrar/ocultar la contraseña
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Cambiar el ícono
    togglePasswordBtn.innerHTML = type === 'password' ? 
        '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

// Función para mostrar mensajes
function showMessage(text, type) {
    messageText.textContent = text;
    loginMessage.className = `alert alert-${type} alert-dismissible fade show`;
    loginMessage.classList.remove('d-none');
}

// Validación de formulario de Login
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    // Reiniciar mensajes de error
    usernameInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
    usernameError.style.display = 'none';
    passwordError.style.display = 'none';
    loginMessage.classList.add('d-none');
    
    // Mostrar spinner y cambiar texto del botón
    loginSpinner.classList.remove('d-none');
    loginText.textContent = 'Verificando...';
    loginButton.disabled = true;

    // Validación básica
    if (!username) {
        usernameInput.classList.add('is-invalid');
        usernameError.style.display = 'block';
        isValid = false;
    }

    if (!password) {
        passwordInput.classList.add('is-invalid');
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (!isValid) {
        loginSpinner.classList.add('d-none');
        loginText.textContent = 'Ingresar';
        loginButton.disabled = false;
        return;
    }

    try {
        // Buscar usuario en la lista
        const user = users.find(u => 
            (u.username.toLowerCase() === username.toLowerCase() || 
             u.email.toLowerCase() === username.toLowerCase()) && 
            u.password === password
        );

        if (user) {
            // Guardar credenciales si el checkbox está marcado
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
            }
            
            // Guardar información del usuario en sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            // Redirigir al dashboard después de 1.5 segundos
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 1500);
        } else {
            showMessage('Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.', 'danger');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        showMessage('Error al iniciar sesión. Por favor, inténtalo de nuevo.', 'danger');
    } finally {
        // Restaurar el botón
        loginSpinner.classList.add('d-none');
        loginText.textContent = 'Ingresar';
        loginButton.disabled = false;
    }
});