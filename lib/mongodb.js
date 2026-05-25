import { MongoClient } from 'mongodb'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'voltmart'

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable in .env.local')
}

/**
 * Global cache to reuse MongoClient across hot-reloads in development
 * and across requests in production (connection pooling).
 */
let cached = global._mongoClientPromise

if (!cached) {
  const client = new MongoClient(MONGO_URL, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  })
  cached = global._mongoClientPromise = client.connect()
}

/**
 * Returns a connected MongoClient (cached/pooled).
 * @returns {Promise<MongoClient>}
 */
export async function getMongoClient() {
  return cached
}

/**
 * Returns the VoltMart database instance.
 * @returns {Promise<import('mongodb').Db>}
 */
export async function getDb() {
  const client = await getMongoClient()
  return client.db(DB_NAME)
}
