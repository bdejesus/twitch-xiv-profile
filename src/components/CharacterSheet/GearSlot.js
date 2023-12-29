import React from 'react';
import PropTypes from 'prop-types';

import './GearSlot.css';

function GearSlot({ Gear, onActive }) {
  if (!Gear) return <div />;

  const { name, image } = Gear;

  function handleMouseOver() {
    onActive(Gear);
  }

  function handleMouseOut() {
    onActive(undefined);
  }

  return (
    <div
      className='slot-item'
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <img alt={name} src={image} />
    </div>
  );
}

GearSlot.propTypes = {
  Gear: PropTypes.shape({
    Item: PropTypes.shape({
      Name: PropTypes.string,
      Icon: PropTypes.string
    })
  }),
  onActive: PropTypes.func.isRequired
};

GearSlot.defaultProps = {
  Gear: undefined
};

export default GearSlot;
