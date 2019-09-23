import axios from 'axios'

export default async (projectId, moduleData) => {
  const { slug } = moduleData
  const url = `/api/projects/annotate/${projectId}/${slug}`

  const response = await axios.get(url)

  const { data } = response
  return data
}
