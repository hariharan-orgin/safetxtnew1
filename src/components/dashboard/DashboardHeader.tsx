import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  pageTitle: string;
  showDateFilter?: boolean;
  showSearch?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  pageTitle,
  showDateFilter = true,
  showSearch = true,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 bg-[#F7F8FA]/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <h1 className="heading-1 text-[#0F172A]">{pageTitle}</h1>

        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-10 bg-white border-gray-200 focus:border-accent"
              />
            </div>
          )}

          {showDateFilter && (
            <Button variant="outline" size="sm" className="h-10 bg-white border-gray-200 text-gray-600 hover:bg-gray-50">
              <Calendar className="w-4 h-4 mr-2" />
              Today
            </Button>
          )}

          <Button variant="outline" size="icon" className="h-10 w-10 bg-white border-gray-200 hover:bg-gray-50 relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-severity-critical rounded-full" />
          </Button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:opacity-90 transition-opacity">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
