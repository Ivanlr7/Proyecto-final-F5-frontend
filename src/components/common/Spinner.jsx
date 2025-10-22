import { LoaderCircle } from "lucide-react";
import "./Spinner.css";

export default function Spinner({ size = 40, color = "#3b82f6", className = "" }) {
  return (
    <div className={`spinner ${className}`}>
      <LoaderCircle 
        size={size} 
        color={color} 
        className="spinner__icon"
      />
    </div>
  );
}
