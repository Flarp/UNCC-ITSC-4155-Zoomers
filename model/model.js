const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "The user's first name is required!"],
    minlength: [1, "The user's first name needs to have a character!"],
    maxlength: [50, "The user exceeded input thresehold!"],
  },

  lastName: {
    type: String,
    required: [true, "The user's last name is required!"],
    minlength: [1, "The user's last name needs to have a character!"],
    maxlength: [70, "The user exceeded input thresehold!"]
  },

  email: {
    type: String,
    required: [true, "An email is required to create an account"],
    match: /\w+@\w+\.[a-zA-Z]{2,4}/,
  },

  username: {
    type: String,
    required: [true, "A username is required to create an account"],
    minLength: [3, "The username needs more characters"],
    maxLength: [15, "The username exceeds the limit thresehold"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "User's password to the account is required."],
  }
});

//Reolace plaintext string from user with hash + salted string to store in dataase
//Pre middleware - Run this middleware before saving the document
userSchema.pre("save", function(next) {
  //Grab schema instance
  let user = this;

  //If the password isnt being modified (Other field), then no issue
  if(!user.isModified("password")) {
    return next;
  } else {
    //Hash and salt the plaintext password
    bcrypt.hash(user.password, 10).then(hashedPassword => {
      user.password = hashedPassword;
      next();
    }).catch(error=> {
      next(error);
    })
  }
});

//Compare the login info attempt with what is stored in the database
userSchema.methods.comparePassword = function(plainTextPassword) {
  //Compare input with what is stored in the database
  return bcrypt.compare(plainTextPassword, this.password);
}

module.exports = mongoose.model('User', userSchema)

//module.exports