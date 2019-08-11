import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

/**
 * Custom Document definition
 * @see https://nextjs.org/docs#custom-document
 */
export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* Font Awesome Icons */}
          <link
            href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
