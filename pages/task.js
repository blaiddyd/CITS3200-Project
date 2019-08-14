import React from 'react'
import Head from 'next/head'
import ProgessBar from '../components/ProgressBar'

const Task = () => {
  return (
    <div>
      <Head>
        <title>Task Details</title>
        <link href="../static/css/task-page.css" />
      </Head>
      <ProgessBar />
    </div>
  )
}

export default Task