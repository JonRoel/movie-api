const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title:{type: String, required:true},
  description: {type: String, required:true},
  genre: {
    name: String,
    description:String
  },
  director: {
    name: String,
    bio: String
  },
  Actors: [String],
  imageUrl: String,
  featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  Favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let directorSchema = mongoose.Schema({
  name: {type: String, required: true},
  bio: String,
  birthyear: Date,
  deathyear: Date
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;