import React from 'react';
import PropTypes from 'prop-types';
import './Tooltip.css';

function Tooltip({ activeItem }) {
  const { name, image, glamour } = activeItem;

  return (
    <div className='item-tooltip'>
      <div className='equipped-item'>
        <div className='icon'>
          <img src={image} alt={name} />
        </div>
        <div className='item-desc'>
          <h3>{name}</h3>
        </div>
      </div>

      { glamour && (
        <div className='glamour'>
          <h4>Glamour</h4>
          <div className='glamour-item'>
            <div className='icon'>
              <img
                src={glamour.image}
                alt={glamour.name}
              />
            </div>
            <div className='item-desc'>
              <div className='glamour-name'>{glamour.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Tooltip.propTypes = {
  activeItem: PropTypes.shape({
    Item: PropTypes.shape(),
    Mirage: PropTypes.shape()
  }).isRequired
};

export default Tooltip;
