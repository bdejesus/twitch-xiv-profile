import React from 'react';
import PropTypes from 'prop-types';

function GearSlot({ Gear }) {
  if (!Gear) return <div />;

  const { Name, Icon } = Gear.Item;
  return (
    <div>
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
  })
};

GearSlot.defaultProps = {
  Gear: undefined
};

export default GearSlot;
