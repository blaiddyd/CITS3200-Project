const { env } = process

const config = {
  storage: {
    projectId: env.STORAGE_PROJECT_ID,
    bucket: env.STORAGE_BUCKET,
    url: `https://storage.googleapis.com/${env.STORAGE_BUCKET}/`
  },
  database: {
    connectionString: env.DATABASE_CONNECTION_STRING
  },
  port: env.port || 5000,
  dev: env.NODE_ENV !== 'production'
}

module.exports = config
