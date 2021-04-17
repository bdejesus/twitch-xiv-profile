import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NamePlate from './NamePlate';
import GearSlot from './GearSlot';
import './CharacterSheet.css';

function CharacterSheet({ Character }) {
  const [activeItem, setActiveItem] = useState();
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

  function handleActivate(e) {
    setActiveItem(e);
  }

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
            className='portrait-img'
          />

          { activeItem && (
            <div className='item-tooltip'>
              {console.log(activeItem)}

              <div className='equipped-item'>
                <div className='icon'>
                  <img src={`https://xivapi.com/${activeItem.Item.Icon}`} />
                </div>
                <div className='item-desc'>
                  <h3>{activeItem.Item.Name}</h3>
                </div>
              </div>

              { activeItem.Mirage && (
                <div className='glamour-item'>
                  <div className='icon'>
                    <img src={`https://xivapi.com/${activeItem.Mirage.Icon}`} />
                  </div>
                  <div className='item-desc'>
                    <h4>Glamour</h4>
                    <div className='glamour-name'>{activeItem.Mirage.Name}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {gearSlots.map((slot) => (
          <GearSlot
            key={slot}
            Gear={GearSet.Gear[slot]}
            onActive={handleActivate}
          />
        ))}
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
