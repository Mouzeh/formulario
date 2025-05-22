document.addEventListener('DOMContentLoaded', function() {

    const usuarios = [];
    let aficiones = [];
    
    const formulario = document.getElementById('formularioRegistro');
    const entradaAficion = document.getElementById('entradaAficion');
    const botonAgregarAficion = document.getElementById('botonAgregarAficion');
    const listaAficiones = document.getElementById('listaAficiones');
    const listaUsuarios = document.getElementById('listaUsuarios');
    
    botonAgregarAficion.addEventListener('click', agregarAficion);
    formulario.addEventListener('submit', manejarEnvio);
    
    
    function agregarAficion() {
        const aficion = entradaAficion.value.trim();
        
        if (aficion) {
            if (aficiones.includes(aficion)) {
                mostrarError('errorAficiones', 'Esta afición está duplicada.');
                return;
            }

            aficiones.push(aficion);
            mostrarAficiones();
            entradaAficion.value = '';
        }
    }
    
    function mostrarAficiones() {
        listaAficiones.innerHTML = '';
        
        aficiones.forEach((aficion, indice) => {
            const div = document.createElement('div');
            div.className = 'item-aficion d-flex justify-content-between align-items-center p-2 mb-2 border rounded'; 
            
            const span = document.createElement('span');
            span.textContent = aficion;
            
            const boton = document.createElement('button');
            boton.className = 'btn btn-sm btn-danger';
            boton.textContent = 'Eliminar';
            boton.addEventListener('click', () => eliminarAficion(indice));
            
            div.appendChild(span);
            div.appendChild(boton);
            listaAficiones.appendChild(div);
        });
    }
    
    function eliminarAficion(indice) {
        aficiones.splice(indice, 1);
        mostrarAficiones();
    }
    
    function manejarEnvio(e) {
        e.preventDefault();
        
        reiniciarErroresValidacion();

        const usuarioValido = validarNombreUsuario();
        const contrasenaValida = validarContrasena();
        const confirmacionValida = validarConfirmarContrasena();
        const direccionValida = validarDireccion();
        const comunaValida = validarComuna();
        const telefonoValido = validarTelefono();
        const webValida = validarSitioWeb();
        const aficionesValidas = validarAficiones(); 
        
        if (usuarioValido && contrasenaValida && confirmacionValida && 
            direccionValida && comunaValida && telefonoValido && 
            webValida && aficionesValidas) {
            
            const usuario = {
                nombreUsuario: document.getElementById('nombreUsuario').value,
                contrasena: document.getElementById('contrasena').value,
                direccion: document.getElementById('direccion').value,
                comuna: document.getElementById('comuna').value,
                telefono: document.getElementById('telefono').value,
                sitioWeb: document.getElementById('sitioWeb').value,
                aficiones: [...aficiones]
            };
            
            usuarios.push(usuario);
            mostrarUsuarios();
            reiniciarFormulario();
            alert('¡Usuario registrado con éxito!');
        } else {
            alert('Por favor, revise los campos marcados en rojo.');
        }
    }
    
    function reiniciarFormulario() {
        formulario.reset();
        aficiones = [];
        listaAficiones.innerHTML = '';
        
        reiniciarErroresValidacion();
    }

    function reiniciarErroresValidacion() {
        document.querySelectorAll('.mensaje-error').forEach(elemento => {
            elemento.textContent = '';
        });
        
        document.querySelectorAll('.form-control.invalido, .form-select.invalido').forEach(elemento => {
            elemento.classList.remove('invalido');
        });
    }
    
    function mostrarUsuarios() {
        listaUsuarios.innerHTML = '';
        
        if (usuarios.length === 0) {
            listaUsuarios.innerHTML = '<p>No hay usuarios registrados aún.</p>';
            return;
        }
        
        usuarios.forEach((usuario, indice) => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'col-md-4 mb-4';
            
            tarjeta.innerHTML = `
                <div class="card tarjeta-usuario">
                    <div class="card-body">
                        <h5 class="card-title">${usuario.nombreUsuario}</h5>
                        <p class="card-text">
                            <strong>Dirección:</strong> ${usuario.direccion}, ${usuario.comuna}<br>
                            <strong>Teléfono:</strong> ${usuario.telefono}<br>
                            <strong>Web:</strong> ${usuario.sitioWeb || 'No especificada'}<br>
                            <strong>Aficiones:</strong> ${usuario.aficiones.join(', ')}
                        </p>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${indice})">Eliminar</button>
                    </div>
                </div>
            `;
            
            listaUsuarios.appendChild(tarjeta);
        });
    }

    function mostrarError(idError, mensaje, inputElement = null) {
        const errorElement = document.getElementById(idError);
        errorElement.textContent = mensaje;
        if (inputElement) {
            if (mensaje) {
                inputElement.classList.add('invalido');
            } else {
                inputElement.classList.remove('invalido');
            }
        }
    }
    
    function validarNombreUsuario() {
        const entrada = document.getElementById('nombreUsuario');
        const valor = entrada.value.trim();
        
        mostrarError('errorNombreUsuario', '', entrada); 
        
        if (!valor) {
            mostrarError('errorNombreUsuario', 'El nombre de usuario es obligatorio.', entrada);
            return false;
        }
        
        if (valor.length < 5 || valor.length > 10) {
            mostrarError('errorNombreUsuario', 'El nombre de usuario debe tener entre 5 y 10 caracteres.', entrada);
            return false;
        }
        
        if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(valor)) {
            mostrarError('errorNombreUsuario', 'Debe comenzar con letras y solo puede tener números al final. No se permiten caracteres especiales.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarContrasena() {
        const entrada = document.getElementById('contrasena');
        const valor = entrada.value;
        const usuario = document.getElementById('nombreUsuario').value.trim();
        
        mostrarError('errorContrasena', '', entrada);
        
        if (!valor) {
            mostrarError('errorContrasena', 'La contraseña es obligatoria.', entrada);
            return false;
        }
        
        if (valor.length < 3 || valor.length > 6) {
            mostrarError('errorContrasena', 'La contraseña debe tener entre 3 y 6 caracteres.', entrada);
            return false;
        }
        
        if (!/[a-zA-Z]/.test(valor) || !/[0-9]/.test(valor)) {
            mostrarError('errorContrasena', 'La contraseña debe contener al menos una letra y un número.', entrada);
            return false;
        }
        
        if (usuario && valor.toLowerCase().includes(usuario.toLowerCase())) {
            mostrarError('errorContrasena', 'La contraseña no puede contener el nombre de usuario.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarConfirmarContrasena() {
        const entrada = document.getElementById('confirmarContrasena');
        const valor = entrada.value;
        const contrasena = document.getElementById('contrasena').value;
        
        mostrarError('errorConfirmarContrasena', '', entrada);
        
        if (!valor) {
            mostrarError('errorConfirmarContrasena', 'Por favor confirme su contraseña.', entrada);
            return false;
        }
        
        if (valor !== contrasena) {
            mostrarError('errorConfirmarContrasena', 'Las contraseñas no coinciden.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarDireccion() {
        const entrada = document.getElementById('direccion');
        const valor = entrada.value.trim();
        
        mostrarError('errorDireccion', '', entrada);
        
        if (!valor) {
            mostrarError('errorDireccion', 'La dirección es obligatoria.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarComuna() {
        const entrada = document.getElementById('comuna');
        const valor = entrada.value;
        
        mostrarError('errorComuna', '', entrada);
        
        if (!valor) {
            mostrarError('errorComuna', 'Por favor seleccione una comuna.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarTelefono() {
        const entrada = document.getElementById('telefono');
        const valor = entrada.value.trim();
        
        mostrarError('errorTelefono', '', entrada);
        
        if (!valor) {
            mostrarError('errorTelefono', 'El teléfono es obligatorio.', entrada);
            return false;
        }
        
        if (!/^\+?\d{8,12}$/.test(valor)) {
            mostrarError('errorTelefono', 'Formato de teléfono inválido. Debe contener entre 8 y 12 dígitos.', entrada);
            return false;
        }
        
        return true;
    }
    
    function validarSitioWeb() {
        const entrada = document.getElementById('sitioWeb');
        const valor = entrada.value.trim();
        
        mostrarError('errorSitioWeb', '', entrada);
        
        if (!valor) return true;
        
        try {
            new URL(valor);
            if (!valor.startsWith('http://') && !valor.startsWith('https://')) {
                mostrarError('errorSitioWeb', 'La URL debe empezar con "http://" o "https://".', entrada);
                return false;
            }
            return true;
        } catch {
            mostrarError('errorSitioWeb', 'Por favor ingrese una URL válida (ej: https://ejemplo.com).', entrada);
            return false;
        }
    }
    
    function validarAficiones() {
        mostrarError('errorAficiones', '');
        
        if (aficiones.length < 2) {
            mostrarError('errorAficiones', 'Debe ingresar al menos 2 aficiones.');
            return false;
        }
        
        return true;
    }
    
    window.eliminarUsuario = function(indice) {
        if (confirm('¿Está seguro que desea eliminar este usuario?')) {
            usuarios.splice(indice, 1);
            mostrarUsuarios();
        }
    };
    mostrarUsuarios();
});
