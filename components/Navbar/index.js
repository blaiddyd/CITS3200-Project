import React from 'react'
import Link from 'next/link'

/**
 * The navbar
 */
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container">
        <Link href="/">
          <span className="navbar-brand">AI Services Portal</span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
