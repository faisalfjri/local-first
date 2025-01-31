import { Change, db, Todo } from './db';
import {
  addRemoteTodo,
  deleteRemoteTodo,
  getRemoteTodos,
  updateRemoteTodo
} from './todoRemote';
import { v4 as uuidv4 } from 'uuid';

export const getTodos = async (): Promise<Todo[]> => {
  return await db.todos.toArray();
};

export const getChanges = async () => {
  return await db.changes.toArray();
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<string> => {
  const id = uuidv4(); // Generate a UUID
  await db.todos.add({ ...todo, id, version: 0 });
  await db.changes.add({
    type: 'ADD',
    todoId: id,
    data: { ...todo, id },
    timestamp: new Date()
  });
  return id;
};
export const updateTodo = async (
  id: string,
  updates: Partial<Todo>
): Promise<void> => {
  await db.todos.update(id, updates);
  await db.changes.add({
    type: 'UPDATE',
    todoId: id,
    data: updates as Todo,
    timestamp: new Date()
  });
};

export const deleteTodo = async (id: string): Promise<void> => {
  await db.todos.delete(id);
  await db.changes.add({
    type: 'DELETE',
    todoId: id,
    timestamp: new Date(),
    data: undefined as unknown as Todo
  });
};

export const syncTodos = async (): Promise<void> => {
  // Step 1: Sync local changes to the backend
  const changes = await db.changes.toArray();

  for (const change of changes as Change[]) {
    try {
      switch (change.type) {
        case 'ADD':
          // Add the todo to the backend
          await addRemoteTodo(change.data);
          break;
        case 'UPDATE':
          // Update the todo on the backend
          await updateRemoteTodo(change.todoId, change.data);
          break;
        case 'DELETE':
          // Delete the todo from the backend
          await deleteRemoteTodo(change.todoId);
          break;
      }
      // Remove the change from the queue after successful sync
      await db.changes.delete(change.id!);
    } catch (error) {
      console.log('Failed to sync change:', change, error);
    }
  }

  // Step 2: Fetch remote changes and apply them to the local database
  try {
    const remoteTodos = await getRemoteTodos();
    const localTodos = await db.todos.toArray();

    for (const remoteTodo of remoteTodos as Todo[]) {
      const localTodo = localTodos.find((t) => t.id === remoteTodo.id);

      const remoteUpdatedAt = new Date(remoteTodo.updatedAt); // Sudah dalam UTC
      const localUpdatedAt = localTodo ? new Date(localTodo.updatedAt) : null;

      if (!localTodo) {
        // If the todo doesn't exist locally, add it
        await db.todos.add(remoteTodo);
      } else if (remoteUpdatedAt > localUpdatedAt!) {
        // If the remote todo is newer, update the local todo
        await db.todos.update(remoteTodo.id, remoteTodo);
      }
    }

    // Step 3: Handle local todos that don't exist on the backend
    for (const localTodo of localTodos) {
      const remoteTodo = remoteTodos.find((t) => t.id === localTodo.id);

      if (!remoteTodo) {
        // If the todo doesn't exist on the backend, delete it on the local
        await db.todos.delete(localTodo.id);
      }
    }
  } catch (error) {
    console.error('Failed to fetch or apply remote changes:', error);
  }
};
