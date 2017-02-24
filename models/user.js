const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
// Define our model
const UserSchema = new Schema ({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
})

// On Save hook, encrypt password

UserSchema.pre('save', function(next) {
  // get access to the user model
  const user = this

  // generate salt then run call back
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err) }
    // has (encrypt) password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err) }

      // overwrite plain text password with encrypted password
      user.password = hash
      next()
    })
  })
})

// Create the model class
const ModelClass = mongoose.model('user', UserSchema)




// Export the model

module.exports = ModelClass  // TODO: Find and Replace ModelClass with User
