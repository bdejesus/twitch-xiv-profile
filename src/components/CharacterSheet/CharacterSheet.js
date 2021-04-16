import React from 'react';
import PropTypes from 'prop-types';
import NamePlate from './NamePlate';
import GearSlot from './GearSlot';
import './CharacterSheet.css';

function CharacterSheet({ Character }) {
  const {
    Name,
    Title,
    TitleTop,
    Town,
    Server,
    DC,
    FreeCompanyName,
    Bio,
    ActiveClassJob,
    Portrait,
    GearSet
  } = Character;

  const gearSlots = [
    'MainHand',
    'OffHand',
    'Head',
    'Earrings',
    'Body',
    'Necklace',
    'Hands',
    'Bracelets',
    'Legs',
    'Ring1',
    'Feet',
    'Ring2'
  ];

  return (
    <div className='character-sheet'>
      <NamePlate
        name={Name}
        title={Title.Name}
        titleTop={TitleTop}
        town={Town.Name}
        server={Server}
        datacenter={DC}
        freeCompany={FreeCompanyName}
      />

      <div className='activeClassJob'>
        Level {ActiveClassJob.Level} {ActiveClassJob.UnlockedState.Name}
      </div>

      <div className='equipment'>
        <div className='portrait'>
          <img
            src={Portrait}
            alt='Portrait'
          />
        </div>
        {gearSlots.map((slot) => <GearSlot key={slot} Gear={GearSet.Gear[slot]} />)}
      </div>

      { Bio && <div className='bio'>{Bio}</div> }

    </div>
  );
}

CharacterSheet.propTypes = {
  Character: PropTypes.shape({
    Name: PropTypes.string,
    Title: PropTypes.shape(),
    TitleTop: PropTypes.bool,
    Town: PropTypes.shape(),
    Server: PropTypes.string,
    DC: PropTypes.string,
    FreeCompanyName: PropTypes.string,
    Bio: PropTypes.string,
    ActiveClassJob: PropTypes.shape(),
    Portrait: PropTypes.string,
    GearSet: PropTypes.shape()
  }).isRequired
};

export default CharacterSheet;
