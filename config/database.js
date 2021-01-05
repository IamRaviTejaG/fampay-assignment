import mongoose from 'mongoose'

const dbURL = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DBNAME}`

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

const dbConnection = mongoose.createConnection(dbURL, dbOptions)

dbConnection.on('connected', () => {
  console.log('Connected to MongoDB successfully!')
})

dbConnection.on('error', error => {
  console.log(`MongoDB connection couldn't be established. ${JSON.stringify(error)}`)
})

export default dbConnection
