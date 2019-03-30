if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const PersonModel = require('./models/person')



app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())


morgan.token('reqData', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))

app.get('/', (req, res) => {
  res.send('path to api is "/api/persons". Info from "/info" ')
})

app.get('/info', (req, res) => {
  PersonModel.find({}).then(result => {
    res.send(`<p>Phone book contains ${result.length} persons </br> ${new Date()} </p>`)
  })
})

app.get('/api/persons', (req, res) => {
  PersonModel.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  PersonModel.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  PersonModel.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON())
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new PersonModel({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  PersonModel.findByIdAndUpdate(req.params.id, person, { new: true })
  .then(updatedPerson => {
    res.json(updatedPerson.toJSON())
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'ValidatorError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

/*
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req,res) => {
  const body = req.body
  const findPerson =
  persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  } else if (findPerson) {
    return res.status(400).json({
      error: 'name is allready added'
    })
  }

const newPerson = {
  name: body.name,
  number: body.number,
  id: Math.floor(Math.random() * 1000)
}
persons = [... persons, newPerson]
res.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})
*/