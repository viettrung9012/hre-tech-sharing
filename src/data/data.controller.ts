import { Controller, Get, Post, Header, Body, Put, Param, BadRequestException, Patch, Delete, HttpCode } from '@nestjs/common';
import { DataService } from './data.service';
import { CreateTask } from './task.dto';
import { Task } from 'src/graphql';

@Controller()
export class DataController {
  constructor(private readonly dataService: DataService) {}
  @Get('/task')
  async getAllTask(): Promise<Task[]> {
    return this.dataService.getData();
  }

  @Get('/task/:id')
  async getOneTasks(@Param('id') id:number): Promise<Task[]> {
    const tasks = await this.dataService.getData();
    const filteredTask = tasks.filter((task:Task) => {
      return +id === task.id ;
    })
    if (filteredTask.length>0){
      return filteredTask
    }
    else {
     throw new BadRequestException('Invalid task id');
    }
    
  }

  @Post('/task')
  @Header('Cache-Control', 'none')
  async addTask(
    @Body() createTask: CreateTask
  ): Promise<Task> {
      const tasks = await this.dataService.getData();
      const lastId = tasks[tasks.length - 1].id;
      const {summary, dueDate, category, priority} = createTask;
      const newTask = { id: lastId + 1, summary, dueDate, category, priority };
      const updatedTasks = tasks.concat(newTask);
      this.dataService.updateDataFiles(updatedTasks);
      return newTask;
  }

  @Patch('/task/:id') 
  @Header('Cache-Control', 'none')
  async patchTask(
    @Param('id') id: number,
    @Body() createTask?: CreateTask
  ): Promise<Task | number | boolean | string> {
      const tasks = await this.dataService.getData();
      const {summary, dueDate, category, priority} = createTask;
      const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
      if (taskToBeUpdated === -1) throw new BadRequestException('Task not found');
      const updatedDetails = this.dataService.deleteUndefinedKeys({ summary, dueDate, category, priority });
      tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], updatedDetails);
      this.dataService.updateDataFiles(tasks);
      return tasks[taskToBeUpdated] ;
  }

  @Put('/task/:id') 
  @Header('Cache-Control', 'none')
  async putTask(
    @Param('id') id: number,
    @Body() createTask?: CreateTask
  ): Promise<Task | number | boolean | string | CreateTask> {
      const tasks = await this.dataService.getData();
      const {summary, dueDate, category, priority} = createTask;
        const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
        if (taskToBeUpdated === -1) throw new BadRequestException('Task not found');
        const updatedDetails = this.dataService.returnUndefinedKeys({ summary, dueDate, category, priority });
        delete tasks[taskToBeUpdated];
        tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], {id: taskToBeUpdated, ...updatedDetails});
        this.dataService.updateDataFiles(tasks);
        return tasks[taskToBeUpdated] ;
  }

  @Delete('/task/:id')
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  async deleteTask(
    @Param('id') id: number,
  ): Promise<Task | number | boolean | string | CreateTask> {
      const tasks = await this.dataService.getData();
      const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
      if (taskToBeUpdated === -1) throw new BadRequestException('Task not found');
      tasks.splice(taskToBeUpdated,1);
      this.dataService.updateDataFiles(tasks);
      return ;
  }
}
