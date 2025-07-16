document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('content-cards');
    const contenido = document.getElementById('cards-content');

    // URL base de la API
    const API_URL = "http://localhost:8080/api/articulos";

    const renderPage = () => {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = '';
                contenido.innerHTML = '';

                data.forEach(tarjeta => {
                    const imagen = tarjeta.imagenUrl 
                        ? `http://localhost:8080/api/articulos/imagenes/${tarjeta.imagenUrl}` 
                        : './img/img.png'; // imagen por defecto

                    container.innerHTML += `
                        <div class="card" data-id="${tarjeta.id}">
                            <img src="${imagen}" alt="${tarjeta.nombre}">
                            <div class="info-content">
                                <h3>${tarjeta.nombre}</h3>
                                <p>Precio: $${tarjeta.precio}</p>
                                <button class="pedido add-to-cart" data-title="${tarjeta.nombre}" data-description="Precio: $${tarjeta.precio}" >Agregar <i class='bx bx-cart'></i></button>
                            </div>
                        </div>
                    `;

                    contenido.innerHTML += `
                        <div class="card card-segundo" data-id="${tarjeta.id}">
                            <img class="segundo" src="${imagen}" alt="${tarjeta.nombre}">
                            <div class="info-content">
                                <h3>${tarjeta.nombre}</h3>
                                <p>Precio: $${tarjeta.precio}</p>
                                <button class="pedido add-to-cart" data-title="${tarjeta.nombre}" data-description="Precio: $${tarjeta.precio}" >Agregar <i class='bx bx-cart'></i></button>
                            </div>
                        </div>
                    `;
                });

                // Volver a asignar eventos a los botones
                document.querySelectorAll('.add-to-cart').forEach(e => {
                    e.addEventListener('click', aniadirCarrito);
                });
            })
            .catch(error => {
                console.error('Error al obtener los productos:', error);
            });


        // document.querySelectorAll('.pedido').forEach(card => {
        //     card.addEventListener('click', () => {
        //         const productTitle = card.getAttribute('data-title');
        //         const productDescription = card.getAttribute('data-description');
        //         const whatsappMessage = `Hola chicas, estoy interesado en el producto: ${productTitle}. ${productDescription}`;
        //         const encodedMessage = encodeURIComponent(whatsappMessage);
        //         const whatsappURL = `https://api.whatsapp.com/send?phone=5491159260544&text=${encodedMessage}`;
        //         window.open(whatsappURL, '_blank');
        //     });
        // });
    };

    renderPage();


    
   
    // Entra al crud
    const crud = document.getElementById('crud');
    
    crud.addEventListener('click', () => {
        window.location.href = './html/crud.html';
    });
    

    // ----------------------------------
    // Inicia el buscador

    document.getElementById('buscador').addEventListener('input', () => {
        buscar();
    });

    const boton = document.getElementById('boton');

    function buscar() {
        const input = document.getElementById('buscador');
        const filter = input.value.trim();
        const dropdown = document.getElementById('dropdown');
        dropdown.innerHTML = '';

        if (filter === '') {
            dropdown.style.display = 'none';
            return;
        }

        fetch(`http://localhost:8080/api/articulos/buscar?nombre=${encodeURIComponent(filter)}`)
            .then(res => res.json())
            .then(results => {
                dropdown.innerHTML = ''; // Limpiar anteriores

                if (results.length > 0) {
                    results.forEach(item => {
                        const a = document.createElement('a');
                        a.href = `#${item.nombre}`;
                        a.classList.add('search-card');
                        a.innerHTML = `
                            <img src="${`http://localhost:8080/api/articulos/imagenes/${item.imagenUrl}` || 'default.jpg'}" alt="${item.nombre}">
                            <div class="search-content">
                                <h3>${item.nombre}</h3>
                                <p>${item.descripcion || ''}</p>
                            </div>
                        `;
                        dropdown.appendChild(a);
                    });
                } else {
                    dropdown.innerHTML = '<p>No se encontraron coincidencias.</p>';
                }

                dropdown.style.display = 'block';
            })
            .catch(error => {
                dropdown.innerHTML = `<p>Error al buscar: ${error.message}</p>`;
                dropdown.style.display = 'block';
            });
    }

    // Mostrar el dropdown al hacer clic en el campo
    boton.addEventListener('click', function() {
        document.getElementById('dropdown').style.display = 'block';
    });

    // Cerrar el dropdown cuando se hace clic fuera
    window.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdown');
        if (
            event.target !== dropdown &&
            event.target !== boton &&
            event.target !== document.getElementById('buscador') &&
            !dropdown.contains(event.target)
        ) {
            dropdown.style.display = 'none';
        }
    });


    // ----------------------------------
    // Inicia el carrito


    async function aniadirCarrito() {
        const card = this.closest('.card');
        const articuloId = card.dataset.id;
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario) {
            alert("Tenés que iniciar sesión para usar el carrito.");
            return;
        }

        const email = usuario.email;

        try {
            const res = await fetch(`http://localhost:8080/api/carrito/agregar?email=${email}&articuloId=${articuloId}&cantidad=1`, {
                method: 'POST'
            });

            if (res.ok) {
                alert("Producto agregado al carrito");
                actualizarContador(email);
            } else {
                alert("Error al agregar al carrito");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        }
    };


    async function updateCart() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) return;

        try {
            const res = await fetch(`http://localhost:8080/api/carrito?email=${usuario.email}`);
            if (!res.ok) throw new Error('Error al obtener carrito');
            
            const carritoData = await res.json();
            const cartItemsContainer = document.getElementById('cartItems');
            cartItemsContainer.innerHTML = '';

            let total = 0;

            carritoData.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';

                const itemImage = document.createElement('img');
                itemImage.src = item.articulo.imagenUrl 
                    ? `http://localhost:8080/api/articulos/imagenes/${item.articulo.imagenUrl}`
                    : './img/img.png';

                const itemInfo = document.createElement('div');
                itemInfo.className = 'cart-item-info';
                itemInfo.innerHTML = `
                    <h5>${item.articulo.nombre}</h5>
                    <p>Precio: $${item.articulo.precio} x ${item.cantidad}</p>
                `;

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Eliminar';
                removeButton.addEventListener('click', () => eliminarDelCarrito(item.articulo.id));

                cartItem.appendChild(itemImage);
                cartItem.appendChild(itemInfo);
                cartItem.appendChild(removeButton);
                cartItemsContainer.appendChild(cartItem);

                total += item.articulo.precio * item.cantidad;
            });

            document.getElementById('cartTotal').textContent = `Total: $${total}`;
        } catch (err) {
            console.error('Error en updateCart:', err);
            document.getElementById('cartItems').innerHTML = '<p>Error al cargar el carrito</p>';
        }
    }


    async function eliminarDelCarrito(articuloId) {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) return;
        
        const email = usuario.email;
        try {
            const res = await fetch(`http://localhost:8080/api/carrito/eliminar?email=${email}&articuloId=${articuloId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                updateCart();
                actualizarContador();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function actualizarContador() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) return;

        const email = usuario.email;

        try {
            const res = await fetch(`http://localhost:8080/api/carrito?email=${email}`);
            const carrito = await res.json();
            const cantidad = carrito.items.reduce((acc, item) => acc + item.cantidad, 0);
            document.getElementById('openCart').innerHTML = `Carrito <i class='bx bx-cart'></i> <sup>${cantidad}</sup>`;
        } catch (err) {
            console.error(err);
        }
    }


    // Al hacer click en el icono carrito
    document.getElementById('openCart').addEventListener('click', () => {
        document.getElementById('cartOverlay').style.display = 'block';
        updateCart();
    });

    document.getElementById('closeCart').addEventListener('click', () => {
        document.getElementById('cartOverlay').style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('cartOverlay')) {
            document.getElementById('cartOverlay').style.display = 'none';
        }
    });

    // Al cargar la página
    actualizarContador();

    // ----------------------------------
    // Inicia sesión

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        actualizarContador(); // ahora funciona porque define el email internamente
    }



    const saludo = document.getElementById('saludoUsuario');

    if (usuario && usuario.nombre) {
        saludo.textContent = `Hola, ${usuario.nombre} 👋`;
    } else {
        saludo.textContent = `Hola, visitante 👤`;
    }


});


