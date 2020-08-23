const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-Location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoScroll = () => {
    // New message element 
    const $newMessage = $messages.lastElementChild


    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage) // method available by the browser
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin


    const visibleHeight = $messages.offsetHeight

    // Height of messages container

    const containerHeight = $messages.scrollHeight

    //How far have I scrolled?

    const scrollOffset = $messages.scrollTop + visibleHeight

    // If the user was at the bottom before the last message was received
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}


socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})




socket.on('roomData', ({ room, users }) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (event) => {
    event.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = event.target.elements.message
    socket.emit('sendMessage', message.value, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

document.querySelector('#send-Location').addEventListener('click', (event) => {

    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser")
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', data, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location was shared')
        })
    })
})

console.log(username + " " + room)

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})