const socket = io('/');

const getBodyUsers = document.getElementById('body-users');
const getBodyMessage = document.getElementById('body-message');
const formSendMessage = document.getElementById('form-send');
const getMessage = document.getElementById('message');

const user = prompt('who are you ?');
socket.emit('user', user);

socket.on('message', data => {
    appendMessage(`${data.account} > ${data.message}`);
});

socket.on('user-connected', data => {
    appendUsers(`${data} connected`);
});

socket.on('user-disconnect', data => {
    appendUsers(`${data} disconnected`);
});

function appendUsers(user) {
    const usrElement = document.createElement('span');
    usrElement.textContent = user;
    getBodyUsers.append(usrElement);
}

function appendMessage(message) {
    const msgElement = document.createElement('p');
    msgElement.textContent = message;
    getBodyMessage.append(msgElement);
}

formSendMessage.addEventListener('submit', e => {
    e.preventDefault();
    const message = getMessage.value;
    appendMessage(`> ${message}`);
    socket.emit('send-message', message);
    getMessage.value = '';
});
