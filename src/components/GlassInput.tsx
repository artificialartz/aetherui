import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

/**
 * GlassInput component with floating label support
 * Uses backdrop-filter for glassmorphism effect
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, size = 'md', className = '', disabled = false, onFocus, onBlur, onChange, style, id, name, type, placeholder, value, defaultValue, required, readOnly, maxLength, minLength, pattern, min, max, step, inputMode, autoComplete, autoFocus, form, list, accept, multiple, capture, spellCheck, autoCapitalize, enterKeyHint }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Filter out props that are not compatible with motion.input
    const motionProps: Record<string, any> = {};
    if (id) motionProps.id = id;
    if (name) motionProps.name = name;
    if (type) motionProps.type = type;
    if (placeholder) motionProps.placeholder = placeholder;
    if (value !== undefined) motionProps.value = value;
    if (defaultValue !== undefined) motionProps.defaultValue = defaultValue;
    if (required !== undefined) motionProps.required = required;
    if (readOnly !== undefined) motionProps.readOnly = readOnly;
    if (maxLength !== undefined) motionProps.maxLength = maxLength;
    if (minLength !== undefined) motionProps.minLength = minLength;
    if (pattern !== undefined) motionProps.pattern = pattern;
    if (min !== undefined) motionProps.min = min;
    if (max !== undefined) motionProps.max = max;
    if (step !== undefined) motionProps.step = step;
    if (inputMode) motionProps.inputMode = inputMode;
    if (autoComplete !== undefined) motionProps.autoComplete = autoComplete;
    if (autoFocus !== undefined) motionProps.autoFocus = autoFocus;
    if (form) motionProps.form = form;
    if (list) motionProps.list = list;
    if (accept) motionProps.accept = accept;
    if (multiple !== undefined) motionProps.multiple = multiple;
    if (capture) motionProps.capture = capture;
    if (spellCheck !== undefined) motionProps.spellCheck = spellCheck;
    if (autoCapitalize !== undefined) motionProps.autoCapitalize = autoCapitalize;
    if (enterKeyHint) motionProps.enterKeyHint = enterKeyHint;

    return (
      <div className="relative">
        {label && (
          <motion.label
            className={[
              'absolute left-4 text-white/60 pointer-events-none transition-all duration-200',
              isFocused || hasValue ? '-top-2.5 left-3 text-xs bg-black/20 px-1 rounded' : `top-1/2 -translate-y-1/2 ${sizeStyles[size]}`,
            ].join(' ')}
            animate={{ scale: isFocused || hasValue ? 0.85 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        <motion.input
          ref={ref}
          className={[
            'w-full rounded-xl border border-white/10',
            'bg-white/5 backdrop-blur-md',
            'text-white placeholder-white/30',
            'outline-none transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-400/50 focus:ring-red-400/30' : 'focus:ring-white/20',
            label ? 'pt-5' : sizeStyles[size],
            !label && sizeStyles[size],
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={style}
          {...motionProps}
        />
        {error && (
          <motion.p
            className="text-red-400/80 text-sm mt-1"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';
