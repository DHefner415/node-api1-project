const express = require('express')
const Users = require('./users/model')

const server = express()

server.use(express.json())

server.post('/api/users', (req, res) => {
  const user = req.body
  if (!user.name || !user.bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user',
    })
  } else {
    Users.insert(user)
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(() => {
        res.status(500).json({
          message: 'There was an error while saving the user to the database',
        })
      })
  }
})

server.get('/api/users', async (req, res) => {
  try {
    const users = await Users.find(res.params)
    res.json(users)
  } catch (err) {
    res.status(500).json({
      message: 'The users information could not be retrieved',
    })
  }
})

server.get('/api/users/:id', async (req, res) => {
  try {
    const user = await Users.findById(req.params.id)
    if (!user) {
      res.status(404).json({
        message: 'The user with the specified ID does not exist',
      })
    } else {
      res.json(user)
    }
  } catch (err) {
    res.status(500).json({
      message: 'The user information could not be retrieved',
    })
  }
})

server.delete('/api/users/:id', async (req, res) => {
  try {
    const deleted = await Users.remove(req.params.id)
    if (!deleted) {
      res.status(404).json({
        message: 'The user with the specified ID does not exist',
      })
    } else {
      res.json(deleted)
    }
  } catch (err) {
    res.status(500).json({
      message: 'The user could not be removed',
    })
  }
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const { name, bio } = req.body

  Users.update(id, { name, bio })
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' })
      } else if (!name || !bio) {
        res.status(400).json({
          message: 'Please provide name and bio for the user',
        })
      } else {
        res.json(user)
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'The user information could not be modified' })
    })
})

module.exports = server // EXPORT YOUR SERVER instead of {}
