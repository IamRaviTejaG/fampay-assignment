import constants from '../config/constants'
import dbConnection from '../config/database'
import itemSchema from '../schema/itemSchema'
import resultParser from './resultParser'
const googleapis = require('googleapis')

const ItemModel = dbConnection.model('item', itemSchema)

// For multiple Google API keys, please specify as a single string separated by ` | `
const authKeys = process.env.GOOGLE_API_KEY.split(' | ')
let gapi = new googleapis.youtube_v3.Youtube({
  auth: authKeys.shift() // Pop and take the first element in an array, when exhausted shift to next, and so on
})
const params = {
  part: ['snippet'],
  maxResults: 50,
  order: 'date',
  type: ['video'],
  q: process.env.YT_SEARCH_QUERY
}

export default {
  refreshData: () => {
    console.log('Refreshing videos data!')

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
        const newApiKey = authKeys.shift()
        gapi = new googleapis.youtube_v3.Youtube({
          auth: newApiKey // Replace old API key with the newer one
        })
        console.log(`Quota exceeded for current API key. Updating to new API key: ${newApiKey}`)
      } else {
        console.error(err)
      }
    })
  }
}
