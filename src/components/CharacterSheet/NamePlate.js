function NamePlate({
  name, title, town, server, datacenter, freeCompany
}) {
  return (
    <div className='header'>
      <h2>{name}</h2>
      {/* <h3>{title}</h3> */}
      { freeCompany && <div><b>&lt;{freeCompany}&gt;</b></div> }
      <div className='address'>{town}, {server}, {datacenter}</div>
    </div>
  );
}

export default NamePlate;
