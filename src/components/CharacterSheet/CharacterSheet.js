import React from 'react';
import NamePlate from './NamePlate';
import GearSlot from './GearSlot';
import './CharacterSheet.css';

function CharacterSheet({ Character }) {
  const {
    Name,
    Title,
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

export default CharacterSheet;
