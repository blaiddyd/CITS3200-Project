import React from 'react'
import Head from 'next/head'
import Download from '../components/Download'

const Task = () => {
  return (
    <div>
      <Head>
        <title>Task Details</title>
        <link href="../static/css/task-page.css" />
      </Head>
      <Download />
    </div>
  )
}

export default Task