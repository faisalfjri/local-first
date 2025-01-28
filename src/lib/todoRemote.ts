import { Todo } from '@prisma/client';

export const getRemoteTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos');
  return await response.json();
};

export const addRemoteTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  return await response.json();
};

export const updateRemoteTodo = async (
  id: string,
  updates: Partial<Todo>
): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...updates })
  });
  return await response.json();
};

export const deleteRemoteTodo = async (id: string): Promise<void> => {
  await fetch('/api/todos', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
};
