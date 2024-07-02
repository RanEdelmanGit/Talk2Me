import React from 'react'

export default function Chats({contact}) {
  return (
    <div
    
    className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md"
  >
    <div className={`w-12 h-12 bg-gray-300 rounded-full mr-3`}>
      <img
        src={`https://placehold.co/200x/${contact.color}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`}
        alt="User Avatar"
        className="w-12 h-12 rounded-full"
      />
    </div>
    <div className="flex-1">
      <h2 className="text-lg font-semibold">{contact.name}</h2>
      <p className="text-gray-600">{contact.message}</p>
    </div>
  </div>
  )
}
