export default {
  parseApiResponse: data => {
    const resultObject = []
    data.items.forEach(element => {
      resultObject.push({
        video_id: element.id.videoId,
        title: element.snippet.title,
        description: element.snippet.description,
        thumbnail: element.snippet.thumbnails.high.url,
        channel_id: element.snippet.channelId,
        channel_title: element.snippet.channelTitle,
        publish_time: element.snippet.publishTime
      })
    })

    return resultObject
  }
}
