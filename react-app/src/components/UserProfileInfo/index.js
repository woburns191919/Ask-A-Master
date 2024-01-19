

import React from 'react';
import defaultProfile from '../../images/default-profile.png';

const UserProfileInfo = ({ user, userProfileImage }) => {
  return (
    <div className="user-profile-container">
      <img src={userProfileImage || defaultProfile} className="user-profile-image" alt="Profile" />
      <div className="user-credentials">
        <div className="user-name">{user?.first_name} {user?.last_name}</div>
        {user && <div className="elo-rating">
          {/* {console.log('user from search', user)} */}
          ELO Rating <span>{user?.elo_rating}</span>
        </div>}

      </div>
    </div>
  );
};

export default UserProfileInfo;
