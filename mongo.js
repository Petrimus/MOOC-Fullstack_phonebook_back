/* eslint-disable no-console */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  // eslint-disable-next-line no-console
  console.log('give password as argument')
  process.exit()
}

const passwd = process.argv[2]
const url =
  `mongodb+srv://fullstack:${passwd}@cluster0-eel55.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({})
    .then(response => {
      response.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save()
    .then(response => {
      console.log(
        `Lisätään ${response.name} numero ${response.number} luetteloon`
      )
      mongoose.connection.close()
    })
}

