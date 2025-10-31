import React from "react";
import { Trash2 } from "lucide-react";
import "./DeleteButton.css";

export default function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
  className="delete-btn"
      title="Eliminar usuario"
    >
  <Trash2 className="delete-btn__icon" />
  <span className="delete-btn__text">Eliminar</span>
    </button>
  );
}
