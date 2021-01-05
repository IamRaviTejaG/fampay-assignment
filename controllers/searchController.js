import dbConnection from '../config/database'
import redisClient from '../config/redis'

const itemSchema = require('../schema/itemSchema')
const ItemModel = dbConnection.model('item', itemSchema)

export default {
  /**
   * Handles the search functionality. Creates a regexp out of the search string and matches
   * with the database entries.
   * @param  req
   * @param  res
   */
  search: (req, res) => {
    const searchString = req.params.searchString

    if (searchString === undefined || searchString === null) {
      res.status(200).json({ error: 'The specific search string was invalid!' })
    } else {
      redisClient.get(searchString, (error, response) => {
        if (error) {
          res.status(500).json({ error: error })
        } else {
          if (response === null) {
            // Convert search_string received into a regex for title & description matching
            const searchStringRegexp = new RegExp(searchString.replace(' ', '|'))
            ItemModel.find({
              $or: [{ title: { $regex: searchStringRegexp, $options: 'i' } },
                { description: { $regex: searchStringRegexp, $options: 'i' } }]
            }).sort({ publish_time: -1 }).limit(50).then(result => {
              // Invalidate cached results after 5 minutes, as things might change very frequently
              redisClient.set(searchString, JSON.stringify(result), 'EX', 300).then(res => {
                console.log(`Successfully set key: ${searchString} to Redis. Result: ${res}`)
              }).catch(err => {
                console.error(`Error setting key: ${searchString} to Redis. Error: ${err}`)
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
}
