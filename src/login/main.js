import { supabase } from '../api.clients.js';

document.querySelector('form').addEventListener('submit', async (e) => { 
    e.preventDefault();
    const email = e.target.email.value; 
    const password = e.target.password.value; 

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error);
        alert('Błąd logowania. Sprawdź konsolę.');
        return;
    }

    window.location.href = '../';
});