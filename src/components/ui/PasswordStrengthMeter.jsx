import { Check, X } from 'lucide-react';

export default function PasswordStrengthMeter({ password }) {
  // Strength calculation logic
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '', color: 'bg-border' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score === 0) return { score: 0, text: 'Very Weak', color: 'bg-danger' };
    if (score === 1) return { score: 1, text: 'Weak', color: 'bg-danger' };
    if (score === 2) return { score: 2, text: 'Fair', color: 'bg-warning' };
    if (score === 3) return { score: 3, text: 'Good', color: 'bg-success' };
    return { score: 4, text: 'Strong', color: 'bg-primary' };
  };

  const strength = getStrength(password);

  const criteria = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) }
  ];

  if (!password) return null;

  return (
    <div className="mt-3">
      {/* Visual Bar */}
      <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-border">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-full w-1/4 transition-colors duration-300 ${
              index <= strength.score ? strength.color : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      
      {/* Text Label */}
      <div className="mt-2 text-[11.5px] font-medium text-muted">
        Password strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.text}</span>
      </div>

      {/* Criteria List */}
      <ul className="mt-2 grid grid-cols-2 gap-y-1">
        {criteria.map((c) => (
          <li key={c.label} className={`flex items-center gap-1.5 text-[11px] ${c.met ? 'text-success' : 'text-subtle'}`}>
            {c.met ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
