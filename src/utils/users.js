const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: `Username '${username}' is  already in used`
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) => {
    const user = users.find((user) => {
        return user.id === id
    })
    return user;
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => {
        return user.room === room
    })


}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


// addUser({
//     id: 22,
//     username: 'esteban',
//     room: 'guanacaste'
// })

// addUser({
//     id: 23,
//     username: 'mathieu',
//     room: 'liberia'
// })

// let res= addUser({
//     id: 24,
//     username: '',
//     room: 'liberia'
// })


// let res2= addUser({
//     id: 25,
//     username: 'mathieu',
//     room: 'liberia'
// })

// console.log(res)
// console.log(res2)

// const usersInRoom = getUsersInRoom('guanacaste')


// console.log('Users in Guanacaste', usersInRoom)

// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)

// const userFound = getUser(23)
// console.log(userFound)

