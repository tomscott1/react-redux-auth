const passport    = require('passport')
const User        = require('../models/user')
const config      = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt  = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')
// const mongoose = require('mongoose')

// make local Strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify email and password call done if correct otheruse call done if false
  User.findOne({ email: email}, function(err, user) {
    if (err) { return done(err) }
    if(!user) { return done(null, false) }

    // compare passwords
    user.comparePassword(password, function(err, isMatch) {
      console.log(err, isMatch)
      if (err) { return done(err) }
      if(!isMatch) { return done(null, false) }

      return done(null, user)
    })
  })

})


// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // if it does call 'done' what that user
  // otherwise call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false) }

    if (user) {
      done(null, user)  // no error and user found ok
    } else {
      done(null, false)  // no error but no user found
    }
  })
})

// Tell passport to use this Strategy
passport.use(jwtLogin)
passport.use(localLogin)
