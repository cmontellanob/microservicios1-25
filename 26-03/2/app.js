// Importar módulos
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurar EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar conexión a MySQL con variables de entorno
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'usuarios_db'
});

// Ruta principal: Listar usuarios
app.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) throw err;
        res.render('index', { usuarios: results });
    });
});

// Ruta para agregar usuario
app.post('/add', (req, res) => {
    const { nombre, email } = req.body;
    db.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Ruta para eliminar usuario
app.post('/delete/:id', (req, res) => {
    db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
