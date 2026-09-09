document.addEventListener('DOMContentLoaded', () => {
    
    const botonMenu = document.getElementById('boton-menu');
    const menuPrincipal = document.getElementById('menu-principal');

    if (botonMenu && menuPrincipal) {
        botonMenu.addEventListener('click', () => {
            const abierto = menuPrincipal.classList.toggle('menu-abierto');
            botonMenu.setAttribute('aria-expanded', abierto);
            botonMenu.classList.toggle('activo', abierto);
        });
    }


    const sesionActiva = localStorage.getItem('sesionActiva');
    const enlaceLogin = document.querySelector('nav ul.menu li a[href="login.html"]');

    if (sesionActiva === 'true' && enlaceLogin) {
        enlaceLogin.textContent = 'Cerrar Sesión';
        enlaceLogin.href = '#'; 
        enlaceLogin.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sesionActiva');
            localStorage.removeItem('correoUsuario');
            alert('Has cerrado sesión exitosamente. ¡Vuelve pronto a Gas El Volcan!');
            window.location.href = 'index.html';
        });
    }
});