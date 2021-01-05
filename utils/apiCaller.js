import constants from '../config/constants'
import resultParser from './resultParser'
import dbConnection from '../config/database'
import itemSchema from '../schema/itemSchema'
const googleapis = require('googleapis')

const ItemModel = dbConnection.model('item', itemSchema)

// For multiple Google API keys, please specify as a single string separated by ` | `
let authKeys = process.env.GOOGLE_API_KEY.split(' | ')
let gapi = new googleapis.youtube_v3.Youtube({
  auth: authKeys.shift() // Pop and take the first element in an array, when exhausted shift to next, and so on
})
let params = {
  part: ['snippet'],
  maxResults: 50,
  order: 'date',
  type: ['video'],
  q: process.env.YT_SEARCH_QUERY
}

export default {
  refreshData: () => {
    console.log('Refreshing videos data!')

    if (process.env.NEW_GOOGLE_API_KEY !== undefined) {
      gapi = new googleapis.youtube_v3.Youtube({
        auth: process.env.NEW_GOOGLE_API_KEY // Pop and take the first element in an array, when exhausted shift to next, and so on
      })
    }
    
    gapi.search.list(params).then(response => {
      const results = resultParser.parseApiResponse(JSON.parse(JSON.stringify(response.data)))
      // Dump data retrieved from Google API to MongoDB
      ItemModel.insertMany(results, { ordered: false }).then(_response => {
        console.log('Refreshed successfully!')
      }).catch(err => {
        console.log(`Failed to refresh! Retrying in ${process.env.GOOGLE_API_REFRESH_INTERVAL}s. Error:\n${err}`)
      })
    }).catch(err => {
      if (err.message === constants.QUOTA_EXCEEDED_ERROR_MSG && authKeys.length) {
        process.env.NEW_GOOGLE_API_KEY = authKeys.shift()
        console.log(`Quota exceeded for current API key. Updating to new API key: ${process.env.NEW_GOOGLE_API_KEY}`)
      }
    })
  }
}
