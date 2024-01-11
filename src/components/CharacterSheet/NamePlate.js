import React from 'react';
import PropTypes from 'prop-types';
import './NamePlate.css';

function NamePlate({
  avatar,
  name,
  title,
  titleTop,
  freeCompany,
  world,
  cityState
}) {
  function formatName(nameString) {
    return nameString.replace('&#39;', '’');
  }

  return (
    <div className='name-plate'>
      <div className='avatar'>
        <img src={avatar} alt='Avatar' />
      </div>

      <div className='name-body'>
        { title && titleTop && <h2 className='title'>{title}</h2> }
        <h1>{formatName(name)}</h1>
        { title && !titleTop && <h2 className='title'>{title}</h2> }
        { freeCompany && <h3 className='freeCompany'>&lt;{freeCompany}&gt;</h3> }
        { cityState && world && (
          <div className='address'>{cityState}, {world}</div>
        )}
      </div>
    </div>
  );
}

NamePlate.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  world: PropTypes.string.isRequired,
  cityState: PropTypes.string.isRequired,
  title: PropTypes.string,
  titleTop: PropTypes.bool,
  freeCompany: PropTypes.string,
};

NamePlate.defaultProps = {
  title: undefined,
  titleTop: undefined,
  freeCompany: undefined
};

export default NamePlate;
