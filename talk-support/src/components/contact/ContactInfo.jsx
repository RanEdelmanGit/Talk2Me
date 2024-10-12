import React from 'react';
import PhoneIcon from '../../assets/svgs/PhoneIcon';
import EmailIcon from '../../assets/svgs/EmailIcon';
import { texts } from '../../constants/texts';

export default function ContactInfo() {
  return (
    <div className="px-8 max-w-2xl mx-auto" dir="rtl">
      <h2 className="text-3xl font-bold mb-6 underline">{texts.Contact.title}</h2>
      <p className="text-gray-600 mb-8 text-lg">{texts.Contact.description}</p>
      <div className="space-y-4">
       
        <div className="flex items-center gap-2">
          <PhoneIcon />
          <div className="text-gray-600">
            <p dir='ltr'>{texts.Contact.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EmailIcon />
          <div className="text-gray-600">
            <p>{texts.Contact.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
