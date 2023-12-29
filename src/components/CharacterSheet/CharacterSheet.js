import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NamePlate from './NamePlate';
import GearSlot from './GearSlot';
import Tooltip from './Tooltip';
import './CharacterSheet.css';

function CharacterSheet({ Character }) {
  const [activeItem, setActiveItem] = useState();
  const {
    profile,
    details,
    activeClassJob,
    gearSlots
  } = Character;

  const gearSlotKeys = [
    'mainhand',
    'offhand',
    'head',
    'earrings',
    'body',
    'necklace',
    'hands',
    'bracelets',
    'legs',
    'ring1',
    'feet',
    'ring2'
  ];

  function handleActivate(e) {
    setActiveItem(e);
  }

  return (
    <div className='character-sheet'>
      <NamePlate
        avatar={profile.image}
        name={profile.name}
        title={profile.title}
        titleTop={profile.titleTop}
        freeCompany={details.freeCompany}
      />

      <hr />

      <div className='activeClassJob'>
        <img src={activeClassJob.icon} alt='' />
        Level {activeClassJob.level}
      </div>

      <div className='equipment'>
        <div className='portrait'>
          <img
            src={gearSlots.image}
            alt='Portrait'
            className='portrait-img'
          />

          { activeItem && (
            <Tooltip activeItem={activeItem} />
          )}
        </div>

        {gearSlotKeys.map((slot) => (
          <GearSlot
            key={slot}
            Gear={gearSlots[slot]}
            onActive={handleActivate}
          />
        ))}
      </div>
    </div>
  );
}

CharacterSheet.propTypes = {
  Character: PropTypes.shape({
    profile: {
      image: PropTypes.string,
      name: PropTypes.string,
      title: PropTypes.string,
      world: PropTypes.string
    },
    details: {
      race: PropTypes.string,
      clan: PropTypes.string,
      gender: PropTypes.string,
      nameday: PropTypes.string,
      guardian: PropTypes.string,
      cityState: PropTypes.string,
      grandCompanyName: PropTypes.string,
      grandCompanyRank: PropTypes.string,
      freeCompany: PropTypes.string
    },
    activeClassJob: {
      level: PropTypes.number,
      icon: PropTypes.string,
      textImage: PropTypes.string
    },
    gearSlots: PropTypes.shape()
  }).isRequired
};

export default CharacterSheet;
