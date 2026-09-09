document.addEventListener('DOMContentLoaded', () => {

    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    }

    const contenedorCarrito = document.querySelector('.lista-carrito');
    if (contenedorCarrito) {
        renderizarCarrito();
    }

    const btnPagar = document.querySelector('.btn-pagar');
    const modalPago = document.getElementById('modal-pago');
    const btnCancelar = document.getElementById('btn-cancelar-pago');
    const formPasarela = document.getElementById('form-pasarela');

    if (btnPagar && modalPago) {
        btnPagar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
            if (carrito.length === 0) {
                alert("Tu carrito está vacío. Añade productos antes de procesar el pago.");
                return;
            }
            modalPago.showModal();
        });

        btnCancelar.addEventListener('click', () => modalPago.close());

        // Este evento SOLO se dispara si las validaciones HTML5 (pattern, required) son exitosas
        formPasarela.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nombre = document.getElementById('envio-nombre').value;
            const apellido = document.getElementById('envio-apellido').value;
            const direccion = document.getElementById('envio-direccion').value;
            const btnSubmit = document.getElementById('btn-confirmar-pago');

            btnSubmit.textContent = "Procesando pago...";
            btnSubmit.disabled = true;

            setTimeout(() => {
                alert(`¡Pago aprobado! Muchas gracias ${nombre} ${apellido}. Tu pedido será despachado a: ${direccion}.`);
                
                localStorage.removeItem('carritoProductos');
                modalPago.close();
                btnSubmit.textContent = "Pagar y Confirmar";
                btnSubmit.disabled = false;
                formPasarela.reset();
                renderizarCarrito();
            }, 1500);
        });
    }
});


function agregarAlCarrito(evento) {
    const boton = evento.target;
    const productoAñadido = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: parseInt(boton.dataset.precio),
        img: boton.dataset.img,
        stock: parseInt(boton.dataset.stock), 
        cantidad: 1
    };

    let carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
    const indiceProducto = carrito.findIndex(producto => producto.id === productoAñadido.id);

    if (indiceProducto !== -1) {
        if (carrito[indiceProducto].cantidad < carrito[indiceProducto].stock) {
            carrito[indiceProducto].cantidad++;
            boton.textContent = "¡Sumado! ✔";
            boton.style.backgroundColor = "#28a745";
            setTimeout(() => {
                boton.textContent = "Añadir al pedido";
                boton.style.backgroundColor = "";
            }, 1000);
        } else {
            alert(`¡Lo sentimos! Solo nos quedan ${carrito[indiceProducto].stock} unidades de ${productoAñadido.nombre}.`);
        }
    } else {
        if (productoAñadido.stock > 0) {
            carrito.push(productoAñadido);
            boton.textContent = "¡Añadido! ✔";
            boton.style.backgroundColor = "#28a745";
            setTimeout(() => {
                boton.textContent = "Añadir al pedido";
                boton.style.backgroundColor = "";
            }, 1000);
        } else {
            alert(`Producto agotado temporalmente.`);
            return;
        }
    }

    localStorage.setItem('carritoProductos', JSON.stringify(carrito));
}

function renderizarCarrito() {
    const contenedorCarrito = document.querySelector('.lista-carrito');
    let carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
    
    contenedorCarrito.innerHTML = ''; 

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p style="text-align: center; padding: 2rem;">Tu carrito está vacío. ¡Ve a la sección de productos para añadir algunos!</p>';
        actualizarResumen(0);
        return;
    }

    let subtotal = 0;

    carrito.forEach((producto, index) => {
        const subtotalProducto = producto.precio * producto.cantidad;
        subtotal += subtotalProducto;

        const articulo = document.createElement('article');
        articulo.classList.add('item-carrito');
        
        articulo.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <div class="detalles-item">
                <h3>${producto.nombre}</h3>
                <p class="precio-unitario">$${formatearDinero(producto.precio)} <br><small style="color: #c25a10;">Stock: ${producto.stock}</small></p>
            </div>
            <div class="controles-cantidad">
                <label for="cant-${index}" class="sr-only">Cantidad</label>
                <input type="number" id="cant-${index}" value="${producto.cantidad}" min="1" max="${producto.stock}" data-id="${producto.id}" class="input-cantidad">
            </div>
            <div class="subtotal-item">
                <p><strong>$${formatearDinero(subtotalProducto)}</strong></p>
            </div>
            <button class="btn-eliminar" data-id="${producto.id}" aria-label="Eliminar ${producto.nombre} del carrito">✖</button>
        `;
        
        contenedorCarrito.appendChild(articulo);
    });

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', eliminarProducto);
    });

    document.querySelectorAll('.input-cantidad').forEach(input => {
        input.addEventListener('change', actualizarCantidad);
    });

    actualizarResumen(subtotal);
}

function actualizarResumen(subtotal) {
    const costoDespacho = subtotal > 0 ? 2500 : 0; 
    const total = subtotal + costoDespacho;

    const filasResumen = document.querySelectorAll('.fila-resumen span:nth-child(2)');
    if (filasResumen.length >= 3) {
        filasResumen[0].textContent = '$' + formatearDinero(subtotal);
        filasResumen[1].textContent = '$' + formatearDinero(costoDespacho);
        filasResumen[2].textContent = '$' + formatearDinero(total);
    }
}

function eliminarProducto(evento) {
    const id = evento.target.dataset.id;
    let carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
    
    carrito = carrito.filter(producto => producto.id !== id);
    localStorage.setItem('carritoProductos', JSON.stringify(carrito));
    
    renderizarCarrito(); 
}

function actualizarCantidad(evento) {
    const id = evento.target.dataset.id;
    let nuevaCantidad = parseInt(evento.target.value);
    
    let carrito = JSON.parse(localStorage.getItem('carritoProductos')) || [];
    const index = carrito.findIndex(p => p.id === id);
    
    if (index !== -1) {
        if (nuevaCantidad < 1) nuevaCantidad = 1;
        if (nuevaCantidad > carrito[index].stock) {
            nuevaCantidad = carrito[index].stock;
            alert(`Solo puedes comprar un máximo de ${carrito[index].stock} unidades.`);
        }

        carrito[index].cantidad = nuevaCantidad;
        localStorage.setItem('carritoProductos', JSON.stringify(carrito));
        renderizarCarrito(); 
    }
}

function formatearDinero(valor) {
    return valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}