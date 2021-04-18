import React from 'react';
import PropTypes from 'prop-types';
import './Tooltip.css';

function Tooltip({ activeItem }) {
  const { Item, Mirage } = activeItem;

  return (
    <div className='item-tooltip'>
      <div className='equipped-item'>
        <div className='icon'>
          <img src={`https://xivapi.com/${Item.Icon}`} alt={`[${Item.Name}]`} />
        </div>
        <div className='item-desc'>
          <h3>{Item.Name}</h3>
        </div>
      </div>

      { Mirage && (
        <div className='glamour-item'>
          <div className='icon'>
            <img
              src={`https://xivapi.com/${Mirage.Icon}`}
              alt={`[${Mirage.Name}]`}
            />
          </div>
          <div className='item-desc'>
            <h4>Glamour</h4>
            <div className='glamour-name'>{Mirage.Name}</div>
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
