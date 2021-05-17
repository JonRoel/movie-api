const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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

//Add Movie to database 
/*Expected JSON format
  Title: String (Required)
  description: String (Required)
  genre: Relation [GenreID]
  imageUrle: String
  directors: Relation [DirectorID]
  featured: Boolean (Required)
  */ 
app.post('/movies', (req, res) => {
  Movies.findOne({Title: req.body.Title })
  .then((movie) => {
    if(movie) {
      return res.status(400).send(req.body.Title + ' already exists');
    } else {
      Movies
        .create({
          Title: req.body.Title,
          description: req.body.description,
          genre: req.body.genre,
          imageUrl: req.body.imageUrl,
          featured: req.body.featured
        })
        .then ((movie) =>{res.status(201).json(movie) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
    }
})
.catch((error) => {
  console.error(error);
  res.status(500).send('Error :' + error);
});
});

//Get all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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

//Sign up page
app.get('/sign-up.html', function(req, res) {
  res.sendFile('/public/sign-up.html', { root: __dirname });
});

//Create Account
/* Expected JSON Format
{
  ID: Integer,
  username: String,
  password: String,
  Email: String,
  birthday: Date
} */
app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username })
    .then((user) => {
      if(user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then ((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error :' + error);
  });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update Account info, by username
/* Expected JSON format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Login Page
app.get('/login.html', function(req, res) {
  res.sendFile('/public/login.html', { root: __dirname });
});

//User account info
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Delete account
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username})
  .then((user) => {
    if (!user) {
      res.status(400).send(req.params.Username + 'was not found.');
    } else {
      res.status(200).send(req.params.Username + 'was deleted.');
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Add to favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $push: {Favorites:req.params.MovieID}
},
{new:true},
  (err, updatedUser) => {
    if (err) {
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
  });
});

//Remove from favorites
app.post('/users/:Username/Movies/remove/:MovieID', (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
    $pull: {Favorites:req.params.MovieID}
},
{new:true},
  (err, updatedUser) => {
    if (err) {
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
  }
  });
});

//Prints a string to the home page
app.get('/', function(req, res) {
  res.send('This is a textual response')
});

//Sets Server to port 8080
app.listen(PORT, () => {
  console.log(`Movie App is running on localhost:${PORT}`);
});