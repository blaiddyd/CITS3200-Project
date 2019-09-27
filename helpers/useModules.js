import useAxios from 'axios-hooks'

const useModules = () => {
  const [{ data, loading }] = useAxios(`/api/modules`)
  return [data, loading]
}

export default useModules
