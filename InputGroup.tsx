
import React from 'react';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  className = "" 
   
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-gray-700 font-semibold text-3xl">{label}</label>
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none transition-all shadow-sm"
      />
    </div>
  );
};
