const socket = io();

socket.on('message', (message) => {
    console.log(message)
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        if (error) {
            //  this is going to be run when the event is acknowledged
            return console.log(error);
        }

        console.log('The message was delivered!');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geo location is not supported in your browser');
    }
    console.log("ASadas");
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    });
});

/*
socket.on('countUpdated', (countFromServer) => {
    console.log('the count has been updated', countFromServer);
});

document.querySelector('#increment').addEventListener('click', () => {
    console.log('clicked');

    socket.emit('increment');
});
*/