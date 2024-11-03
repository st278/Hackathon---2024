import React from 'react';

function Gauge({ type }) {
  return (
    <div className="gauge">
      <p>{type === 'weather' ? 'Weather Gauge' : 'Goal Gauge'}</p>
    </div>
  );
}

export default Gauge;
