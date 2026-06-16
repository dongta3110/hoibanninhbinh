import React from 'react';
import './YearNavigation.css';

const YearNavigation = ({ years, selectedYear, onSelectYear }) => {
  return (
    <nav className="year-nav">
      <ul className="year-list">
        {years.map(year => (
          <li key={year} className="year-item">
            <button 
              className={`year-btn ${selectedYear === year ? 'active' : ''}`}
              onClick={() => onSelectYear(year)}
            >
              {year}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default YearNavigation;
