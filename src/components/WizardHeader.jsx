// Onboarding heading that pairs step context with a progress indicator.
import React from 'react';

export const WizardHeader = ({ tagText, title, subtitle, totalSteps = 3, currentStep = 1 }) => {
// Progress segments are generated from the configured total so the header works for differently sized wizards.
return (
    <div className="w-full space-y-3 text-left">
    <div className="flex items-center justify-between">
        {tagText && (
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#A1A1AA]">
            {tagText}
        </span>
        )}
        <div className="flex space-x-1.5 ml-auto">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                ? 'w-6 bg-[#2F66F6]'
                : 'w-2 bg-[#26272E]'
            }`}
            />
        ))}
        </div>
    </div>

    <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
    {subtitle && <p className="text-sm text-[#A1A1AA] leading-relaxed">{subtitle}</p>}
    </div>
);
};