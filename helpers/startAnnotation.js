import axios from 'axios'

export default async projectId => {
  const url = `/api/projects/annotate/${projectId}`

  const response = await axios.get(url)

  const { data } = response
  return data
}
