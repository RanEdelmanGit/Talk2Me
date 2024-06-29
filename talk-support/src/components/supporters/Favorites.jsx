import React from 'react';
import SupporterCard from './SupporterCard'; // Ensure the path is correct based on your project structure

const Favorites = () => {
  // Dummy data for demo favorites
  const demoFavorites = [
    {
      id: 1,
      name: 'John Doe',
      location: 'Tel Aviv',
      meeting: 'Virtual',
      education: 'Bachelor\'s Degree',
      school: 'University of Tel Aviv',
      profilePic: '/path/to/profile1.jpg', // Replace with actual path
    },
    {
      id: 2,
      name: 'Jane Smith',
      location: 'Jerusalem',
      meeting: 'In-person',
      education: 'Master\'s Degree',
      school: 'Hebrew University',
      profilePic: '/path/to/profile2.jpg', // Replace with actual path
    },
    {
      id: 3,
      name: 'David Cohen',
      location: 'Haifa',
      meeting: 'Virtual',
      education: 'PhD',
      school: 'Technion - Israel Institute of Technology',
      profilePic: '/path/to/profile3.jpg', // Replace with actual path
    },
    {
      id: 4,
      name: 'Rachel Levy',
      location: 'Beersheba',
      meeting: 'In-person',
      education: 'Bachelor\'s Degree',
      school: 'Ben-Gurion University',
      profilePic: '/path/to/profile4.jpg', // Replace with actual path
    },
    {
      id: 5,
      name: 'Daniel Avraham',
      location: 'Netanya',
      meeting: 'Virtual',
      education: 'Bachelor\'s Degree',
      school: 'Netanya Academic College',
      profilePic: '/path/to/profile5.jpg', // Replace with actual path
    },
  ];

  return (
    <div className="h-full flex flex-col flex-wrap justify-start mx-auto">
      {demoFavorites.map((supporter) => (
        <SupporterCard
          key={supporter.id}
          supporterId={supporter.id}
          name={supporter.name}
          location={supporter.location}
          meeting={supporter.meeting}
          education={supporter.education}
          school={supporter.school}
          profilePic={supporter.profilePic}
          isFavorite={true} // Assuming all are favorites in demo
        />
      ))}
    </div>
  );
};

export default Favorites;
