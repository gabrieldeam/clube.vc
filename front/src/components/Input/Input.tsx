import React, { forwardRef } from 'react';
import { InputProps } from '@/types/components/InputProps';
import styles from './Input.module.css';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className={styles.inputContainer}>
        {label && <label className={styles.label}>{label}</label>}
        <input ref={ref} className={styles.input} {...props} />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;