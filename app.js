require("dotenv").config()
const express = require("express")
const app = express()
const session = require("express-session")
const passport = require("passport")
const initializePassport = require("./passport-config")
const methodOverride = require("method-override")
const routes = require("./routes")
const connectDB = require("./connectDB")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session()) // for persistent log in
app.use(methodOverride("_method")) // for form delete method
app.set("view engine", "pug")

const Users = connectDB.Users
initializePassport(passport, Users)
routes(app, Users)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Listening on http://localhost:" + port)
})
