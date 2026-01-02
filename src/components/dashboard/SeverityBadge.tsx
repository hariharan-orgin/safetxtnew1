import React from 'react';
import { cn } from '@/lib/utils';

type Severity = 'critical' | 'high' | 'medium' | 'low';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className }) => {
  const getStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-severity-critical text-white';
      case 'high':
        return 'bg-severity-high text-white';
      case 'medium':
        return 'bg-severity-medium text-gray-900';
      case 'low':
        return 'bg-severity-low text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wide",
      getStyles(),
      className
    )}>
      {severity}
    </span>
  );
};

export default SeverityBadge;
