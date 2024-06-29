import React from 'react';
import SupporterCard from './SupporterCard';

export default function SupporterList({ supporters }) {
  // Repeat the supporters array 10 times
  const repeatedSupporters = Array.from({ length: 10 }, () => supporters).flat();

  return (
    <div className='h-full flex flex-wrap justify-start mx-auto'>
      {repeatedSupporters.map((supporter, index) => (
        <SupporterCard 
          key={index} 
          supporterId={supporter.id} 
          name={supporter.name}
          email={supporter.email}
          phone={supporter.phone}
          location={supporter.location}
          meeting={supporter.meeting}
          education={supporter.education}
          school={supporter.school}
          profilePic={supporter.profilePic}
        />
      ))}
    </div>
  );
}
