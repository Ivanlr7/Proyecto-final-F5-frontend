import React from 'react';
import './TabButton.css';

const TabButton = ({ active, onClick, children }) => {
  return (
    <button
      className={`tab-nav__tab${active ? ' tab-nav__tab--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default TabButton;
