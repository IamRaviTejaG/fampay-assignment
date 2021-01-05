import Redis from 'ioredis'
import Sentry from '../utils/sentry'

const redisClient = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST, { enableAutoPipelining: true })

redisClient.on('connect', () => {
  console.log('Redis connection established successfully.')
})

redisClient.on('error', error => {
  console.log(`Redis connection couldn't be established. ${JSON.stringify(error)}`)
  Sentry.captureException(error)
})

export default redisClient
