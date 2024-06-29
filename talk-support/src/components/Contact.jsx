import React from 'react';

const Contact = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center ">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">צור קשר</h2>
        <div className="mb-4">
          <label className="block text-gray-700">אימייל</label>
          <a href="mailto:contact@tenlee.com" className="text-blue-500">
            contact@tenlee.com
          </a>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">מספר טלפון</label>
          <a href="tel:+1234567890" className="text-blue-500">
            +1234567890
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
