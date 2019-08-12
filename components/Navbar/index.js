import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <Link href="/">
        <span className="navbar-brand">AI Services Portal</span>
      </Link>
    </nav>
  )
}

export default Navbar
