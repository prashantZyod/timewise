import React, { useState, useEffect } from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    // Calculate password strength and check requirements
    const checkRequirements = () => {
      const newRequirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
      };

      setRequirements(newRequirements);

      // Calculate strength (0-4)
      const metRequirements = Object.values(newRequirements).filter(Boolean).length;
      setStrength(metRequirements);
    };

    checkRequirements();
  }, [password]);

  // Get background color based on strength
  const getStrengthColor = () => {
    switch (strength) {
      case 0: return 'bg-slate-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: 
      case 5: return 'bg-green-500';
      default: return 'bg-slate-200';
    }
  };

  // Get strength label
  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: 
      case 5: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Progress bar */}
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getStrengthColor()} transition-all duration-300 ease-in-out`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      
      {/* Strength label */}
      {password && (
        <p className="text-xs text-slate-500">
          Password strength: <span className="font-medium">{getStrengthLabel()}</span>
        </p>
      )}
      
      {/* Requirements list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
        <RequirementItem 
          met={requirements.length} 
          text="At least 8 characters" 
        />
        <RequirementItem 
          met={requirements.uppercase} 
          text="Uppercase letter" 
        />
        <RequirementItem 
          met={requirements.lowercase} 
          text="Lowercase letter" 
        />
        <RequirementItem 
          met={requirements.number} 
          text="Number" 
        />
        <RequirementItem 
          met={requirements.special} 
          text="Special character" 
        />
      </div>
    </div>
  );
};

const RequirementItem = ({ met, text }) => (
  <div className="flex items-center gap-1 text-xs">
    {met ? (
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
    ) : (
      <div className="h-3 w-3 rounded-full bg-slate-200"></div>
    )}
    <span className={met ? "text-slate-700" : "text-slate-500"}>
      {text}
    </span>
  </div>
);

export default PasswordStrengthMeter;