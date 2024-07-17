// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const path = require('path');
// const { Socket } = require('socket.io');

// const app = express();
// const PORT = 3000;

// const server = app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
// const io = require('socket.io')(server)

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Test@123',
//     database: 'loginDB'
// });

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('MySQL Connected...');
// });

// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
    
//     const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             return res.status(500).json({ success: false, message: 'Database query error' });
//         }
        
//         if (results.length > 0) {
//             return res.status(200).json({ success: true });
//         } else {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }
//     });
// });

// io.on('connection', (Socket) => {
//     console.log(Socket.id)
// })

// let socketConnected = new Set()
// io.on('connection', onConnected)

// function onConnected(socket) {
//     console.log(socket.id)
//     socketConnected.add(socket.id)

//     io.emit('clients-total', socketConnected.size)

//     socket.on('disconnect', () => {
//         console.log('socket disconnected', socket.id)
//         socketConnected.delete(socket.id)
//         io.emit('clients-total', socketConnected.size)
//     })

//     socket.on('message', (data) => {
//         console.log(data)
//         socket.broadcast.emit('chat-message', data)
//     })

//     socket.on('feedback', (data) => {
//         socket.broadcast.emit('feedback', data)
//     })
// }

// app.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'chat.html'));
// });

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const { Socket } = require('socket.io');

const app = express();
const PORT = 3000;

const server = app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
const io = require('socket.io')(server);

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Test@123',
    database: 'loginDB'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database query error' });
        }

        if (results.length > 0) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

io.on('connection', (Socket) => {
    console.log(Socket.id);
});

let socketConnected = new Set();
io.on('connection', onConnected);

function onConnected(socket) {
    console.log(socket.id);
    socketConnected.add(socket.id);

    io.emit('clients-total', socketConnected.size);

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});
