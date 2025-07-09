// URL base de la API
const API_URL = "http://localhost:8080/api/articulos";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarArticulos);

document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);

document.getElementById("cancelar").addEventListener("click", () => {
    document.getElementById("form-articulo").reset();
    document.getElementById("idArticulo").value = "";
});

// Lista todos los artículos
function listarArticulos() {
    fetch(API_URL)
        .then(response => response.json()) // Convierte la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-articulos");
            tbody.innerHTML = "";
            data.forEach(articulo => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${articulo.id}</td>
                    <td>${articulo.nombre}</td>
                    <td>${articulo.precio.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarArticulo(${articulo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila); // Agrega la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// Guarda o actualiza un artículo 
function guardarArticulo(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const id = document.getElementById("idArticulo").value;
    const nombre = document.getElementById("nombre").value.trim();
    const precio = parseFloat(document.getElementById("precio").value);

    // Validación de campos
    if (!nombre || isNaN(precio) || precio < 0) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    // Crea un objeto artículo con los datos del formulario
    const articulo = { nombre, precio };
    // Determina si es una edición (PUT) o creación (POST)
    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? "PUT" : "POST";

    // Envia el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" }, // Indica que el cuerpo es JSON
        body: JSON.stringify(articulo) // Convierte el objeto a JSON
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar"); // Verifica respuesta exitosa
        return response.json();
    })
    .then(() => {
        // Limpia el formulario y recarga la tabla
        document.getElementById("form-articulo").reset();
        document.getElementById("idArticulo").value = "";
        listarArticulos();
    })
    .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}

// Carga artículo en el formulario para edición
function editarArticulo(id) {
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(articulo => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idArticulo").value = articulo.id;
            document.getElementById("nombre").value = articulo.nombre;
            document.getElementById("precio").value = articulo.precio;
        })
        .catch(error => console.error("Error al obtener artículo:", error)); // Manejo de errores
}

// Elimina un artículo 
function eliminarArticulo(id) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este artículo?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
            listarArticulos(); // Actualizamos la lista de artículos
        })
        .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}

