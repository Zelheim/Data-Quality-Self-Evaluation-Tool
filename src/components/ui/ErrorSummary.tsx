// src/components/ui/ErrorSummary.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface ValidationError {
  id: string;
  message: string;
  fieldLabel: string;
}

interface ErrorSummaryProps {
  errors: ValidationError[];
  titleKey?: string;
}

const ErrorSummary: React.FC<ErrorSummaryProps> = ({ errors, titleKey }) => {
  const { t } = useTranslation();
  const summaryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (errors.length > 0 && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={summaryRef}
      className="alert alert-danger mrgn-tp-md"
      role="alert"
      tabIndex={-1}
      aria-labelledby="error-summary-title"
    >
      <h3 id="error-summary-title" className="mrgn-tp-0">
        <span aria-hidden="true"></span>
        {' '}
        {titleKey ? t(titleKey) : t('assessment.ethics.validation.errorSummaryTitle')}
      </h3>
      <ul className="list-unstyled">
        {errors.map((error) => (
          <li key={error.id}>
            <a href={`#${error.id}`} className="text-danger">
              {error.fieldLabel}: {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorSummary;
