import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, trend, color }) => {
  const isPositive = trend > 0;

  return (
    <div className="card fade-in">
      <div className="card-header">
        <div className="card-icon-container" style={{ backgroundColor: `${color}10`, color: color }}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className={`card-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <div className="card-body">
        <span className="card-subtitle">{title}</span>
        <h3 className="card-title">{value}</h3>
      </div>
    </div>
  );
};

export default Card;
