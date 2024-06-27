import React from 'react'
import SignOut from '../auth/SignOut'
import { Link } from 'react-router-dom'

export default function SupporterProfile() {
  return (
    <div>
    <div>SupporterProfile</div>
    <div className="flex p-2 bg-red-500"><SignOut/></div>
    {/*clientList */}
    <Link to="/chat">
        <p className="text-blue-500">chat</p>
      </Link>
    </div>
  )
}
