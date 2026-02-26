import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  mono?: boolean;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  mono,
  type = 'text',
}) => (
  <div>
    <label
      style={{
        display: 'block',
        fontSize: 11,
        fontWeight: 700,
        color: '#475569',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.07em',
        marginBottom: 8,
      }}
    >
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '10px 14px',
        borderRadius: 11,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        color: '#f1f5f9',
        fontSize: 13,
        fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box' as const,
      }}
      onFocus={(e) => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
    />
  </div>
);

export default FormField;