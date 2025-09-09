// src/components/ui/TooltipInfo.tsx
import React, { useState } from 'react';

interface TooltipInfoProps {
  children: React.ReactNode;
  id: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipInfo: React.FC<TooltipInfoProps> = ({ 
  children, 
  id, 
  side = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsVisible(!isVisible);
    }
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  return (
    <span className="tooltip-container" style={{ position: 'relative', display: 'inline-block' }}>
      <span 
        className="btn btn-info btn-xs"
        tabIndex={0}
        aria-label="More information"
        aria-describedby={isVisible ? id : undefined}
        aria-expanded={isVisible}
        role="button"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={() => setIsVisible(!isVisible)}
        onKeyDown={handleKeyDown}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          padding: '0',
          fontSize: '12px',
          fontWeight: 'bold',
          marginLeft: '5px',
          cursor: 'help',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span className="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
      </span>
      
      {isVisible && (
        <div
          id={id}
          role="tooltip"
          aria-live="polite"
          className="tooltip tooltip-open"
          style={{
            position: 'absolute',
            zIndex: 1050,
            display: 'block',
            opacity: 1,
            ...(side === 'top' && {
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '5px'
            }),
            ...(side === 'bottom' && {
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '5px'
            }),
            ...(side === 'left' && {
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginRight: '5px'
            }),
            ...(side === 'right' && {
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginLeft: '5px'
            })
          }}
        >
          <div className="tooltip-arrow"></div>
          <div 
            className="tooltip-inner"
            style={{
              maxWidth: '300px',
              padding: '8px 12px',
              backgroundColor: '#333',
              color: '#fff',
              textAlign: 'left',
              fontSize: '12px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {children}
          </div>
        </div>
      )}
    </span>
  );
};

export default TooltipInfo;