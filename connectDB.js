require("dotenv").config()
const mongoose = require("mongoose")
const Schema = mongoose.Schema

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const Users = mongoose.model(
  "users",
  new Schema({
    username: { type: String, require: true, unique: true },
    username_anycase: { type: String, require: true },
    password: { type: String, require: true }
  })
)

module.exports.Users = Users
