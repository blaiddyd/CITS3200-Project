import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
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
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
