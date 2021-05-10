const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  app = express(),
  PORT = 8080;

//Use morgan logging common
app.use(morgan('common'));

//Set Static file directory
app.use(express.static('public'))

// app.get('/documentation.html', (req, res) => {
//   res.sendFile('/public/documentation.html', { root: __dirname });
// });

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

//Loads topMovies Array (Will display all movies at a later date)
app.get('/movies', function(req, res) {
  res.json(topMovies);
});

//Returns information about selected movie
app.get('/movies/:title', function (req, res) {
  res.send('That title does not exist in our database, sorry.')
  // res.json(movies.find((movie) =>
  // {return movie.title === req.params.title}));
});

//Returns a list of movies by Genre
app.get('/movies/genres/:genre', function (req, res) {
  res.send('There are no movies yet, searching by genre will not help you!');
  // res.json(movies.find((movie) =>
  // {return movie.genre === req.params.genre}));
});

//Returns a page about a specific Director
app.get('/directors/:name', function (req, res) {
  res.send('Try a different director');
  // res.json(movies.find((director) =>
  // {return director.name === req.params.name}));
});

//Sign up page - Will not need as sign up page will go to public folder (maybe)
app.get('/sign-up.html', function(req, res) {
  res.sendFile('/public/sign-up.html', { root: __dirname });
});

//Login Page
app.get('/login.html', function(req, res) {
  res.sendFile('/public/login.html', { root: __dirname });
});

//User account info
app.get('/users/:userid', function(req, res) {
  res.send('Successful GET request for user account details');
});

//Delete account
app.get('/users/:user-id/delete', function(req, res) {
  res.send('Successfully deleted user account');
});

//Edit account info
app.get('/users/:user-id/edit', function(req, res) {
  res.send('You can edit your account details here');
});

//Add to favorites
app.get('/users/:user-id/favorites/add-favorites', function(req, res) {
  res.send('Successfully added Movie Title to favorites');
});

//Remove from favorites
app.get('/users/:user-id/favorites/remove-favorites', function(req, res) {
  res.send('Movie Title has been removed from favorites');
});

//Prints a string to the home page
app.get('/', function(req, res) {
  res.send('This is a textual response')
});

//Sets Server to port 8080
app.listen(PORT, () => {
  console.log(`Movie App is running on localhost:${PORT}`);
});