const expres = require('express')
const app = expres()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('reqData', function (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqData'))

let persons = [{
    id: 1,
    name: "Arto Hellas",
    number: "045-1236543"
  },
  {
    id: 2,
    name: "Arto Järvinen",
    number: "041-21234212"
  },
  {
    id: 3,
    name: "Lea Kutvonen",
    number: "040-45648975"
  },
  {
    id: 4,
    name: "Martti Tienari",
    number: "09-554687841"
  }
]

app.get('/', (req, res) => {
  res.send('path to api is "/api/persons". Info from "/info" ')
})

app.get('/info', (req, res) => {

  res.send(`<p>Phone book contains ${persons.length} persons </br> ${new Date()} </p>`)

})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req,res) => {
  const body = req.body
  const findPerson = 
  persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return res.send.status(400).json({ 
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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})