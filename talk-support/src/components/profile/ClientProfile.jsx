import React from 'react'
import SignOut from '../auth/SignOut'
import { Link } from 'react-router-dom'

export default function ClientProfile() {
  return (
    <div>
    <div>ClientProfile</div>
      <div className="flex p-2 bg-red-500"><SignOut/></div>
      <Link to="/supporters">
        <p className="text-blue-500">supporters</p>
      </Link>
      <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
      {/* list of favorites */}
    </div>
  )
}

