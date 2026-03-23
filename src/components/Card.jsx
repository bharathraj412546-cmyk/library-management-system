import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, trend, color }) => {
  return (
    <div className="card fade-in" style={{ borderColor: color }}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: `${color}20`, color: color }}>
          {icon}
        </div>
        <div className="card-trend" style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)' }}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      </div>
      <div className="card-body">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default Card;
