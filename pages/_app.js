import React from 'react'
import App, { Container } from 'next/app'
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
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
