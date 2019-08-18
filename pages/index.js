import React from 'react'
import PageHeader from '../components/PageHeader'
import ModuleGrid from '../components/ModuleGrid'

const Index = () => {
  return (
    <div>
      <PageHeader title="Modules" />
      <div className="py-3">
        <ModuleGrid />
      </div>
    </div>
  )
}

export default Index
