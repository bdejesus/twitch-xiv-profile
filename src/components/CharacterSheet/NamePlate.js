import React from 'react';
import PropTypes from 'prop-types';

function NamePlate({
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
      { titleTop && title && <h3 className='title'>{title}</h3> }
      <h1>{name}</h1>
      { !titleTop && title && <h3 className='title'>{title}</h3> }
      { freeCompany && (
        <div className='freeCompany'>&lt;{freeCompany}&gt;</div>
      )}
      <div className='address'>{town}, {server}, {datacenter}</div>
    </div>
  );
}

NamePlate.propTypes = {
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
