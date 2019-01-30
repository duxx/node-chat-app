let form = document.getElementById("message-form")
let input = document.querySelector('[name=message]')
let messages = document.getElementById("messages")
let locationButton = document.getElementById('send-location')
let usersDiv = document.getElementById('users')
let template = document.getElementById("message-template").innerHTML
let locationTemplate = document.getElementById("location-message-template").innerHTML

let scrollToBottom = () => {
    let clientHeight = messages.clientHeight
    let scrollTop = messages.scrollTop
    let scrollHeight = messages.scrollHeight
    let newMessage = messages.children.querySelector('div.message-wrap:last-child')
    
}

let socket = io();
socket.on('connect', () => {
    let params = deparam()
    socket.emit('join', params, (err) => {
        if(err) {
            alert(err)
            window.location.href = "/"
        } else {
            console.log("Data ok")
        }
    })
})

socket.on('disconnect', () => {
    console.log("Disconnected from server")
})

socket.on('updateUsersList', (users) => {
    let ol = document.createElement('ol')
    users.forEach((user) => {
        let node = document.createElement('li')
        node.innerText = user
        ol.appendChild(node)
    })
    usersDiv.innerHTML = ol.outerHTML
    console.log(users)
})

socket.on('newMessage', (message) => {
    let time = moment(message.createdAt).format('hh:mm')
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: time
    })
    messages.innerHTML += html
})

socket.on('newLocationMessage', (message) => {
    let time = moment(message.createdAt).format('hh:mm')
    let html = Mustache.render(locationTemplate, {
        url: message.url,
        from: message.from,
        createdAt: time
    })
    messages.innerHTML += html
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
    locationButton.setAttribute('disabled', 'disabled')
    locationButton.textContent = 'Sending location...'
    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttribute('disabled')
        locationButton.textContent = 'Send my location'
        console.log(position)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, (e) => {
        alert('Unable to geolocate')
    })
})