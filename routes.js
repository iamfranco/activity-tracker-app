const bcrypt = require("bcrypt")
const passport = require("passport")

module.exports = function (app, Users) {
  app.get("/", ensureAuthenticated, (req, res) => {
    res.render(__dirname + "/views/index.pug", { username: req.user.username_anycase })
  })

  app.get("/login", ensureNotAuthenticated, (req, res) => {
    res.render(__dirname + "/views/login.pug")
  })
  app.post(
    "/login",
    ensureNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })
  )

  app.get("/register", ensureNotAuthenticated, (req, res) => {
    res.render(__dirname + "/views/register.pug")
  })
  app.post("/register", ensureNotAuthenticated, (req, res) => {
    const username = req.body.username.toLowerCase()
    const username_anycase = req.body.username
    Users.findOne({ username: username }, async (err, user) => {
      if (err) return console.log(err)
      if (user) {
        // username already used
        res.redirect("/register")
      } else {
        // username is available
        const hashedPasword = await bcrypt.hash(req.body.password, 10)
        Users.create(
          {
            username: username,
            username_anycase: username_anycase,
            password: hashedPasword
          },
          (err, user) => {
            res.redirect("/login")
          }
        )
      }
    })
  })

  app.delete("/logout", (req, res) => {
    req.logOut() // function made by passport
    res.redirect("/login")
  })

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect("/login")
  }

  function ensureNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/")
    }
    next()
  }
}
