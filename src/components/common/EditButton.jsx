import React from "react";
import { Edit2 } from "lucide-react";
import "./EditButton.css";

export default function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
  className="edit-btn"
      title="Editar usuario"
    >
  <Edit2 className="edit-btn__icon" />
  <span className="edit-btn__text">Editar</span>
    </button>
  );
}
