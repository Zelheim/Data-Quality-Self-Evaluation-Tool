// src/components/ui/StatCanTooltip.tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface StatCanTooltipProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}

const StatCanTooltip: React.FC<StatCanTooltipProps> = ({ 
  children, 
  tooltip, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 10,
        left: rect.left + rect.width / 2
      });
    }
  }, []);

  const showTooltip = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Calculate position only once when showing
    updatePosition();
    setIsVisible(true);
  }, [updatePosition]);

  const hideTooltip = useCallback(() => {
    // Add a small delay to prevent flickering
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  const cancelHide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isVisible) {
        setIsVisible(false);
      } else {
        showTooltip();
      }
    }
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <span 
        ref={triggerRef}
        className={`statcan-tooltip ${className}`}
        tabIndex={0}
        role="button"
        aria-label={`${children}. Definition: ${tooltip}`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
      >
        {children}
      </span>
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="statcan-tooltip-content" 
          role="tooltip"
          onMouseEnter={cancelHide}
          onMouseLeave={hideTooltip}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            visibility: 'visible',
            opacity: 1
          }}
        >
          {tooltip.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < tooltip.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export default StatCanTooltip;
