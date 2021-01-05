import Redis from 'ioredis'

const redisClient = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST, { enableAutoPipelining: true })

redisClient.on('connect', () => {
  console.log('Redis connection established successfully.')
})

redisClient.on('error', error => {
  console.log(`Redis connection couldn't be established. ${JSON.stringify(error)}`)
})

export default redisClient
