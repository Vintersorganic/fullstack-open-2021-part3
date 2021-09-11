require('dotenv').config()
// const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.json())
app.use(express.static('build'))


/*let persons = [
  {
    'id': 1,
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': 2,
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': 3,
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': 4,
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]
*/

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const date = new Date()
    console.log(persons, 'persons log', typeof persons, 'typeof Persons')
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // const person = persons.find(person => person.id === id)
  // person ? res.json(person) : res.status(404).end()

  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // persons = persons.filter(person => person.id !== id)

  Person.findByIdAndRemove(req.params.id)
    .then(res => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!req.body.number){
    return res.status(400).json({
      error: 'number missing'
    })
  }

  // if (persons.find(person => person.name === req.body.name)) {
  //   return res.status(400).json({
  //     error: 'name already exist on database'
  //    })
  // }

  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
    // persons = persons.concat(person)
    // res.json(person)
})

app.put('/api/persons/:id', (req, res, next) => {

  const person = {
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { runValidators: true, new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// This is the error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})