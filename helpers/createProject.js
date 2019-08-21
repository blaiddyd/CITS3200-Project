import axios from 'axios'

export default async apiKey => {
  // create project axios
  const payload = {
    title: 'Ecological Image Classification',
    apiKey
  }
  const response = await axios.post('/projects', payload)

  const { data } = response
  return data
}
