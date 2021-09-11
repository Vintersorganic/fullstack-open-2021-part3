const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }

const password = process.argv[2]

const url =
  `mongodb+srv://varulvsnatt:${password}@cluster0.m2aur.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url)

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (process.argv.length >= 4) {
    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}

if (process.argv.length < 4) {
    Person.find({}).then(persons => {
        persons.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close()
    })
  }


