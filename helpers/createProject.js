import axios from 'axios'

export default async apiKey => {
  // create project axios
  const response = await axios.post('/projects', {
    title: 'Ecological Image Classification',
    apiKey
  })

  const { data } = response
  return data
}
