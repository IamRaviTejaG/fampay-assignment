import express from 'express'
import morgan from 'morgan'
import routes from '../routes/routes'
import apiCaller from '../utils/apiCaller'

const app = express()
app.use(morgan('dev'))

routes(app)

apiCaller.refreshData() // First data fetch
setInterval(apiCaller.refreshData, process.env.GOOGLE_API_REFRESH_INTERVAL * 1000) // Refresh data every n seconds

export default app
