import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import PageHeader from '../../../components/PageHeader'
import useAxios from 'axios-hooks'

const Confirmation = () => {
  const router = useRouter()
  const [{ data: modules, loading }] = useAxios(`/api/modules`)
  const { slug, taskId } = router.query

  const data = modules && modules.find(m => m.slug === slug)
  const title = `Task #${taskId}`
  const subtitle = data.name
  const progressUrl = `/${data.slug}/${taskId}/progress`

  if (loading) return <i className="fas fa-circle-notch fa-spin" />

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="container py-3">
        <span className="fa-stack">
          <i className="fas fa-square-full fa-stack-2x"></i>
          <i className="fas fa-check fa-stack-1x fa-inverse"></i>
        </span>
        <h5 className="mt-2">Task submitted</h5>
        <p>Your files have been uploaded and is now being processed.</p>
        <Link href={progressUrl}>
          <button className="mt-3 btn btn-outline-dark rounded-0">
            View progress
            <i className="fas fa-arrow-right ml-3" />
          </button>
        </Link>
      </div>
    </>
  )
}

export default Confirmation
