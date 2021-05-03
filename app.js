const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Create app
const app = express();

// Set static
app.use(express.static('public'));

// View engine
app.set('view engine', 'ejs');

// Connect to database
mongoose.connect(keys.mongodb.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        console.log('Connected to database...');
        app.listen(8080, () => console.log('Server is listening...'));
    })
    .catch(error => console.log(error));

// Routes
app.get('/', (request, response) => response.render('home'));
app.get('/smoothies', (request, response) => response.render('smoothies'));
app.use(authRoutes);