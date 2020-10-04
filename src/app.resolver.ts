import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category, Task } from './graphql';
import { DataService } from './data/data.service';
import { DataTypes } from './data/config';

@Resolver()
export class AppResolver {
    dataService = new DataService();

    @Query()
    hello() {
        return 'hello, world!';
    }

    @Query()
    async getTasks(
      @Args('id') id?: number,
      @Args('priority') priority?: number,
      @Args('category') category?: string
    ): Promise<Task[]> {
        const tasks = await this.dataService.getData(DataTypes.Task);
        return tasks.filter((task: Task) => {
            let filtered = true;
            if (id !== undefined) filtered = filtered && id === task.id;
            if (priority !== undefined) filtered = filtered && priority === task.priority;
            if (category !== undefined) filtered = filtered && category === task.category.name;
            return filtered;
        });
    }

    @Mutation()
    async addTask(
      @Args('summary') summary: string,
      @Args('dueDate') dueDate?: string,
      @Args('category') category?: string,
      @Args('priority') priority?: number
    ): Promise<Task> {
        const tasks: Task[] = await this.dataService.getData(DataTypes.Task);
        const categoryObject = await this.dataService.getCategory(category);
        const lastId = tasks[tasks.length - 1].id;
        const newTask: Task = { id: lastId + 1, summary, dueDate, category: categoryObject, priority };
        const updatedTasks = tasks.concat(newTask);
        this.dataService.updateDataFiles(updatedTasks, DataTypes.Task);
        return newTask;
    }

    @Mutation()
    async updateTask(
      @Args('id') id: number,
      @Args('summary') summary?: string,
      @Args('dueDate') dueDate?: string,
      @Args('category') category?: string,
      @Args('priority') priority?: number
    ) {
        const tasks = await this.dataService.getData(DataTypes.Task);
        const taskToBeUpdated = tasks.findIndex((task) => task.id === id);
        if (taskToBeUpdated === -1) return Error('Task not found');
        const categoryObject = await this.dataService.getCategory(category);
        const updatedDetails = this.dataService.deleteUndefinedKeys({ summary, dueDate, category: categoryObject, priority });
        tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], updatedDetails);
        this.dataService.updateDataFiles(tasks, DataTypes.Task);
        return tasks[taskToBeUpdated];
    }

    @Mutation()
    async deleteTask(
      @Args('id') id: number
    ) {
        const tasks = await this.dataService.getData(DataTypes.Task);
        const taskToBeUpdated = tasks.findIndex((task) => task.id === id);
        if (taskToBeUpdated === -1) return Error('Task not found');
        tasks.splice(taskToBeUpdated, 1);
        this.dataService.updateDataFiles(tasks, DataTypes.Task);
        return `Task ${id} Deleted`;
    }
}