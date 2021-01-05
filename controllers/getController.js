import dbConnection from '../config/database'
import redisClient from '../config/redis'
import Sentry from '../utils/sentry'

const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

export default {
  /**
   * Handles getting of all the data, paginated at 25 results per page
   * @param  req
   * @param  res
   */
  getPage: (req, res) => {
    // Validate if the user-input is an integer
    if (parseInt(req.params.page) != req.params.page) {
      res.status(500).json({ error: `Only integers allowed for page!` })
    }

    let page = 0; let skipValue = 0

    // Page numbers start from 1, but offset starts from 0 for Mongo.
    if (req.params.page !==  undefined) {
      page = req.params.page - 1
      skipValue = page * 25
    }

    const redisKey = `get_${page}`

    // Try getting cached values first, if not found, make a call to MongoDB.
    redisClient.get(redisKey, (error, response) => {
      if (error) {
        res.status(500).json({ error: error })
      } else {
        // If the response is null, it means that value wasn't found.
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
