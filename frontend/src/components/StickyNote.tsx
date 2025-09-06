'use client';

import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';

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

interface StickyNoteProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

const COLOR_CLASSES = {
  yellow: 'bg-yellow-200 border-yellow-300',
  blue: 'bg-blue-200 border-blue-300',
  pink: 'bg-pink-200 border-pink-300',
  orange: 'bg-orange-200 border-orange-300',
  green: 'bg-green-200 border-green-300',
  purple: 'bg-purple-200 border-purple-300',
  gray: 'bg-gray-200 border-gray-300',
};

export default function StickyNote({ todo, onUpdate, onDelete }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    color: todo.color,
    category: todo.category || 'general'
  });

  const handleSave = () => {
    onUpdate(todo.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      color: todo.color,
      category: todo.category || 'general'
    });
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const colorClass = COLOR_CLASSES[todo.color as keyof typeof COLOR_CLASSES] || COLOR_CLASSES.yellow;

  return (
    <div className={`${colorClass} border-2 rounded-lg p-4 min-h-[200px] relative group hover:shadow-lg transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
            onKeyPress={handleKeyPress}
            className="w-full font-bold text-lg bg-transparent border-none outline-none"
            autoFocus
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
            onKeyPress={handleKeyPress}
            className="w-full bg-transparent border-none outline-none resize-none"
            rows={4}
          />
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={editData.color}
              onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
              className="p-1 border border-gray-300 rounded"
            >
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="gray">Gray</option>
            </select>
            <input
              type="text"
              value={editData.category}
              onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category"
              className="flex-1 p-1 border border-gray-300 rounded"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg">{todo.title}</h3>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {todo.description && (
            <div className="text-sm mb-3 whitespace-pre-wrap">
              {todo.description}
            </div>
          )}
          
          {todo.category && (
            <div className="text-xs text-gray-600 mb-2">
              {todo.category}
            </div>
          )}
          
          <div className="absolute bottom-2 right-2">
            <button
              onClick={handleToggleComplete}
              className={`p-1 rounded-full ${
                todo.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
