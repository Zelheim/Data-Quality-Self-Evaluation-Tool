// src/components/ui/ResultCard.tsx
import React from 'react';

interface ResultCardProps {
  result: 'pass' | 'fail' | 'warning' | null;
  children: React.ReactNode;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, children, className = '' }) => {
  const getResultClass = () => {
    switch (result) {
      case 'pass':
        return 'wb-inv-result wb-inv-result-pass';
      case 'fail':
        return 'wb-inv-result wb-inv-result-fail';
      case 'warning':
        return 'wb-inv-result wb-inv-result-warning';
      default:
        return 'wb-inv-result wb-inv-result-info';
    }
  };
  
  const getResultIcon = () => {
    switch (result) {
      case 'pass':
        return <span className="glyphicon glyphicon-ok-sign text-success mrgn-rght-sm" aria-hidden="true"></span>;
      case 'fail':
        return <span className="glyphicon glyphicon-remove-sign text-danger mrgn-rght-sm" aria-hidden="true"></span>;
      case 'warning':
        return <span className="glyphicon glyphicon-warning-sign text-warning mrgn-rght-sm" aria-hidden="true"></span>;
      default:
        return <span className="glyphicon glyphicon-info-sign text-info mrgn-rght-sm" aria-hidden="true"></span>;
    }
  };
  
  return (
    <div className={`${getResultClass()} text-center mrgn-tp-md ${className}`} role="alert">
      {getResultIcon()}
      <strong>{children}</strong>
    </div>
  );
};

export default ResultCard;