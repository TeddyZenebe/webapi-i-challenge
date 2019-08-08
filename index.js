// implement your API here
const express = require('express')
const db = require('./data/db.js')
const server = express()
server.use(express.json())

server.post('/api/users', (req, res)=>{
  const newUser = req.body
  const {name, bio} = newUser
  if(!name||!bio){
   res.status(400).json({ error: "Please provide name and bio for the user." })
  } else {
  db.insert(newUser)
  .then(users=> {res.status(201).json(users)})
  .catch(err=> {
    res.status(500).json({  err: err,
      error: "There was an error while saving the user to the database" })
  })}
})


server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users)})
  .catch((err) => {
    res.status(500).json({
      err: err,
      error: "The users information could not be retrieved."})
  })
})

server.get('/api/users/:id', (req, res) => {
  const {id} = req.params
 
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({
          error: "The user with the specified ID does not exist.",
        })
      }
    })
    .catch((err) => {
      res.status(500).json({error: "The user information could not be retrieved."})
    })
})


server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(deleted => {
      if(deleted){res.status(204).json(deleted)}
      else {res.status(404).json({error:"The user with the specified ID does not exist."})} 
    })
    .catch((err) => {
      res.status(500).json({ error: "The user could not be removed" 
      })
    })
})

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body;
  const {name, bio} = changes
  if(!name || !bio){
    res.status(400).json({ error: "Please provide name and bio for the user." })
  } else{
    db.update(id, changes)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated)
      } else {
        res.status(404).json({
          error: "The user with the specified ID does not exist.",
        })
      }
    })
    .catch((err) => {
      res.status(500).json({error: "The user information could not be modified."
      })
    })
  }
})

// watch for connections on port 5000
server.listen(5000, () =>
  console.log('Server running on http://localhost:5000')
)
