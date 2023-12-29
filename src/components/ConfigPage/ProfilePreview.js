import React from 'react';
import PropTypes from 'prop-types';
import './ProfilePreview.css';

function ProfilePreview({
  avatar, name, classJobIcon, classJobText, theme, level
}) {
  return (
    <div className={`profile-preview App ${theme}`}>
      <div className='profile-avatar'>
        <img src={avatar} alt={name} />
      </div>
      <div className='profile-body'>
        <h3>{name}</h3>
        <div className='profile-classjob'>
          <img className='profile-classjob-icon' src={classJobIcon} alt='' />
          <img className='profile-classjob-text' src={classJobText} alt='' />
        </div>
        <div classNam='profile-level'>
          Level {level}
        </div>
      </div>
    </div>
  );
}

ProfilePreview.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  classJobIcon: PropTypes.string.isRequired,
  classJobText: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired
};

ProfilePreview.defaultProps = {
  classJob: undefined
};

export default ProfilePreview;
