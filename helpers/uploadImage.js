import axios from 'axios'

export default async (projectId, file) => {
  const url = `/projects/${projectId}`

  const payload = new FormData()
  payload.append('image', file)

  const response = await axios.post(url, payload)

  const { data } = response
  return data
}
