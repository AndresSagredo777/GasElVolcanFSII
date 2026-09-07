const botonMenu = document.getElementById('boton-menu');
const menuPrincipal = document.getElementById('menu-principal');

botonMenu.addEventListener('click', () => {
    const abierto = menuPrincipal.classList.toggle('menu-abierto')
    botonMenu.setAttribute('aria-expanded', abierto);
    botonMenu.classList.toggle('activo', abierto);
})