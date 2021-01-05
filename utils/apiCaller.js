import resultParser from './resultParser'
import dbConnection from '../config/database'
import itemSchema from '../schema/itemSchema'
const googleapis = require('googleapis')

const ItemModel = dbConnection.model('item', itemSchema)
const gapi = new googleapis.youtube_v3.Youtube({
  auth: process.env.GOOGLE_API_KEY
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
      ItemModel.insertMany(results, { ordered: false }).then(_response => {
        console.log('Refreshed successfully!')
      }).catch(err => {
        console.log(`Failed to refresh! Retrying in ${process.env.GOOGLE_API_REFRESH_INTERVAL}s. Error:\n${err}`)
      })
    }).catch(err => {
      console.log(err)
    })
  }
}
