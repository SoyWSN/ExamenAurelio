// server/index.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Permitir que tu frontend de React (que corre en otro puerto) pueda hacerle consultas a esta API
app.use(cors());
// Permitir que el servidor entienda datos en formato JSON
app.use(express.json());

// Configuración de la conexión a la Base de Datos usando las variables del .env
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// MIDDLEWARE: Una función de seguridad que revisa si el usuario es administrador real
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Acceso denegado. Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token inválido o expirado.' });
        req.userId = decoded.id;
        next(); // Si todo está bien, permite continuar a la ruta
    });
};

// ==================== RUTA DE LOGIN (ADMINISTRADOR) ====================
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const usuario = rows[0];
        // Compara la contraseña que escribió el usuario con el hash encriptado de la BD
        const passwordCorrecta = await bcrypt.compare(password, usuario.password);
        if (!passwordCorrecta) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        // Si es correcto, genera un token JWT firmado que dura 2 horas
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// ==================== RUTAS PÚBLICAS (PRODUCTOS) ====================
// Obtener todos los productos (Para la vitrina del cliente y el panel admin)
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM productos');
        res.json(rows); // Devuelve el arreglo de productos en formato JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos.' });
    }
});

// ==================== RUTAS PROTEGIDAS (PANEL ADMIN) ====================
// Agregar un nuevo producto (Solo si el admin está logueado)
app.post('/api/products', verificarToken, async (req, res) => {
    const { name, description, price, image, category, subcategory, type } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO productos (name, description, price, image, category, subcategory, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, "active")',
            [name, description, price, image || '/img/products/default.jpg', category, subcategory || null, type || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el producto.' });
    }
});

// Editar un producto o cambiar su estado (Descontinuado/Activo)
app.put('/api/products/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image, category, subcategory, type, status } = req.body;
    try {
        await db.query(
            'UPDATE productos SET name=?, description=?, price=?, image=?, category=?, subcategory=?, type=?, status=? WHERE id=?',
            [name, description, price, image, category, subcategory || null, type || null, status, id]
        );
        res.json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});

// Arrancar el servidor en el puerto definido en el .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));