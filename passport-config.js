const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const ObjectID = require("mongodb").ObjectId

function initialize(passport, Users) {
  const authenticateUser = async (username, password, done) => {
    Users.findOne({ username: username.toLowerCase() }, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false)
      if (!bcrypt.compareSync(password, user.password)) return done(null, false)
      return done(null, user)
    })
  }

  passport.use(new LocalStrategy({ usernameField: "username" }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser((id, done) => {
    Users.findOne({ _id: new ObjectID(id) }, (err, user) => {
      if (err) return console.log(err)
      done(null, user)
    })
  })
}

module.exports = initialize
