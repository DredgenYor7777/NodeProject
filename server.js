const http = require('http');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
    host: 'sql206.infinityfree.com',
    user: 'if0_38918086',
    password: 'Lzqi422DlUQY1m',
    database: 'if0_38918086_abarrotera'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a MySQL:', err);
        return;
    }
    console.log('✅ Conexión a MySQL exitosa');
});

// Función para servir archivos HTML desde `public`
function servirArchivo(res, archivo) {
    fs.readFile(path.join(__dirname, 'public', archivo), (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: '❌ Ruta no encontrada' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

// Servidor HTTP
const server = http.createServer((req, res) => {
    // ✅ Servir archivos estáticos (CSS, JS, imágenes)
    if (req.method === 'GET' && req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/)) {
        const filePath = path.join(__dirname, 'public', req.url);
        const ext = path.extname(filePath).toLowerCase();

        const contentType = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon',
            '.svg': 'image/svg+xml',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf'
        }[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404);
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        servirArchivo(res, 'login.html');

    } else if (req.method === 'GET' && req.url === '/login.html') {
        servirArchivo(res, 'login.html');

    } else if (req.method === 'GET' && req.url === '/menu.html') {
        servirArchivo(res, 'menu.html');

    } else if (req.method === 'GET' && req.url === '/inventario.html') {
        servirArchivo(res, 'inventario.html');

    } else if (req.method === 'GET' && req.url === '/guia.html') {
        servirArchivo(res, 'guia.html');

    } else if (req.method === 'POST' && req.url === '/registro') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            try {
                const { nombre, correo, contrasena } = JSON.parse(body);
                const hashedPassword = await bcrypt.hash(contrasena, 10);

                const query = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
                connection.query(query, [nombre, correo, hashedPassword], (err) => {
                    res.writeHead(err ? 500 : 201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: err ? '❌ Error al registrar usuario' : '✅ Registro exitoso' }));
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: '❌ Error en la solicitud', error: error.message }));
            }
        });

    } else if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', async () => {
            const { correo, contrasena } = JSON.parse(body);
            const query = 'SELECT contrasena FROM usuarios WHERE correo = ?';

            connection.query(query, [correo], async (err, results) => {
                if (err || results.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: '❌ Usuario no encontrado' }));
                    return;
                }

                const hashedPassword = results[0].contrasena;
                const passwordMatch = await bcrypt.compare(contrasena, hashedPassword);

                res.writeHead(passwordMatch ? 200 : 401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: passwordMatch ? '✅ Login exitoso' : '❌ Contraseña incorrecta' }));
            });
        });

    } else if (req.method === 'POST' && req.url === '/agregarProducto') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', () => {
            try {
                const { clave, nombre, cantidad, precio, fecha } = JSON.parse(body);
                const query = 'INSERT INTO productos (clave, nombre, cantidad, precio, fecha) VALUES (?, ?, ?, ?, ?)';

                connection.query(query, [clave, nombre, cantidad, precio, fecha], (err) => {
                    res.writeHead(err ? 500 : 201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: err ? '❌ Error al registrar producto' : '✅ Producto registrado exitosamente' }));
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: '❌ Error en la solicitud', error: error.message }));
            }
        });

    } else if (req.method === 'PUT' && req.url.startsWith('/actualizarProducto/')) {
        let body = '';
        req.on('data', chunk => body += chunk.toString());

        req.on('end', () => {
            try {
                const id = req.url.split('/')[2];
                const { clave, nombre, cantidad, precio, fecha } = JSON.parse(body);

                const query = 'UPDATE productos SET clave = ?, nombre = ?, cantidad = ?, precio = ?, fecha = ? WHERE id = ?';
                connection.query(query, [clave, nombre, cantidad, precio, fecha, id], (err) => {
                    res.writeHead(err ? 500 : 200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ mensaje: err ? '❌ Error al actualizar producto' : '✅ Producto actualizado correctamente' }));
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: '❌ Error en la solicitud', error: error.message }));
            }
        });

    } else if (req.method === 'DELETE' && req.url.startsWith('/eliminarProducto/')) {
        const id = req.url.split('/')[2];
        const query = 'DELETE FROM productos WHERE id = ?';

        connection.query(query, [id], (err) => {
            res.writeHead(err ? 500 : 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ mensaje: err ? '❌ Error al eliminar producto' : '✅ Producto eliminado correctamente' }));
        });

    } else if (req.method === 'GET' && req.url === '/productos') {
        const query = 'SELECT * FROM productos';
        connection.query(query, (err, results) => {
            res.writeHead(err ? 500 : 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(err ? { mensaje: '❌ Error al obtener productos' } : results));
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mensaje: '❌ Ruta no encontrada' }));
    }
});

// Escuchar en puerto 3000
server.listen(3000, () => {
    console.log('✅ Servidor corriendo en http://localhost:3000');
});
