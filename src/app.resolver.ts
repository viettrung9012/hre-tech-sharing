import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Task } from './graphql';
import { DataService } from './data/data.service';

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
        const tasks = await this.dataService.getData();
        return tasks.filter((task: Task) => {
            let filtered = true;
            if (id) filtered = filtered && id === task.id;
            if (priority) filtered = filtered && priority === task.priority;
            if (category) filtered = filtered && category === task.category;
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
        const tasks = await this.dataService.getData();
        const lastId = tasks[tasks.length - 1].id;
        const newTask = { id: lastId + 1, summary, dueDate, category, priority };
        const updatedTasks = tasks.concat(newTask);
        this.dataService.updateDataFiles(updatedTasks);
        return newTask;
    }
}