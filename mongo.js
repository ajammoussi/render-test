const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://test:${password}@fso-part3-demo.t5pfu8c.mongodb.net/noteApp?retryWrites=true&w=majority&appName=FSO-part3-demo`;

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'Second note in Mongo !',
    important: true,
})

// note.save()
//     .then(result => {
//         console.log('note saved!')
//         console.log(result)
//         mongoose.connection.close()
//     })
//     .catch(err => console.log(err))

Note.find({})
    .then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })

