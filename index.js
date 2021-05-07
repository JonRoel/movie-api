const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  app = express(),
  PORT = 8080;

//Use morgan logging common
app.use(morgan('common'));

//Set Static file directory
app.use(express.static('public'));

app.get('/documentation.html', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});

//Error Logging
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('An Error occurred...');
});

//Top 10 Movie List
let topMovies = ['Matrix - Trilogy', 'Avatar', 'Monty Python and The Holy Grail', 'Gladiator', 'Water World', 'Oceans Eleven', 'Batman', 'John Wick', 'Kingsman The Secret Service', 'Pirates of The Caribbean']

//Loads topMovies Array
app.get('/movies', function(req, res) {
  res.json(topMovies);
});

//Prints a string to the home page
app.get('/', function(req, res) {
  res.send('This is a textual response')
});

//Sets Server to port 8080
app.listen(PORT, () => {
  console.log(`Movie App is runnin on localhost:${PORT}`);
});