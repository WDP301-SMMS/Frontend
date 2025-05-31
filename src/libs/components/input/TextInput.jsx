import React, { forwardRef } from "react";
import { cn } from "~/libs/utils/cn";

/**
 * TextInput component for form inputs with support for labels, icons, error states, and helper text
 *
 * @typedef {Object} TextInputProps
 * @property {string} [label] - Text label for the input field
 * @property {string} [type="text"] - HTML input type attribute (text, email, password, etc.)
 * @property {string} [className] - Additional CSS classes for the input element
 * @property {string} [error] - Error message to display below the input
 * @property {React.ReactNode} [leftIcon] - Icon component to display on the left side of input
 * @property {React.ReactNode} [rightIcon] - Icon component to display on the right side of input
 * @property {string} [helpText] - Helper text to display below the input (not shown when error is present)
 * @property {boolean} [isDisabled=false] - Whether the input is disabled
 * @property {boolean} [isRequired=false] - Whether the input is required
 * @property {string} [wrapperClassName] - Additional CSS classes for the wrapper div
 * @property {string} [labelClassName] - Additional CSS classes for the label element
 * @property {string} [errorClassName] - Additional CSS classes for the error message
 * @property {string} [helpClassName] - Additional CSS classes for the help text
 * @property {Object} [props] - Any additional props will be passed to the input element
 * @property {React.Ref} ref - Forwarded ref to the input element
 *
 * @param {TextInputProps} props - Component props
 * @returns {React.ReactElement} A form input component with various styling and functional options
 */
const TextInput = forwardRef(
  (
    {
      label,
      type = "text",
      className,
      error,
      leftIcon,
      rightIcon,
      helpText,
      isDisabled = false,
      isRequired = false,
      wrapperClassName,
      labelClassName,
      errorClassName,
      helpClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("w-full space-y-1", wrapperClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className={cn(
              "block text-sm font-medium text-gray-700",
              isDisabled && "opacity-50",
              labelClassName
            )}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={isDisabled}
            required={isRequired}
            className={cn(
              "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500",
              isDisabled && "bg-gray-100 opacity-50 cursor-not-allowed",
              className
            )}
            aria-label={label || "Input field"}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${props.id}-error`}
            className={cn("text-sm text-red-500", errorClassName)}
          >
            {error}
          </p>
        )}

        {helpText && !error && (
          <p className={cn("text-sm text-gray-500", helpClassName)}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
