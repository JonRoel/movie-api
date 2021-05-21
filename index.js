const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;

const { check, validationResult } = require('express-validator');

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  app = express(),
  PORT = process.env.PORT || 8080;

const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Set allowed Origins
let allowedOrigins = ['http://localhost:8080', 'http://testside.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(nukk, true);
  }
}));

//Use morgan logging common
app.use(morgan('common'));

//Set Static file directory to public
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

//Imports auth.js for logins
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//Add Movie to database 
//  NOTE: Will use later to have a frontend input for adding movies as admin

// app.post('/movies', (req, res) => {
//   Movies.findOne({Title: req.body.Title })
//   .then((movie) => {
//     if(movie) {
//       return res.status(400).send(req.body.Title + ' already exists');
//     } else {
//       Movies
//         .create({
//           Title: req.body.Title,
//           description: req.body.description,
//           genre: req.body.genre,
//           imageUrl: req.body.imageUrl,
//           featured: req.body.featured
//         })
//         .then ((movie) =>{res.status(201).json(movie) })
//         .catch((error) => {
//           console.error(error);
//           res.status(500).send('Error: ' + error);
//         })
//     }
// })
// .catch((error) => {
//   console.error(error);
//   res.status(500).send('Error :' + error);
// });
// });

//Get all movies
app.get('/movies', passport.authenticate('jwt', {session:false}), (req, res) => {
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
app.get('/movies/:title',  passport.authenticate('jwt', {session:false}), (req, res) => {
  Movies.find({ Title:req.params.Title })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Returns a list of movies by Genre
app.get('/movies/:genre', passport.authenticate('jwt', {session:false}), (req, res) => {
  Movies.find({ genre:req.params.genre })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Returns a list of directors
app.get('/directors', passport.authenticate('jwt', {session:false}), (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Returns a page about a specific Director
app.get('/directors/:name', passport.authenticate('jwt', {session:false}), (req, res) => {
  Directors.findOne({ name: req.params.name})
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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
app.post('/users', passport.authenticate('jwt', {session:false}), [
  check('Username', 'Username is required').isLength({min: 4}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username })
    .then((user) => {
      if(user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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
app.get('/users', passport.authenticate('jwt', {session:false}), (req, res) => {
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
app.put('/users/:Username', passport.authenticate('jwt', {session:false}), [
  check('Username', 'Username is required').isLength({min: 4}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

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
app.get('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
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
app.delete('/users/:Username', passport.authenticate('jwt', {session:false}), (req, res) => {
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
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {session:false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username}, {
      $addToSet: {Favorites:req.params.MovieID}
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
app.delete('/users/:Username/Movies/remove/:MovieID', passport.authenticate('jwt', {session:false}), (req, res) => {
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on Port: ` + PORT);
});