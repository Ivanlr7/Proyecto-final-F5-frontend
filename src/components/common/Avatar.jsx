import React from "react";
import userService from "../../api/services/UserService";
import "./Avatar.css";

export default function Avatar({
  image,
  name = "U",
  size = 48,
  editable = false,
  onImageChange,
  className = "",
  style = {},
  ...props
}) {

  let imgSrc = null;
  if (image instanceof File) {
    imgSrc = URL.createObjectURL(image);
  } else if (typeof image === "string" && image) {
    imgSrc = userService.getImageUrl(image);
  }

  return (
    <div
      className={`avatar-component ${className}`}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="avatar-component__img"
          style={{ width: size, height: size }}
          onError={e => {
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div
        className="avatar-component__initials"
        style={{
          display: imgSrc ? 'none' : 'flex',
          width: size,
          height: size,
          fontSize: size * 0.45
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>
      {editable && (
        <label className="avatar-component__edit-label">
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={onImageChange}
          />
          <span className="avatar-component__edit-text">Cambiar imagen</span>
        </label>
      )}
    </div>
  );
}
