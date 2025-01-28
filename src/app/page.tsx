'use client';
import { useEffect, useState } from 'react';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  syncTodos
} from '@/lib/todoLocal';
import { Todo } from '@prisma/client';
import OnlineStatus from '@/components/OnlineStatus';
import { useStatusStore } from '@/stores/statusState';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { isOnline, setOnline, setSyncing, setChanges } = useStatusStore();

  const loadTodos = async () => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const handleSyncTodos = async () => {
    try {
      setSyncing(true);
      await syncTodos();
      loadTodos();
    } catch (error) {
      console.log(error);
    } finally {
      setSyncing(false);
      setChanges(false);
    }
  };

  useEffect(() => {
    handleSyncTodos();

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      handleSyncTodos();
      console.log('isOnline');
      setChanges(false);
    }
  }, [isOnline]); // add hasChanges to up-to-date sync

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addTodo({
        title: newTodo,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0
      });
      setNewTodo('');
      loadTodos();
      setChanges(true);
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      await updateTodo(id, { completed: !todo.completed });
      loadTodos();
      setChanges(true);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    loadTodos();
    setChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
          <div className="flex items-center space-x-4">
            <OnlineStatus />
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span
                  className={`text-gray-700 ${
                    todo.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {todo.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
