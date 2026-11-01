import React from 'react'
import NavDesktop from './nav-middle/nav-desktop';
import Logo from './logo';

export default function NavMiddle() {
  return (
    <div>
      <div className="md:hidden flex">
        <Logo />
      </div>

      <div className="hidden md:flex">
        <NavDesktop />
      </div>
    </div>
  )
}
