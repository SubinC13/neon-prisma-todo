'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ChevronRight, 
  List, 
  Calendar, 
  StickyNote, 
  Plus, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface Stats {
  total: number;
  completed: number;
  upcoming: number;
  today: number;
}

interface SidebarProps {
  stats: Stats;
}

export default function Sidebar({ stats }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gray-200 h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Menu</h2>
        <button className="p-1 hover:bg-gray-300 rounded">
          <div className="w-4 h-4 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="w-full h-0.5 bg-gray-600"></div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">TASKS</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Upcoming</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-300 px-2 py-1 rounded-full">
              {stats.upcoming}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <List className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Today</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-300 px-2 py-1 rounded-full">
              {stats.today}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm">Calendar</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <StickyNote className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Sticky Wall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">LISTS</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-600 rounded"></div>
              <span className="text-sm">Personal</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-300 px-2 py-1 rounded-full">
              3
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-600 rounded"></div>
              <span className="text-sm">Work</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-300 px-2 py-1 rounded-full">
              3
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-600 rounded"></div>
              <span className="text-sm">List 1</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-300 px-2 py-1 rounded-full">
              3
            </span>
          </div>
          
          <div className="flex items-center py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
            <div className="flex items-center space-x-3">
              <Plus className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Add New List</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">TAGS</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-300">
            Tag 1
          </span>
          <span className="px-3 py-1 bg-pink-200 text-pink-800 text-xs rounded-full cursor-pointer hover:bg-pink-300">
            Tag 2
          </span>
          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full cursor-pointer hover:bg-gray-300 flex items-center">
            <Plus className="w-3 h-3 mr-1" />
            Add Tag
          </span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-auto space-y-2">
        <div className="flex items-center py-2 px-3 hover:bg-gray-300 rounded cursor-pointer">
          <Settings className="w-4 h-4 text-gray-600 mr-3" />
          <span className="text-sm">Settings</span>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center py-2 px-3 hover:bg-gray-300 rounded cursor-pointer w-full text-left"
        >
          <LogOut className="w-4 h-4 text-gray-600 mr-3" />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </div>
  );
}
