
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface IMutation {
    addTask(summary: string, dueDate?: string, category?: string, priority?: number): Task | Promise<Task>;
    updateTask(id: number, summary?: string, dueDate?: string, category?: string, priority?: number): Task | Promise<Task>;
    deleteTask(id: number): string | Promise<string>;
}

export interface IQuery {
    hello(): string | Promise<string>;
    getTasks(id?: number, priority?: number, category?: string): Task[] | Promise<Task[]>;
}

export interface Category {
    id: number;
    name: string;
}

export interface Task {
    id: number;
    summary: string;
    dueDate?: string;
    priority?: number;
    category?: Category;
}
