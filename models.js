const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let genreSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    "name" : String,
    "description" : String
  },
  director: {
    "name": String,
    "bio" : String,
    "birthyear" : String,
  },
  Actors: [String],
  imageUrl: String,
  featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: String,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  birthyear: Date,
  deathyear: Date,
});

let Genre = mongoose.model("Genre", genreSchema);
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);

module.exports.Genre = Genre;
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;
