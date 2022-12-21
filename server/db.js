require('dotenv').config();
const mongoose = require('mongoose')
// model for database
// var connectionstring = "mongodb://localhost:27017/TextEditorDocs";

// const mongouri = "mongodb+srv://Mohitlostandfound:5NbZjpJz6zCjWG9P@cluster0.n1fwaei.mongodb.net/LostandFound?retryWrites=true&w=majority";

var connectionstring = process.env.MONGO_URI

const connectTomongo = () => {
    mongoose.connect(connectionstring, () => {
        console.log("MongoDB connected succesfully");
    })
}
module.exports = connectTomongo;
