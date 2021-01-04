import app from './config/app'

require('dotenv').config()

const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server live at http://${process.env.HOST}:${process.env.PORT}`)
})

export default server
