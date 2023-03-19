require('dotenv').config()
const mongoose = require('mongoose')


const name = process.argv[2]
const number = process.argv[3]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})


const Person = mongoose.model('Person', personSchema)

if (name && number && number.match(/^(\d)+(-(\d)+)*$/)){
  mongoose.connect(url)
  newPerson = new Person({name : name, number : number})
  newPerson.save().then(result => {
    console.log(`Added ${name} number ${number} to phone book`)
    mongoose.connection.close()
  })
}
else if (name == null && number == null){
  mongoose.connect(url)
  Person.find({}).then(result => {
    result.forEach(v => console.log(v))
    mongoose.connection.close()
  })
}
