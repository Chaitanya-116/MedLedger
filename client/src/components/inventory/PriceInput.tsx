import React, { useState } from 'react';
import { TextField } from '@mui/material';

/**
 * Shared core for the numeric-field family. Avoids the leading-zero trap of
 * controlled number inputs: focusing a defaulted field clears it locally,
 * keystrokes flow naturally through a local draft, and an emptied field reads
 * back as its committed default on blur. Raw text never reaches formData —
 * every change commits a parsed number, so validation and live calculations
 * are unaffected.
 */
interface DraftNumberFieldProps {
  label: string;
  /** Committed numeric value held in formData */
  value: number;
  /** Fired on every keystroke with the parsed number */
  onChange: (value: number) => void;
  /** Value that triggers auto-clear when the field gains focus */
  clearWhen: number;
  /** Raw keystroke string → display string (e.g. strip leading zeros) */
  format: (raw: string) => string;
  /** Display string → committed number ('' / invalid → field default) */
  parse: (display: string) => number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  sx?: object;
  required?: boolean;
  fullWidth?: boolean;
}

const DraftNumberField: React.FC<DraftNumberFieldProps> = ({
  label,
  value,
  onChange,
  clearWhen,
  format,
  parse,
  inputProps,
  sx,
  required = true,
  fullWidth = true,
}) => {
  // Display string while focused; null = render the committed value
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <TextField
      label={label}
      type="number"
      required={required}
      fullWidth={fullWidth}
      size="small"
      sx={sx}
      inputProps={inputProps}
      value={draft ?? String(value)}
      onFocus={() => {
        if (value === clearWhen) setDraft('');
      }}
      onChange={(e) => {
        const display = format(e.target.value);
        setDraft(display);
        onChange(parse(display));
      }}
      onBlur={() => setDraft(null)}
    />
  );
};

interface PriceInputProps {
  label: string;
  /** Committed numeric value held in formData */
  value: number;
  /** Fired on every keystroke with the parsed number ('' / invalid → 0) */
  onChange: (value: number) => void;
  sx?: object;
}

/**
 * ₹ price field (decimals allowed). Focusing a zeroed field clears it;
 * typing flows naturally (7 → 75 → 750); blur on empty reads back as "0".
 */
export const PriceInput: React.FC<PriceInputProps> = ({ label, value, onChange, sx }) => (
  <DraftNumberField
    label={label}
    value={value}
    onChange={onChange}
    sx={sx}
    clearWhen={0}
    inputProps={{ step: '0.50', min: 0 }}
    format={(raw) => raw}
    parse={(raw) => {
      const parsed = parseFloat(raw);
      return Number.isNaN(parsed) ? 0 : parsed;
    }}
  />
);

interface QuantityInputProps {
  label: string;
  /** Committed numeric value held in formData */
  value: number;
  /** Fired on every keystroke with the parsed number */
  onChange: (value: number) => void;
  /**
   * Placeholder/default value: cleared on focus when matched, so typing
   * never prepends it (e.g. stock 0, min-stock alert 1, adjust qty 10).
   */
  fallback: number;
  /** Floor for typed values; an emptied field commits this (default: fallback) */
  floor?: number;
  /** Native spinner minimum, when the previous field declared one */
  min?: number;
  sx?: object;
  required?: boolean;
  fullWidth?: boolean;
}

// Digits only, no leading zeros — whether typed or pasted ("0075" → "75")
const sanitizeInt = (raw: string): string =>
  raw.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');

/**
 * Whole-number quantity field (positive integers only — no sign, no
 * decimals, no leading zeros). Same focus-clear/blur-default contract as
 * PriceInput, tuned per field via `fallback`/`floor`.
 */
export const QuantityInput: React.FC<QuantityInputProps> = ({
  label,
  value,
  onChange,
  fallback,
  floor = fallback,
  min,
  sx,
  required = true,
  fullWidth = true,
}) => (
  <DraftNumberField
    label={label}
    value={value}
    onChange={onChange}
    sx={sx}
    required={required}
    fullWidth={fullWidth}
    clearWhen={fallback}
    inputProps={min !== undefined ? { min } : undefined}
    format={sanitizeInt}
    parse={(display) => {
      const parsed = parseInt(display, 10);
      return Number.isNaN(parsed) ? floor : Math.max(floor, parsed);
    }}
  />
);
