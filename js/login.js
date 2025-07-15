document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-login');

    const mostrarError = (input, mensaje) => {
        const divPadre = input.parentNode;
        const errorText = divPadre.querySelector('.error-text');
        divPadre.classList.add('error');
        errorText.innerText = mensaje;
    };

    const eliminarError = input => {
        const divPadre = input.parentNode;
        const errorText = divPadre.querySelector('.error-text');
        divPadre.classList.remove('error');
        errorText.innerText = '';
    };

    function isEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validarCampo(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        const valor = campo.value.trim();
        if (valor === '') {
            mostrarError(campo, mensaje);
            return false;
        } else {
            eliminarError(campo);
            return true;
        }
    }

    function validarEmail(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        const email = campo.value.trim();
        if (email === '') {
            mostrarError(campo, 'El correo electrónico es obligatorio');
            return false;
        } else if (!isEmail(email)) {
            mostrarError(campo, mensaje);
            return false;
        } else {
            eliminarError(campo);
            return true;
        }
    }

    function validarFormulario() {
        let valido = true;
        valido = validarEmail('email', 'El correo electrónico no es válido') && valido;
        valido = validarCampo('password', 'La contraseña es obligatoria') && valido;
        return valido;
    }

    // Validación en tiempo real
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            if (input.value.trim() !== '') {
                eliminarError(input);
            }
        });
    });

    // Evento submit del login
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validarFormulario()) {
            console.log("Formulario de login inválido");
            return;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const res = await fetch('http://localhost:8080/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const usuario = await res.json(); // ✅ parseo correcto
                document.getElementById('mensajeExito').style.display = 'block';
                localStorage.setItem('usuario', JSON.stringify(usuario));
                setTimeout(() => window.location.href = '../index.html', 1500);
            } else {
                const mensaje = await res.text(); // ❗️ solo cuando NO es 200
                if (res.status === 404) {
                    mostrarError(document.getElementById('email'), mensaje);
                } else if (res.status === 401) {
                    mostrarError(document.getElementById('password'), mensaje);
                } else {
                    document.getElementById('mensajeError').innerText = mensaje;
                    document.getElementById('mensajeError').style.display = 'block';
                }
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            document.getElementById('mensajeError').innerText = 'Error de conexión.';
            document.getElementById('mensajeError').style.display = 'block';
        }
    });

    // Cerrar alertas
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.style.display = 'none';
        });
    });
});
