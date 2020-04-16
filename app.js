const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('views', './public/views');
app.set('view engine', 'ejs');
app.use(express.static('public/client'));
app.use(express.urlencoded({
    extended: true
}));

const rooms = {};

app.get('/', (req, res) => {
    res.render('index', {
        rooms: rooms
    });
});

app.get('/:room', (req, res) => {
    res.render('room', {
        roomName: req.params.room
    });
});

const users = {};

io.on('connection', socket => {
    socket.on('user', account => {
        users[socket.id] = account;
        socket.broadcast.emit('user-connected', account);
    });
    socket.on('send-message', message => {
        socket.broadcast.emit('message', {
            message: message,
            account: users[socket.id]
        });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnect', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(3000);