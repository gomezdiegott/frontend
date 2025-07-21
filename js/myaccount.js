document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
        alert("Debes iniciar sesión");
        window.location.href = '../index.html';
        return;
    }

    document.getElementById('nombre').value = usuario.nombre || '';
    document.getElementById('apellido').value = usuario.apellido || '';
    document.getElementById('pais').value = usuario.pais || '';
    document.getElementById('fecha_nacimiento').value = usuario.fecha_nacimiento || '';

    document.getElementById('formCuenta').addEventListener('submit', async e => {
        e.preventDefault();

        const datosActualizados = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            pais: document.getElementById('pais').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value
        };

        const res = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...usuario, ...datosActualizados })
        });

        if (res.ok) {
            const actualizado = await res.json();
            localStorage.setItem("usuario", JSON.stringify(actualizado));
            alert("Datos actualizados correctamente");
        } else {
            alert("Error al actualizar los datos");
        }
    });
});
