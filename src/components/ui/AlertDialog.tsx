// src/components/ui/AlertDialog.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

interface AlertDialogComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const AlertDialogComponent: React.FC<AlertDialogComponentProps> = ({
  open,
  onClose,
  title,
  message
}) => {
  const { t } = useTranslation();
  
  const dialogTitle = title || t('alerts.title');
  const modalId = React.useId();
  const titleId = React.useId();
  const descriptionId = React.useId();
  
  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (open && event.key === 'Escape') {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);
  
  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  
  if (!open) return null;
  
  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="modal-backdrop in"
        onClick={handleBackdropClick}
        style={{ 
          zIndex: 1040,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Modal dialog */}
      <div
        id={modalId}
        className="modal in"
        style={{ 
          display: 'block', 
          zIndex: 1050,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'transparent'
        }}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-hidden="false"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-sm" role="document" style={{ margin: '30px auto' }}>
          <div 
            className="modal-content"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="modal-title" id={titleId}>
                <span className="glyphicon glyphicon-exclamation-sign text-warning mrgn-rght-sm" aria-hidden="true"></span>
                {dialogTitle}
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="modal-body">
              <p id={descriptionId}>{message}</p>
            </div>
            
            {/* Modal Footer */}
            <div className="modal-footer">
              <Button 
                variant="primary" 
                onClick={onClose} 
                autoFocus
                className="btn-sm"
              >
                <span className="glyphicon glyphicon-ok mrgn-rght-sm" aria-hidden="true"></span>
                {t('alerts.ok')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertDialogComponent;