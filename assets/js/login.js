document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos el formulario usando el ID que le dimos en el HTML
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            // Prevenimos la recarga automática de la página
            e.preventDefault();

            // Capturamos los valores que ingresa el usuario
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // SIMULACIÓN DE BASE DE DATOS: 
            // Aquí definimos unas credenciales "correctas" para poder probar el login
            const usuarioRegistrado = "ejemplo@correo.com";
            const passwordRegistrada = "123456";

            // Validamos si lo ingresado coincide con nuestra base de datos simulada
            if (email === usuarioRegistrado && password === passwordRegistrada) {
                
                // Guardamos una "sesión activa" en el navegador
                localStorage.setItem('sesionActiva', 'true');
                localStorage.setItem('correoUsuario', email);

                alert("¡Sesión iniciada con éxito! Bienvenido a Gas El Volcan.");
                
                // Redirigimos al usuario a la página principal
                window.location.href = "index.html";

            } else {
                // Se muestra el error
                alert("Correo o contraseña incorrectos. Por favor, intenta de nuevo.");
            }
        });
    }
});