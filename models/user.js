const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define our model
const UserSchema = new Schema ({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
})

// Create the model class
const ModelClass = mongoose.model('user', UserSchema)




// Export the model

module.exports = ModelClass  // TODO: Find and Replace ModelClass with User
