const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.static('build'))
cors = require('cors')
app.use(cors())
app.use(express.json())
const assignObject = (res, req, next) => {
    JSON.stringify(req.body);
    next()
}
app.use(assignObject)

morgan.token('obj', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time :obj'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>')
})
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people! <br>${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).send('Not found').end()
    }
})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})
const generateId = () => {
    const id = persons.length > 0 ?
        Math.floor(Math.random() * (500 - (Math.max(...persons.map(p => p.id))) + Math.max(...persons.map(p => p.id)))) : 0
    return id;
}

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(404).json({
            error: 'missing field'
        })
    }
    if (persons.find(p => p.name === body.name)) {
        return res.status(404).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)
    res.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

