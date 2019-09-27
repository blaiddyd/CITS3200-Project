import axios from 'axios'

export default async (projectId, file) => {
  const url = `/api/projects/${projectId}`

  const payload = new FormData()
  payload.append('resource', file)

  const response = await axios.post(url, payload)

  const { data } = response
  return data
}
