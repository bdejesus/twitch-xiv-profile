function GearSlot({ Gear }) {
  if (!Gear) return <div />;

  const { Item } = Gear;
  return (
    <div>
      <img
        alt={Item.Name}
        title={Item.Name}
        src={`https://xivapi.com/${Item.Icon}`}
      />
    </div>
  );
}

export default GearSlot;
