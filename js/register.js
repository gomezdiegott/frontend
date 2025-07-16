document.addEventListener('DOMContentLoaded', () => {

    function configurarFechaMaxima() {
        const fechaInput = document.getElementById('date');
        const hoy = new Date();
        const fechaMaxima = new Date();
        fechaMaxima.setFullYear(hoy.getFullYear() - 18);
        
        // Formatear como YYYY-MM-DD
        const fechaMaximaFormateada = fechaMaxima.toISOString().split('T')[0];
        fechaInput.setAttribute('max', fechaMaximaFormateada);
        
        // Opcional: Establecer mínimo (ej. 120 años atrás)
        const fechaMinima = new Date();
        fechaMinima.setFullYear(hoy.getFullYear() - 120);
        fechaInput.setAttribute('min', fechaMinima.toISOString().split('T')[0]);
    }
    configurarFechaMaxima();

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

    function validarFechaNacimiento(campoId) {
        const campo = document.getElementById(campoId);
        const fechaNacimiento = new Date(campo.value);
        const hoy = new Date();
        const fechaMinima18 = new Date();
        fechaMinima18.setFullYear(hoy.getFullYear() - 18);
        
        if (!campo.value) {
            mostrarError(campo, 'La fecha de nacimiento es obligatoria');
            return false;
        } else if (fechaNacimiento > fechaMinima18) {
            mostrarError(campo, 'Debes tener al menos 18 años');
            return false;
        } else {
            eliminarError(campo);
            return true;
        }
    }

    function validarEdad(fechaNacimiento) {
        const hoy = new Date();
        const fechaMinima18 = new Date();
        fechaMinima18.setFullYear(hoy.getFullYear() - 18);
        return new Date(fechaNacimiento) <= fechaMinima18;
    }

    function validarPais(campoId, mensaje) {
        const campo = document.getElementById(campoId);
        if (campo.value === "") {
            mostrarError(campo, mensaje);
            return false;
        }
        eliminarError(campo);
        return true;
    }

    function validarFormulario() {
        let valido = true;
        valido = validarCampo('name', 'El nombre es obligatorio') && valido;
        valido = validarCampo('surname', 'El apellido es obligatorio') && valido;
        valido = validarCampo('password', 'La contraseña es obligatoria') && valido;
        valido = validarEmail('email', 'El correo electrónico no es válido') && valido;
        valido = validarFechaNacimiento('date', 'La fecha de nacimiento es obligatoria') && valido;
        valido = validarEdad(document.getElementById('date').value) && valido;
        valido = validarPais('country', 'Debe seleccionar un país') && valido;
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
            return;
        }

        const formData = {
            nombre: document.getElementById('name').value.trim(),
            apellido: document.getElementById('surname').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value.trim(),
            fechaNacimiento: document.getElementById('date').value,
            pais: document.getElementById('country').value
        };

        try {
            const res = await fetch('http://localhost:8080/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const responseData = await res.json();

            if (!res.ok) {
                // Manejo de errores del backend
                if (typeof responseData === 'object') {
                    // Errores de validación (objeto con múltiples errores)
                    Object.entries(responseData).forEach(([field, message]) => {
                        const inputId = field === 'nombre' ? 'name' : 
                                    field === 'apellido' ? 'surname' : 
                                    field.toLowerCase();
                        const input = document.getElementById(inputId);
                        if (input) {
                            mostrarError(input, message);
                        } else {
                            document.getElementById('mensajeError').innerText = message;
                            document.getElementById('mensajeError').style.display = 'block';
                        }
                    });
                } else {
                    // Error simple (string)
                    document.getElementById('mensajeError').innerText = responseData;
                    document.getElementById('mensajeError').style.display = 'block';
                }
                return;
            }

            // Éxito
            document.getElementById('mensajeExito').style.display = 'block';
            form.reset();
            setTimeout(() => window.location.href = '../html/login.html', 1500);

        } catch (error) {
            console.error(error);
            document.getElementById('mensajeError').innerText = 'Error de conexión';
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
