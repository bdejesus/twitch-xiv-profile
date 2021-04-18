import React from 'react';
import PropTypes from 'prop-types';
import './ProfilePreview.css';

function ProfilePreview({ avatar, name, classJob }) {
  return (
    <div className='profile-preview'>
      <div className='profile-avatar'>
        <img src={avatar} alt={name} />
      </div>
      <div className='profile-body'>
        <h3>{name}</h3>
        <div>
          Level {classJob.Level} {classJob.UnlockedState.Name}
        </div>
      </div>
    </div>
  );
}

ProfilePreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  classJob: PropTypes.shape({
    Level: PropTypes.number,
    UnlockedState: PropTypes.shape({
      Name: PropTypes.string
    })
  }).isRequired
};

export default ProfilePreview;
