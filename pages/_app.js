import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * Custom App definition
 * @see https://nextjs.org/docs#custom-app
 */
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <title>AI Services Portal</title>
        </Head>
        <div>
          <Navbar />
          <Component {...pageProps} />
        </div>
      </Container>
    )
  }
}

export default MyApp
