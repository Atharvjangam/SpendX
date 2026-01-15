import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, placeholder, label, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="mb-4">
      {label && (
        <label className="text-[13px] text-slate-800 mb-1 block">
          {label}
        </label>
      )}

      <div className="input-box flex items-center gap-2">
        <input
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}            
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />

        {isPassword && (
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-slate-400"
          >
            {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
