const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected to MongoDB')
  })
  // eslint-disable-next-line no-unused-vars
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('error connecting to MongoDB')
  })
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    minlength: 8
  }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)