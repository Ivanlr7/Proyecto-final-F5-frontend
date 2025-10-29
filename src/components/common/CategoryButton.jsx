import React from 'react';
import './CategoryButton.css';

function CategoryButton({ active, onClick, children }) {
  return (
    <button
      className={`movies-page__category-btn${active ? ' active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default CategoryButton;
