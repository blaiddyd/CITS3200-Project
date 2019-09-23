import useModules from './useModules'

const useModule = slug => {
  const [modules, loading] = useModules()
  const data = modules && modules.find(m => m.slug === slug)
  return [data, loading]
}

export default useModule
