import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import './AdvancedFilterToggle.css';

export default function AdvancedFilterToggle({ open, onClick, children }) {
  return (
    <button 
      className="advanced-filter-toggle"
      onClick={onClick}
      type="button"
    >
      <Filter size={20} />
      <span>{children || 'Filtros Avanzados'}</span>
      <ChevronDown 
        size={20} 
        style={{ 
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}
      />
    </button>
  );
}
