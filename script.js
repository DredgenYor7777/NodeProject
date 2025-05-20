// URL base del servidor
const BASE_URL = 'http://localhost:3000';

// Registro de usuario
async function registrarUsuario(nombre, correo, contrasena) {
    try {
        const res = await fetch(`${BASE_URL}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, contrasena })
        });
        const data = await res.json();
        alert(data.mensaje);

        // Si el registro es exitoso, cerramos el modal
        if (data.mensaje === "Usuario registrado correctamente") {
            $('#registroModal').modal('hide');
        }
    } catch (error) {
        alert("Error en el registro: " + error.message);
    }
}

// Login de usuario
async function loginUsuario(correo, contrasena) {
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });
        const data = await res.json();
        alert(data.mensaje);

        // Si el login es exitoso, redirigimos al dashboard
        if (data.mensaje === "Login exitoso") {
            window.location.href = '/dashboard'; // Asegúrate de tener esta ruta en tu aplicación
        }
    } catch (error) {
        alert("Error en el login: " + error.message);
    }
}

// Agregar producto
async function agregarProducto(clave, nombre, cantidad, precio, fecha) {
    try {
        const res = await fetch(`${BASE_URL}/agregarProducto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clave, nombre, cantidad, precio, fecha })
        });
        const data = await res.json();
        alert(data.mensaje);
    } catch (error) {
        alert("Error al agregar el producto: " + error.message);
    }
}

// Obtener todos los productos
async function obtenerProductos() {
    try {
        const res = await fetch(`${BASE_URL}/productos`);
        const productos = await res.json();
        return productos;
    } catch (error) {
        alert("Error al obtener productos: " + error.message);
    }
}

// Actualizar producto
async function actualizarProducto(id, nombre, cantidad, precio, fecha) {
    try {
        const res = await fetch(`${BASE_URL}/actualizarProducto`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nombre, cantidad, precio, fecha })
        });
        const data = await res.json();
        alert(data.mensaje);
    } catch (error) {
        alert("Error al actualizar el producto: " + error.message);
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    try {
        const res = await fetch(`${BASE_URL}/eliminarProducto/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        alert(data.mensaje);
    } catch (error) {
        alert("Error al eliminar el producto: " + error.message);
    }
}
