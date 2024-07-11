import React from 'react'

export default function ContactInfo() {
    return (
        <div className="px-8 max-w-2xl mx-auto" dir='rtl'>
          <h2 className="text-3xl font-bold mb-6 underline">צור קשר</h2>
          <p className="text-gray-600 mb-8 text-lg">
            טקסט לדוגמה טקסט לדוגמה טקסט לדוגמה טקסט לדוגמה. טקסט לדוגמה טקסט לדוגמה טקסט לדוגמה טקסט לדוגמה. טקסט לדוגמה טקסט לדוגמה.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25S9.31 9.75 10 9.75 11.25 10.31 11.25 11 10.69 11.25 10 11.25zm7 7.75h-2v-6h2v6zm-1-7.75c-.69 0-1.25-.56-1.25-1.25S14.31 9.75 15 9.75s1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
              </svg>
              <div className="text-gray-600">
                <p>545 אי מאוויס</p>
                <p>שיקגו, IL 99191</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.6 14.2l-3.75-1.68c-.37-.16-.8-.06-1.07.24l-2.1 2.6c-3.06-1.61-5.4-3.96-7.01-7.01l2.6-2.1c.3-.27.39-.7.24-1.07L9.8 4.4c-.22-.5-.72-.8-1.26-.8h-3c-.83 0-1.5.67-1.5 1.5 0 8.56 6.94 15.5 15.5 15.5.83 0 1.5-.67 1.5-1.5v-3c0-.54-.3-1.04-.8-1.26z"/>
              </svg>
              <div className="text-gray-600">
                <p>+1 (555) 234-5678</p>
              </div>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-600 mr-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 4-7 4.5L5 8V6l7 4.5L19 6v2z"/>
              </svg>
              <div className="text-gray-600">
                <p>hello@example.com</p>
              </div>
            </div>
          </div>
        </div>
      );
}
