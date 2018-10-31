
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')
const app = express()

// init chatkit
const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:820bb38b-3ede-42e9-8a42-4dd950d117bb',
  key: 'a1951840-33de-41d8-bd6e-c849a35ec787:/JInT6AVrBLiGt6NW5awRXH6O4h6dYvxv5vqLmXKGRo=',
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// create users
app.post('/users', (req, res) => {
  const { username } = req.body
  console.log(username);
  chatkit
    .createUser({ 
    id: username, 
    name: username 
     })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
})
const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})