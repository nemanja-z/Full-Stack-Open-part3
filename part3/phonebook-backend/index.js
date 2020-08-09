const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.static('build'));
cors = require('cors');
app.use(cors());
app.use(express.json());


morgan.token('obj', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time :obj'));
const Person = require('./modules/person');

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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons =>
        res.status(200).json(persons))
        .catch(error => next(error))
})

app.get('/api/info', (req, res,next) => {
    Person.estimatedDocumentCount({}).then(info => 
        res.send(`Phonebook has info for ${info} people! <br>${new Date()}`)
        .catch(error=>next(error))
    )
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person);
        }
        else {
            res.status(404).end();
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(404).json({
            error: 'missing field'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save().then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))


})
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);

