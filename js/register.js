document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-registro');

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
            mostrarError(campo, 'el correo electrónico es obligatorio');
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
        valido = validarCampo('name', 'El nombre es obligatorio') && valido;
        valido = validarCampo('surname', 'El apellido es obligatorio') && valido;
        valido = validarCampo('password', 'La contraseña es obligatoria') && valido;
        valido = validarEmail('email', 'El correo electrónico no es válido') && valido;
        return valido;
    }

    // Validación visual instantánea
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            if (input.value.trim() !== '') {
                eliminarError(input);
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validarFormulario()) {
            console.log("Formulario inválido");
            return;
        }

        const nombre = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const res = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, password })
            });

            if (res.ok) {
                const usuario = await res.json(); 
                document.getElementById('mensajeExito').style.display = 'block';
                form.reset();
                setTimeout(() => window.location.href = '../html/login.html', 1500);
            } else {
                const mensaje = await res.text();
                document.getElementById('mensajeError').innerText = mensaje;
                document.getElementById('mensajeError').style.display = 'block';
            }

        } catch (error) {
            console.error(error);
            document.getElementById('mensajeError').innerText = 'Error de conexión.';
            document.getElementById('mensajeError').style.display = 'block';
        }
    });

    // Cierre de alertas
    document.querySelectorAll('.btn-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.style.display = 'none';
        });
    });
});
