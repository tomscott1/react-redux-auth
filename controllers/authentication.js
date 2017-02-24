const jwt = require('jwt-simple')
const User = require('../models/user')
const config = require('../config')

function tokenForUser(user) {
  const timestamp = new Date().getTime()
  return jwt.encode( { sub: user.id, iat: timestamp }, config.secret)
}

exports.signup = function(req, res, next) {
  // see if a user with the given email exists
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide an email and password'})
  }

  User.findOne({ email: email}, function(err, existingUser) {
    if (err) { return next(err) }
    // if a user with email does exist, return an Error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'})
    }
    // if a user with email does not exist, create and save a user record
    const user = new User ({
      email: email,
      passowrd: password
    })

    user.save(function(err){
      if (err) {return next(err)}

    // respond to request indicating the user was created - return jwt
    res.json({token: tokenForUser(user)})
    })
  })
}
