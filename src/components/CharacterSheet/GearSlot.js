import React from 'react';
import PropTypes from 'prop-types';

function GearSlot({ Gear, onActive }) {
  if (!Gear) return <div />;
  const { Name, Icon } = Gear.Item;

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
      <img
        alt={Name}
        title={Name}
        src={`https://xivapi.com/${Icon}`}
      />
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
