import mongoose from 'mongoose'
require('dotenv').config()

const dbURL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DBNAME}`

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

const dbConnection = mongoose.createConnection(dbURL, dbOptions)

export default dbConnection
