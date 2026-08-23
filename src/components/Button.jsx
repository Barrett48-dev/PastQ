// Shared action button with a small set of semantic visual variants.
import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
    const baseStyles = 'w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 active:scale-[0.99] flex items-center justify-center';

    // Keep the visual vocabulary in one place so forms do not duplicate button styles.
    const variants = {
    primary: 'bg-[#2F66F6] hover:bg-[#1E52E0] text-white shadow-lg shadow-[#2F66F6]/20',
    secondary: 'bg-[#1A1B20] hover:bg-[#26272E] text-white border border-[#26272E]',
    ghost: 'bg-transparent text-[#A1A1AA] hover:text-white',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
    >
            {children}
    </button>
    );
};