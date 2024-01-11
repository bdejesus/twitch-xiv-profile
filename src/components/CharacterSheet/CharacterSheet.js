import React, { useState } from 'react';
import NamePlate from './NamePlate';
import GearSlot from './GearSlot';
import Tooltip from './Tooltip';
import './CharacterSheet.css';

function CharacterSheet({ Character }) {
  const [activeItem, setActiveItem] = useState();
  const {
    face,
    portrait,
    name,
    title,
    titleTop,
    world,
    cityState,
    freeCompany,
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
        avatar={face}
        name={name}
        title={title}
        titleTop={titleTop}
        freeCompany={freeCompany}
        world={world}
        cityState={cityState}
      />

      <hr />

      <div className='activeClassJob'>
        <img src={activeClassJob.icon} alt='' />
        Level {activeClassJob.level}
      </div>

      <div className='equipment'>
        <div className='portrait'>
          <img
            src={portrait}
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

export default CharacterSheet;
