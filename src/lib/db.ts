import Dexie from 'dexie';

export interface Todo {
  id: string; // Use string for UUID
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface Change {
  id?: number;
  type: string;
  todoId: string;
  data: Todo;
  timestamp: Date;
}

class TodoAppDB extends Dexie {
  todos: Dexie.Table<Todo, string>; // Use string for UUID
  changes: Dexie.Table<Change, number>;

  constructor() {
    super('TodoApp');
    this.version(1).stores({
      todos: 'id, title, completed, createdAt, updatedAt, version',
      changes: '++id, type, todoId, data, timestamp'
    });
    this.todos = this.table('todos');
    this.changes = this.table('changes');
  }
}

export const db = new TodoAppDB();
