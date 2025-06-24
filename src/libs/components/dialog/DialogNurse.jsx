// src/components/AlertDialog.jsx
import React, { useEffect, useRef } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const DialogNurse = ({
  isOpen = false, // Boolean: Controls dialog visibility
  onClose, // Function: Called when dialog is closed
  title, // String: Dialog title
  children, // JSX: Content (replaces message for flexibility, e.g., form or text)
  icon, // JSX: Optional icon
  primaryButtonText, // String: Primary button text
  onPrimaryButtonClick, // Function: Primary button click handler
  secondaryButtonText, // String: Secondary button text
  onSecondaryButtonClick, // Function: Secondary button click handler
  showCloseButton = true, // Boolean: Show close button
  disablePrimaryButton = false, // Boolean: Disable primary button
}) => {
  const dialogRef = useRef(null);
  const firstFocusableElementRef = useRef(null);

  // Focus trapping and keyboard navigation
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstFocusableElementRef.current = firstElement;

      const handleKeyDown = (e) => {
        if (e.key === "Escape" && onClose) {
          onClose();
        }
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      firstElement.focus();
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-labelledby="dialog-title"
      aria-modal="true"
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md text-center transform scale-95 animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Đóng dialog"
            title="Đóng"
          >
            <XCircle size={20} />
          </button>
        )}

        {icon && <div className="mx-auto mb-4">{icon}</div>}

        {title && (
          <h3
            id="dialog-title"
            className="text-xl font-bold text-gray-800 mb-3"
          >
            {title}
          </h3>
        )}

        <div className="text-gray-600 mb-6">{children}</div>

        {(primaryButtonText || secondaryButtonText) && (
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {primaryButtonText && (
              <button
                onClick={onPrimaryButtonClick}
                disabled={disablePrimaryButton}
                className={`w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  disablePrimaryButton
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={onSecondaryButtonClick}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogNurse;
