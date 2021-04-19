import React from 'react';
import PropTypes from 'prop-types';
import './NamePlate.css';

function NamePlate({
  avatar,
  name,
  title,
  titleTop,
  town,
  server,
  datacenter,
  freeCompany
}) {
  return (
    <div className='name-plate'>
      <div className='avatar'>
        <img src={avatar} alt='Avatar' />
      </div>

      <div className='name-body'>
        { titleTop && title && <h2 className='title'>{title}</h2> }
        <h1>{name}</h1>
        { !titleTop && title && <h2 className='title'>{title}</h2> }
        { freeCompany && (
          <div className='freeCompany'>&lt;{freeCompany}&gt;</div>
        )}
        <div className='address'>{town}, {server}, {datacenter}</div>
      </div>
    </div>
  );
}

NamePlate.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  titleTop: PropTypes.bool,
  town: PropTypes.string.isRequired,
  server: PropTypes.string.isRequired,
  datacenter: PropTypes.string.isRequired,
  freeCompany: PropTypes.string
};

NamePlate.defaultProps = {
  title: undefined,
  titleTop: undefined,
  freeCompany: undefined
};

export default NamePlate;
