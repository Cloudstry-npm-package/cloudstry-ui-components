import React from 'react'

export default function GlocalForm({Children,title,subtitle, ...rest}) {
  return (
     <div>
          <div className="login-container">
        <div className="main-container">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* LOGO */}
            <img src="/images/logo.jpg" className="logo" alt="Cloudstry Logo" />

            {/* TITLE */}
            <h2 className="login-title">Welcome to BadgeConnect Admin Login</h2>
            <p className="login-subtitle">Sign in to continue</p>

            {Children}
          </form>
 
        </div>
      </div>
     </div>
  )
}

