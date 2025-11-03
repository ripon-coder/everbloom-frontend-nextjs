import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = ''
}) => {
  return (
    <div
      className={`text-red-600 text-sm font-medium ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default ErrorMessage;