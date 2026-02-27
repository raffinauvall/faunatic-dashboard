import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
  hint?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder = "Enter your message",
  rows = 3,
  className = "",
  disabled = false,
  error = false,
  success = false,
  hint,
  ...props
}) => {
  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className}`;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent border-error-500 focus:border-error-500 focus:ring-3 focus:ring-error-500/10`;
  } else if (success) {
    textareaClasses += ` border-success-500 focus:border-success-500 focus:ring-3 focus:ring-success-500/10`;
  } else {
    textareaClasses += ` bg-transparent border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90`;
  }

  return (
    <div className="relative">
      <textarea
        {...props}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
      />

      {hint && (
        <p
          className={`mt-2 text-sm ${
            error
              ? "text-error-500"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;