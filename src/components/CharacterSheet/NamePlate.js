import React from 'react';
import PropTypes from 'prop-types';
import './NamePlate.css';

function NamePlate({
  avatar,
  name,
  title,
  titleTop,
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
        { title && <h2 className='title'>{title}</h2> }
        { freeCompany && <h3 className='freeCompany'>&lt;{freeCompany}&gt;</h3> }
      </div>
    </div>
  );
}

NamePlate.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  titleTop: PropTypes.bool,
  freeCompany: PropTypes.string
};

NamePlate.defaultProps = {
  title: undefined,
  titleTop: undefined,
  freeCompany: undefined
};

export default NamePlate;
