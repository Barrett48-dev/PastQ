// Controlled input that optionally renders an icon and password visibility control.
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const InputField = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, name }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
    <div className="w-full space-y-2 text-left">
    {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
        {label}
        </label>
    )}
    <div className="relative flex items-center">
        {Icon && (
        <div className="absolute left-4 text-[#71717A]">
            <Icon size={18} />
        </div>
        )}
        <input
        type={isPassword && showPassword ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#1A1B20] border border-[#26272E] text-white placeholder-[#71717A] text-sm rounded-xl py-3.5 ${
            Icon ? 'pl-11' : 'pl-4'
        } ${isPassword ? 'pr-11' : 'pr-4'} focus:outline-none focus:border-[#2F66F6] transition-colors`}
        />
        {isPassword && (
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-[#71717A] hover:text-white transition-colors"
        >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        )}
    </div>
    </div>
);
};