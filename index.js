const express = require('express')
const cors = require('cors')
var morgan = require('morgan')


const app = express()


app.use(express.json())

app.use(express.static('build'))

morgan.token('person', function (req, res, m) {

  return m === "POST" ? JSON.stringify(req.body) : ""
})


app.use(morgan(function (tokens, req, res) {
  let meth = tokens.method(req, res)
  return [
    meth, tokens.url(req, res), tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.person(req, res, meth)
  ].join(' ')
}))


app.use(cors())

let contacts = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.send(contacts)
})

app.get('/info', (request, response) => {
  response.send(`<h2> Phonebook has info for ${contacts.length} people </h2>
  
  <h3>As of ${new Date()} </h3>
  
  `)
})

app.get('/api/persons/:id', (request, response) => {
  id = Number(request.params.id)
  p = contacts.find(x => x.id === id)

  if (p) response.send(p)
  else response.status(404).end()

})

app.delete('/api/persons/:id', (request, response) => {

  id = Number(request.params.id)
  contacts = contacts.filter(x => x.id !== id)

  response.status(204).end()

})

let getID = () => {

  ids = contacts.map(x => x.id)

  for (i = 1; i < contacts.length; i++) {
    if (!ids.find(x => x === i)) {
      return i
    }
  }

  return contacts.length + 1


}


app.post('/api/persons', (request, response) => {
  body = request.body

  if (!body.name || !body.number) {
    response.status(404).send({ error: 'Incomplete information' })
    return
  }

  if (contacts.find(x => x.name == body.name)) {
    response.status(404).send({ error: 'names must be unique' })
    return
  }

  contact = { name: body.name, number: body.number, id: Math.floor(Math.random() * 10000) }

  contacts.push(contact)


  response.send(contacts)


})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})