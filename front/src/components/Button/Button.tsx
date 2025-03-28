import React, { forwardRef } from "react";
import { ButtonProps } from "@/types/components/ButtonProps";
import styles from "./Button.module.css";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ text, ...props }, ref) => {
      return (
        <button ref={ref} className={styles.button} {...props}>
          {text}
        </button>
      );
    }
  );
  
  Button.displayName = "Button";
  export default Button;
