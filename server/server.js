const connectTomongo = require('./db');

const path = require('path');
// document model is imported here .

const Document = require('./models/Document')
connectTomongo();

const express = require('express');
const app = express();
var cors = require('cors')
const port = 1983;

app.use(cors());
app.use(express.json());




// our apps routes are going to be here.

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/blog', require('./routes/blog'))
app.use('/api/newblog', require('./routes/addblogio'))



// // static files will be connected here
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// app.get("*", function (req, res) {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



