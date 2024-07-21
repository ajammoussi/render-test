require("dotenv").config()
const express = require("express")
const cors = require("cors")
const Note = require("./models/note")
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static("dist"))


let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only Javascript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
]

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method)
    console.log("Path:  ", request.path)
    console.log("Body:  ", request.body)
    console.log("---")
    next();
};

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" })
    }

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>")
    })

app.get("/api/notes", (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes);
    })
    })

app.get("/api/notes/:id", (request, response) => {
    // without MongoDB
    // const id = request.params.id
    // const note = notes.find((note) => note.id === id)

    // if (note) {
    //     response.json(note)
    // } else {
    //     response.status(404).end()
    // }

    // with MongoDB
    Note.findById(request.params.id).then((note) => {
        response.json(note);
    });
})

app.delete("/api/notes/:id", (request, response) => {
    // without MongoDB
    // const id = request.params.id;
    // notes = notes.filter((note) => note.id !== id)
    // response.status(204).end()

    // with MongoDB
    Note.findOneAndDelete({ _id: request.params.id })
        .then((result) => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

const generateId = () => {
    const maxId =
        notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;
    return String(maxId + 1)
};

app.post("/api/notes", (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
        error: "content missing",
        })
    }

    // without MongoDB
    // const note = {
    //     content: body.content,
    //     important: body.important || false,
    //     id: generateId()
    // };
    // notes = notes.concat(note)
    // response.json(note)


    // with MongoDB
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
