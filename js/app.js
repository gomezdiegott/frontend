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
                        <div class="card" id="${tarjeta.nombre}">
                            <img src="${imagen}" alt="${tarjeta.nombre}">
                            <div class="info-content">
                                <h3>${tarjeta.nombre}</h3>
                                <p>Precio: $${tarjeta.precio}</p>
                                <button class="pedido" data-title="${tarjeta.nombre}" data-description="Precio: $${tarjeta.precio}" id="add-to-cart">Agregar <i class='bx bx-cart'></i></button>
                            </div>
                        </div>
                    `;

                    contenido.innerHTML += `
                        <div class="card card-segundo" id="${tarjeta.nombre}">
                            <img class="segundo" src="${imagen}" alt="${tarjeta.nombre}">
                            <div class="info-content">
                                <h3>${tarjeta.nombre}</h3>
                                <p>Precio: $${tarjeta.precio}</p>
                                <button class="pedido" data-title="${tarjeta.nombre}" data-description="Precio: $${tarjeta.precio}" id="add-to-cart">Agregar <i class='bx bx-cart'></i></button>
                            </div>
                        </div>
                    `;
                });

                // Volver a asignar eventos a los botones
                document.querySelectorAll('#add-to-cart').forEach(e => {
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


    const addCarrito = document.querySelectorAll('#add-to-cart');
    const carrito = document.querySelector('#openCart');
    
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    let cont = cart.length;

    // Inicia el contador al cargar la página
    carrito.innerHTML = `Carrito <i class='bx bx-cart'></i> <sup>${cont}</sup>`;

    function aniadirCarrito() {
        const product = this.closest('.card');
        const productName = product.querySelector('h3').textContent;
        const productImage = product.querySelector('img').src;
        const productPrice = product.querySelector('p').textContent;
        const productInfo = {
            name: productName,
            image: productImage,
            price: parseInt(productPrice.replace('Precio: $', '').trim()), // Extrae solo el precio numérico
        };
        cart.push(productInfo);
        cont = cart.length;
        localStorage.setItem('cartItems', JSON.stringify(cart));
        localStorage.setItem('cartCount', JSON.stringify(cont));
        carrito.innerHTML = `Carrito <i class='bx bx-cart'></i> <sup>${cont}</sup>`;
        updateCart();
    }

    addCarrito.forEach(e => {
        e.addEventListener('click', aniadirCarrito);
    });

    function updateCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemImage = document.createElement('img');
            itemImage.src = item.image;

            const itemInfo = document.createElement('div');
            itemInfo.className = 'cart-item-info';
            itemInfo.innerHTML = `<h5>${item.name}</h5><p>Precio: $${item.price}</p>`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.addEventListener('click', function () {
                cart.splice(index, 1);
                cont = cart.length;
                localStorage.setItem('cartItems', JSON.stringify(cart));
                localStorage.setItem('cartCount', JSON.stringify(cont));
                carrito.innerHTML = `Carrito <i class='bx bx-cart'></i> <sup>${cont}</sup>`;
                updateCart();
            });

            cartItem.appendChild(itemImage);
            cartItem.appendChild(itemInfo);
            cartItem.appendChild(removeButton);
            cartItemsContainer.appendChild(cartItem);

            total += item.price;
        });

        const cartTotal = document.getElementById('cartTotal');
        cartTotal.textContent = `Total: $${total}`;
    }

    document.getElementById('openCart').addEventListener('click', function () {
        document.getElementById('cartOverlay').style.display = 'block';
        updateCart();
    });

    document.getElementById('closeCart').addEventListener('click', function () {
        document.getElementById('cartOverlay').style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == document.getElementById('cartOverlay')) {
            document.getElementById('cartOverlay').style.display = 'none';
        }
    });

    // ----------------------------------
    // Inicia sesión

    const saludo = document.getElementById('saludoUsuario');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario && usuario.nombre) {
        saludo.textContent = `Hola, ${usuario.nombre} 👋`;
    } else {
        saludo.textContent = `Hola, visitante 👤`;
    }


});


