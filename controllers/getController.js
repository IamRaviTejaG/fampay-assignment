import dbConnection from '../config/database'
import redisClient from '../utils/redis'

const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

export default {
  /**
   * Handles getting of all the data, paginated at 25 results per page
   * @param  req
   * @param  res
   */
  getPage: (req, res) => {
    let page = 0; let skipValue = 0

    if (req.params.page !== undefined) {
      page = req.params.page - 1
      skipValue = page * 25
    }

    const redisKey = `get_${page}`

    redisClient.get(redisKey, (error, response) => {
      if (error) {
        res.status(500).json({ error: error })
      } else {
        if (response === null) {
          ItemModel.find().sort({ publish_time: -1 }).skip(skipValue).limit(25).then(result => {
            // Invalidate cached results after 5 minutes, as things might change very frequently
            redisClient.set(redisKey, JSON.stringify(result), 'EX', 300).then(res => {
              console.log(`Successfully set key: ${redisKey} to Redis. Result: ${res}`)
            }).catch(err => {
              console.error(`Error setting key: ${redisKey} to Redis. Error: ${err}`)
            })
            res.status(200).json({ message: 'Data fetched successfully!', result })
          }).catch(err => {
            res.status(500).json({ error: err })
          })
        } else {
          res.status(200).json({ message: 'Cached data fetched successfully!', result: JSON.parse(response) })
        }
      }
    })
  }
}
