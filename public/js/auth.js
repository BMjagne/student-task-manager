// --- CONFIGURATION ---
const API_URL = 'http://localhost:5000'; 

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
            // Send POST request to /register
            const response = await fetch(`${API_URL}/register`, {
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
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS! 
                // 1. Saves the token (if the backend sends one) to LocalStorage
                // This acts like a digital ID card for the next page.
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                // 2. Redirect to the main app page
                window.location.href = 'tasks.html';
            } else {
                alert(data.message || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to login. Please check server.');
        }
    });
});