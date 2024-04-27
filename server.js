const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// ----- connecting the data base ----
const connectDB = require('./config/db');
connectDB();

// Template Engine;
app.use(express.static('public')) // this helps you to connect all static files to our server.

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.json()); 

app.use(cors());
app.options("*", cors());

// Routes;
app.use('/api/files', require('./routes/files'))
app.use('//files', require('./routes/show'))
app.use('/files/download/', require('./routes/download'))


app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})