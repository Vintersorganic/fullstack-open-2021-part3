const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))
app.use(express.json())
app.use(express.static('build'))

let persons = [
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

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const peoplePopulation = persons.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${peoplePopulation} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    
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

      if (persons.find(person => person.name === req.body.name)) {
        return res.status(400).json({ 
          error: 'name already exist on database' 
         })
      }

    const person = {
        id: Math.floor(Math.random() * 9999999),
        name: req.body.name,
        number: req.body.number
    }

    persons = persons.concat(person)
    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})