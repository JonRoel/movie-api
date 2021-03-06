const mongoose = require("mongoose");
const Models = require("../models.js");

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;

const { check, validationResult } = require("express-validator");

const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  app = express(),
  PORT = process.env.PORT || 8080;

const cors = require("cors");
app.use(cors());

// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Set allowed Origins for requests
let allowedOrigins = [
  "http://localhost:8080",
  "https://myflix-jonathon.herokuapp.com/",
  "http://localhost:1234",
  "https://myflix-jonathonroeland.netlify.app",
  "wss://myflix-jonathonroeland.netlify.app/",
  "http://localhost:4200/",
  "http://localhost:4200",
  "https://jonroel.github.io/myFlix-Anglular-client",
  "https://jonroel.github.io/myFlix-Anglular-client/",
  "https://jonroel.github.io",
  "https://jonroel.github.io/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          "The CORS policy for this application does not allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

//Use morgan logging common
app.use(morgan("common"));

//Set Static file directory to public
app.use(express.static("public"));

//Error Logging
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("An Error occurred...");
});

//Imports auth.js for logins
let auth = require("./auth")(app);

const passport = require("passport");
require("../passport");

/**
 * Get all movie and movie details
 * @method GET
 * @param {string} endpoint - Endpoint to fetch movie details. "url/movies"
 * @returns {object} - Returns the movie as an object
 */

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Get movies with specific genre
 * @method GET
 * @param {string} endpoint - Endpoint fetch genre details.
 * @param {string} name - Genre Name is used to get specific genre details "url/movies/action"
 * @returns {object} - Returns all movies with specific genre
 */

app.get(
  "/movies/:genre",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ genre: req.params.genre.name })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets genre details from genre collection
 * @method GET
 * @param {string} endpoint - Endpoint to fetch genre details.
 * @param {string} name - genre name required
 * @returns {object} - Returns genre details as an object.
 */

app.get(
  "/genres/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Genres.findOne({ name: req.params.name })
      .then((genres) => {
        res.status(201).json(genres);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets specific movie by title
 * @method GET
 * @param {string} endpoint - Endpoint to fetch single movie details.
 * @param {string} Title - movie title required
 * @returns {object} - Returns movie details as an object
 */

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ Title: req.params.Title })
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets all directors
 * @method GET
 * @param {string} endpoint - Endpoint to fetch director collection
 * @returns {object} - Returns directors as objects
 */

app.get(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Directors.find()
      .then((directors) => {
        res.status(201).json(directors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Gets specific director by name
 * @method GET
 * @param {string} endpoint - Endpoint to fetch single director
 * @param {string} name - name required
 * @returns {object} - Returns director details as an object
 */

app.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Directors.findOne({ name: req.params.name })
      .then((directors) => {
        res.status(201).json(directors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Create a new user
 * @method POST
 * @param {string} endpoint - endpoint for creating a new user
 * @param {string} Username, Password, Email, Birthday - required for new user creation
 * @returns {object} - Creates a new user
 */

app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error :" + error);
      });
  }
);

/**
 * Gets all users
 * @method GET
 * @param {string} endpoint - Endpoint to fetch users
 * @returns {object} - Returns users details as an object
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Update user details
 * @method PUT
 * @param {string} endpoint - Endpoint to update single user
 * @param {string} Username - username required
 */

app.put(
  "/userupdate/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    // The below code is commented out to allow user profile update without updating urername. Uncomment to allow username to be updated
    //check("Username", "Username is required").isLength({ min: 4 }),
    //check(
      //"Username",
      //"Username contains non alphanumeric characters - not allowed."
    //).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          //Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**
 * Gets single user details
 * @method GET
 * @param {string} endpoint - Endpoint to fetch single user details.
 * @param {string} Username - Username required
 * @returns {object} - Returns user details as an object
 */

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Delete user profile
 * @method DELETE
 * @param {string} endpoint - Endpoint to user profile
 * @param {string} Username - Username required
 * @returns {object} - Returns movie details as an object
 */

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + "was not found.");
        } else {
          res.status(200).send(req.params.Username + "was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * Add a movie to users favorites list
 * @method POST
 * @param {string} endpoint - Endpoint to add single movie to users favorites list
 * @param {string} Title - movie title required
 * @param {string} Username - Username required
 * @returns {object} - Returns movie details as an object
 */

app.post(
  "/users/addtofavs/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $addToSet: { Favorites: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);


/**
 * Remove a movie to users favorites list
 * @method POST
 * @param {string} endpoint - Endpoint to remove single movie to users favorites list
 * @param {string} Title - movie title required
 * @param {string} Username - Username required
 * @returns {object} - Returns movie details as an object
 */

app.post(
  "/users/removefromfavs/:Username/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { Favorites: req.params.MovieID },
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Prints a string to the home page
app.get("/", function (req, res) {
  res.send("This is a textual response");
});

//Sets Server to port 8080
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on Port: ` + PORT);
});
