import React, { forwardRef } from "react";
import { cn } from "~/libs/utils/cn";

/**
 * Reusable Button component with various style variants, sizes, and states
 *
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Content of the button
 * @property {'primary'|'secondary'|'outline'|'ghost'|'danger'} [variant='primary'] - Button style variant
 * @property {'sm'|'md'|'lg'} [size='md'] - Button size
 * @property {'button'|'submit'|'reset'} [type='button'] - HTML button type
 * @property {boolean} [isFullWidth=false] - Whether button takes full width of container
 * @property {boolean} [isDisabled=false] - Whether button is disabled
 * @property {boolean} [isLoading=false] - Whether button is in loading state
 * @property {React.ReactNode} [leftIcon] - Icon to display on the left side
 * @property {React.ReactNode} [rightIcon] - Icon to display on the right side
 * @property {string} [className] - Additional CSS classes
 * @property {function} [onClick] - Click event handler
 *
 * @param {ButtonProps} props - Component props
 * @returns {React.ReactElement} Button component
 */
const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      type = "button",
      isFullWidth = false,
      isDisabled = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Variants
    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white border border-transparent",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-transparent",
      outline:
        "bg-transparent hover:bg-gray-100 border border-gray-300 text-gray-700",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent",
      danger:
        "bg-red-600 hover:bg-red-700 text-white border border-transparent",
    };

    // Sizes
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-5 py-2.5 text-lg",
    };

    // Spacing for icons
    const iconSpacing = {
      sm: "space-x-1.5",
      md: "space-x-2",
      lg: "space-x-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        className={cn(
          "rounded-md font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          variants[variant],
          sizes[size],
          isFullWidth ? "w-full" : "",
          isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "flex items-center justify-center",
            (leftIcon || rightIcon || isLoading) && iconSpacing[size]
          )}
        >
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
          )}
          <span>{children}</span>
          {rightIcon && !isLoading && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
