require("dotenv").config()

const express = require("express")
const app = express()

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const flash = require("express-flash")
const session = require("express-session")
const passport = require("passport")
const initializePassport = require("./passport-config")
const methodOverride = require("method-override")
const routes = require("./routes")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method")) // for form delete method
app.set("view engine", "pug")

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const Users = mongoose.model(
  "users",
  new Schema({
    username: { type: String, require: true, unique: true },
    username_anycase: { type: String, require: true },
    password: { type: String, require: true }
  })
)

initializePassport(passport, Users)
routes(app, Users)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log("Listening on port " + port)
})
