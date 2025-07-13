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
    const boton = document.getElementById('boton');

    boton.addEventListener('click', () => {
        const input = document.getElementById('buscador');
        const filter = input.value.toUpperCase();
        const dropdown = document.getElementById('dropdown');
        let results = [];

        // Limpiar resultados anteriores
        dropdown.innerHTML = '';
    
        // Buscar en el array "imagenes"
        imagenes.forEach(item => {
            if (item.titulo.toUpperCase().includes(filter)) {
                results.push(item);
            }
        });
    
        // Buscar en el array "segundo"
        segundo.forEach(item => {
            if (item.titulo.toUpperCase().includes(filter)) {
                results.push(item);
            }
        });
    
        // Mostrar resultados
        if (results.length > 0) {
            results.forEach(item => {
                const a = document.createElement('a');
                a.href = '#';
                a.innerHTML = ` 
                    <a href="#${item.titulo}" class="search-card">
                        <img src="${item.imagen}" alt="${item.alt}">
                        <div class="search-content">
                            <h3>${item.titulo}</h3>
                            <p>${item.descripcion}</p>
                        </div>
                    </a>
                `;
                dropdown.appendChild(a);
            });
        } else {
            dropdown.innerHTML = '<p>No se encontraron coincidencias.</p>';
        }
    
        // Mostrar el dropdown si hay resultados o mensaje de no coincidencia
        dropdown.style.display = 'block';

        boton.addEventListener('click', function() {
            // Mostrar el dropdown cuando se hace clic en el campo de búsqueda
            document.getElementById('dropdown').style.display = 'block';
        });
        
        // Cerrar el dropdown cuando se hace clic fuera del campo de búsqueda y del dropdown
        window.addEventListener('click', function(event) {
            const dropdown = document.getElementById('dropdown');
        
            // Verifica si el clic ocurrió fuera del campo de búsqueda y fuera del dropdown
            if (event.target !== dropdown && event.target !== boton && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });

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


});


