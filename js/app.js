document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('content-cards');
    const contenido = document.getElementById('cards-content');


    const renderPage = () => {
        container.innerHTML = ''; // Limpiar el contenedor
        
        imagenes.forEach(tarjeta => {
            container.innerHTML += `
                <div class="card" id="${tarjeta.titulo}">
                    <img src="${tarjeta.imagen}" alt="${tarjeta.alt}">
                    <div class="info-content">
                        <h3>${tarjeta.titulo}</h3>
                        <p>${tarjeta.descripcion}</p>
                        <button class="pedido" data-title="${tarjeta.titulo}" data-description="${tarjeta.descripcion}" id="add-to-cart">Agregar <i class='bx bx-cart'></i></a></li></button>
                    </div>
                </div>
            `;
        });

        contenido.innerHTML = ''; // Limpiar el contenedor
        
        segundo.forEach(tarjeta => {
            contenido.innerHTML += `
                <div class="card card-segundo" id="${tarjeta.titulo}">
                    <img class="segundo" src="${tarjeta.imagen}" alt="${tarjeta.alt}">
                    <div class="info-content">
                        <h3>${tarjeta.titulo}</h3>
                        <p>${tarjeta.descripcion}</p>
                        <button class="pedido" data-title="${tarjeta.titulo}" data-description="${tarjeta.descripcion}" id="add-to-cart">Agregar <i class='bx bx-cart'></i></a></li></button>
                    </div>
                </div>
            `;
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


    // ----------------------------------
    // Inicia el buscador
   

    const boton = document.getElementById('boton');

    boton.addEventListener('click', () => {
        const input = document.getElementById('buscador');
        const filter = input.value.toUpperCase();
        const dropdown = document.getElementById('dropdown');
        let results = [];

        // Entra al crud
        boton.addEventListener('click', () => {
            if (input.value.trim().toUpperCase() === 'CRUD') {
                window.location.href = './html/crud.html';
            }
        });

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
        const productName = product.querySelector('data-title');
        const productImage = product.querySelector('img').src;
        const productInfo = {
            name: productName,
            image: productImage,
            price: 777 // Precio aleatorio para demostración
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


