// Theme option card with a small visual preview of the selected appearance.
import React from 'react';
// Selectable visual/theme card used by onboarding.
// Modify its presentation here; the parent owns the selected value and persistence.
import React from 'react';
import { Sun, Moon, Check } from 'lucide-react';

export const ThemeCard = ({ type = 'dark', selected, onClick }) => {
// Convert the public theme label into the boolean used by the preview's conditional styles.
const isDark = type === 'dark';

// The card is a visual selector; its preview mirrors the selected theme without changing global state itself.
return (
    <div
    onClick={onClick}
    className={`flex-1 p-4 rounded-2xl border cursor-pointer transition-all ${
        selected
        ? 'bg-[#141519] border-[#2F66F6] ring-1 ring-[#2F66F6]'
        : 'bg-[#141519] border-[#26272E] hover:border-[#3F404A]'
    }`}
    >
      {/* Mock UI Preview Box */}
    <div
        className={`w-full h-24 rounded-xl p-3 mb-4 flex flex-col justify-between border ${
        isDark ? 'bg-[#0B0C0E] border-[#26272E]' : 'bg-[#F4F4F5] border-[#E4E4E7]'
        }`}
    >
        <div className="flex items-center justify-between">
        <div className={`h-1.5 w-8 rounded-full ${isDark ? 'bg-[#26272E]' : 'bg-[#E4E4E7]'}`} />
        <div className="flex space-x-1">
            <div className={`h-1 w-1 rounded-full ${isDark ? 'bg-[#3F404A]' : 'bg-[#D4D4D8]'}`} />
            <div className={`h-1 w-1 rounded-full ${isDark ? 'bg-[#3F404A]' : 'bg-[#D4D4D8]'}`} />
        </div>
        </div>
        <div className="space-y-1.5">
        <div className={`h-2 w-3/4 rounded-full ${isDark ? 'bg-[#2F66F6]' : 'bg-[#2F66F6]'}`} />
        <div className={`h-1.5 w-1/2 rounded-full ${isDark ? 'bg-[#26272E]' : 'bg-[#E4E4E7]'}`} />
        </div>
        <div className={`h-3 w-full rounded-md ${isDark ? 'bg-[#141519]' : 'bg-[#FFFFFF]'}`} />
    </div>

    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white font-medium text-sm">
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
        <span>{isDark ? 'Dark' : 'Light'}</span>
        </div>
        <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
            selected ? 'bg-[#2F66F6] border-[#2F66F6]' : 'border-[#3F404A]'
        }`}
        >
        {selected && <Check size={12} className="text-white stroke-[3]" />}
        </div>
    </div>
    </div>
);
};