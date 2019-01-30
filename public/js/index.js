let form = document.getElementById("message-form")
let input = document.querySelector('[name=message]')
let messages = document.getElementById("messages")

let socket = io();
socket.on('connect', () => {
    console.log("Connected to server")

    socket.emit('createMessage', {
        "from": "Antti",
        "text": "Nope"
    })
})
socket.on('disconnect', () => {
    console.log("Disconnected from server")
})

socket.on('newMessage', (message) => {
    console.log("New message", message)
    messages.innerHTML += `${message.from}: ${message.text}<br/>`
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        text: input.value
    })
    input.value = ''
})