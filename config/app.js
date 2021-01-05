import bodyparser from 'body-parser'
import express from 'express'
import morgan from 'morgan'
import routes from '../routes/routes'
import apiCaller from '../utils/apiCaller'

apiCaller.refreshData()
// Refresh data every 15 seconds
setInterval(apiCaller.refreshData, 15000)

const app = express()

app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

routes(app)

export default app
