const { env } = process

const config = {
  storage: {
    projectId: env.STORAGE_PROJECT_ID,
    bucket: env.STORAGE_BUCKET,
    url: `https://storage.googleapis.com/${env.STORAGE_BUCKET}/`
  },
  database: {
    connectionString: `mongodb+srv://${env.DATABASE_USERNAME}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}?retryWrites=true&w=majority`
  },
  port: env.port || 5000,
  dev: env.NODE_ENV !== 'production',
  uploadLimit: 10
}

module.exports = config
