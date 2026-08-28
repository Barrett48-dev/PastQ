// Reusable selectable pill used for goals, specialties, and summary metadata.
import React from 'react';
import { Check } from 'lucide-react';

export const ChipTag = ({ label, selected, onClick, variant = 'gold' }) => {
    // The variant changes only the active accent; selection controls whether the checkmark is shown.
    const activeBorder = variant === 'gold' ? 'border-[#D97706] bg-[#141519]' : 'border-[#2F66F6] bg-[#141519]';
    const activeIcon = variant === 'gold' ? 'bg-[#D97706]' : 'bg-[#2F66F6]';

    // Render a button rather than a passive pill so keyboard and pointer users share the same action.
    return (
    <button
            type="button"
            onClick={onClick}
    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 border ${
        selected
        ? `${activeBorder} text-white`
        : 'bg-[#141519] border-[#26272E] text-[#A1A1AA] hover:text-white hover:border-[#3F404A]'
    }`}
    >
    {selected && (
        <span className={`w-4 h-4 rounded-full ${activeIcon} flex items-center justify-center text-white text-[10px]`}>
                    <Check size={10} className="stroke-[3]" />
        </span>
    )}
    <span>{label}</span>
    </button>
    );
};