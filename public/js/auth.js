// --- CONFIGURATION ---
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000' : 'https://student-task-manager-ejnp.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECT ELEMENTS
    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Inputs (Login)
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');

    // Inputs (Register)
    const regName = document.getElementById('reg-name');
    const regEmail = document.getElementById('reg-email');
    const regPassword = document.getElementById('reg-password');

    // Links for toggling
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    // --- 2. UI LOGIC (Toggling Forms) ---
    
    // Initial State: Hide Register, Show Login
    // (We use .style.display to control visibility directly)
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';

    // When clicking "Don't have an account?"
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the link from jumping to top of page
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // When clicking "Already have an account?"
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // --- 3. BACKEND CONNECTION (Register) ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop page reload

        // Create the data object to send
        const userData = {
            name: regName.value,
            email: regEmail.value,
            password: regPassword.value
        };

        try {
            // Send POST request to /api/auth/register
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please log in.');
                // Clear inputs
                regName.value = '';
                regEmail.value = '';
                regPassword.value = '';
                // Switch back to login form automatically
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                // If backend sends an error (e.g., "User already exists")
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong while connecting to the server.');
        }
    });

    // --- 4. BACKEND CONNECTION (Login) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loginData = {
            email: loginEmail.value,
            password: loginPassword.value
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const responseData = await response.json(); 
                
                if (responseData.data && responseData.data.token) {
                    localStorage.setItem('token', responseData.data.token);
                    window.location.replace('tasks.html');
                } else {
                    console.error("Login succeeded but no token was found in responseData.data.token");
                    alert('Login successful but no token received');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to login. Please check server.');
        }
    });
});