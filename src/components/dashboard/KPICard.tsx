import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  trend = 'neutral',
  className,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-severity-low';
      case 'down':
        return 'text-severity-critical';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: '0px 12px 32px rgba(13, 38, 63, 0.12)' }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-xl p-6 shadow-card",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-[#6B7280] text-sm font-medium">{title}</p>
          <p className="text-[#0F172A] text-3xl font-semibold">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {Math.abs(change)}%
              </span>
              <span className="text-[#6B7280] text-xs">{changeLabel}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-accent/10 text-accent">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;
