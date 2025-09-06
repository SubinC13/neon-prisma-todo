'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import StickyNote from './StickyNote';

interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  color: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface StickyWallProps {
  todos: Todo[];
  onCreateTodo: (todo: { title: string; description?: string; color?: string; category?: string }) => void;
  onUpdateTodo: (id: number, updates: Partial<Todo>) => void;
  onDeleteTodo: (id: number) => void;
}

const COLORS = [
  { name: 'yellow', class: 'bg-yellow-200 border-yellow-300' },
  { name: 'blue', class: 'bg-blue-200 border-blue-300' },
  { name: 'pink', class: 'bg-pink-200 border-pink-300' },
  { name: 'orange', class: 'bg-orange-200 border-orange-300' },
  { name: 'green', class: 'bg-green-200 border-green-300' },
  { name: 'purple', class: 'bg-purple-200 border-purple-300' },
  { name: 'gray', class: 'bg-gray-200 border-gray-300' },
];

export default function StickyWall({ todos, onCreateTodo, onUpdateTodo, onDeleteTodo }: StickyWallProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    color: 'yellow',
    category: 'general'
  });

  const handleCreate = () => {
    if (newTodo.title.trim()) {
      onCreateTodo(newTodo);
      setNewTodo({ title: '', description: '', color: 'yellow', category: 'general' });
      setIsCreating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Sticky Wall</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {todos.map((todo) => (
          <StickyNote
            key={todo.id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onDelete={onDeleteTodo}
          />
        ))}
        
        {/* Add New Note Card */}
        <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-6 flex items-center justify-center min-h-[200px] hover:bg-gray-300 transition-colors cursor-pointer">
          {isCreating ? (
            <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTodo.title}
                onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <textarea
                placeholder="Description"
                value={newTodo.description}
                onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2">
                <select
                  value={newTodo.color}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, color: e.target.value }))}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  {COLORS.map(color => (
                    <option key={color.name} value={color.name}>
                      {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Category"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                  className="flex-1 p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleCreate}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="flex flex-col items-center text-gray-500 hover:text-gray-700"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">Add New Note</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
