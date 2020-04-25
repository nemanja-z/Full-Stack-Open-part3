const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument')
    process.exit(1)
}/*
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
            mongoose.connection.close()
        })

    })
}*/

const password = process.argv[2]

const url = `mongodb+srv://nemanja:${password}@cluster0-tqxaa.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})
const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
            mongoose.connection.close()
        })

    })
}
person.save().then(response => {
    console.log('person saved')
    mongoose.connection.close()
})