import React from 'react';
import PropTypes from 'prop-types';
import './SystemMessage.css';

function SystemMessage({ message }) {
  return (
    <div className='message' data-type={message.type}>
      {message.message}
    </div>
  );
}

SystemMessage.propTypes = {
  message: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string
  }).isRequired
};

export default SystemMessage;
