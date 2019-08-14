const { env } = process

const config = {
  storage: {
    projectId: 'cits3200-project',
    bucket: 'cits3200-team24-images',
    url: 'https://storage.googleapis.com/cits3200-team24-images/'
  },
  database: {
    connectionString: env.DATABASE_CONNECTION_STRING
  },
  port: env.port || 5000,
  dev: env.NODE_ENV !== 'production'
}

module.exports = config
