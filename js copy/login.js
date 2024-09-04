// login.js
async function login(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        console.log('Logged in user:', user);
        // Redirect or handle successful login
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        await login(email, password);
    });
});
