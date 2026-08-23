// Clickable selection row shared by department and subject choices.
import React from 'react';
import { Check } from 'lucide-react';

export const SelectionCard = ({ title, subtitle, icon: Icon, selected, onClick, type = 'radio' }) => {
    // `type` remains part of the public API for future checkbox/radio variations.
return (
    <div
    onClick={onClick}
    className={`w-full p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between border ${
        selected
        ? 'bg-[#141519] border-[#2F66F6] ring-1 ring-[#2F66F6]'
        : 'bg-[#141519] border-[#26272E] hover:border-[#3F404A]'
    }`}
    >
    <div className="flex items-center space-x-4">
        {Icon && (
        <div className="p-3 bg-[#1A1B20] border border-[#26272E] rounded-xl text-white">
            <Icon size={20} />
        </div>
        )}
        <div>
        <h4 className="text-white font-semibold text-base">{title}</h4>
        {subtitle && <p className="text-xs text-[#A1A1AA] mt-0.5">{subtitle}</p>}
        </div>
    </div>

    <div
        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
        selected
            ? 'bg-[#2F66F6] border-[#2F66F6]'
            : 'border-[#3F404A] bg-transparent'
        }`}
    >
        {selected && <Check size={14} className="text-white stroke-[3]" />}
    </div>
    </div>
);
};