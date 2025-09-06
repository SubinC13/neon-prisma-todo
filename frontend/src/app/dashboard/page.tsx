'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { todoAPI } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import StickyWall from '@/components/StickyWall';
import ProtectedRoute from '@/components/ProtectedRoute';

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

interface Stats {
  total: number;
  completed: number;
  upcoming: number;
  today: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, upcoming: 0, today: 0 });
  const [loadingTodos, setLoadingTodos] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchStats();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getAll();
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoadingTodos(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await todoAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateTodo = async (todoData: { title: string; description?: string; color?: string; category?: string }) => {
    try {
      const response = await todoAPI.create(todoData);
      setTodos(prev => [response.data, ...prev]);
      fetchStats();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleUpdateTodo = async (id: number, updates: Partial<Todo>) => {
    try {
      const response = await todoAPI.update(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? response.data : todo));
      fetchStats();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoAPI.delete(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      fetchStats();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (loading || loadingTodos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar stats={stats} />
        <div className="flex-1 p-8">
          <StickyWall
            todos={todos}
            onCreateTodo={handleCreateTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
