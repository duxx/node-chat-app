let form = document.getElementById("message-form")
let input = document.querySelector('[name=message]')
let messages = document.getElementById("messages")
let locationButton = document.getElementById('send-location')

let socket = io();
socket.on('connect', () => {
    console.log("Connected to server")
})

socket.on('disconnect', () => {
    console.log("Disconnected from server")
})

socket.on('newMessage', (message) => {
    console.log("New message", message)
    messages.innerHTML += `${message.from}: ${message.text}<br/>`
})

socket.on('newLocationMessage', (message) => {
    messages.innerHTML += `${message.from}: <a href="${message.url}" target="_blank">View my location</a><br/>`
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        text: input.value
    })
    input.value = ''
})

locationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, (e) => {
        alert('Unable to geolocate')
    })
})