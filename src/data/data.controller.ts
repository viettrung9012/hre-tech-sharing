import { Controller, Get, Post, Header, Body, Put, Param, BadRequestException, Patch, Delete, HttpCode } from '@nestjs/common';
import { DataService } from './data.service';
import { CreateTask, UpdateTask, UpdateCategory } from './task.dto';
import { Task } from 'src/graphql';
import { DataTypes } from './config';

@Controller()
export class DataController {
  constructor(private readonly dataService: DataService) {}
  @Get('/task')
  async getAllTask(): Promise<Task[]> {
    return this.dataService.getData(DataTypes.Task);
  }

  @Get('/task/:id')
  async getOneTasks(@Param('id') id:number): Promise<Task[]> {
    const tasks = await this.dataService.getData(DataTypes.Task);
    const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
    if (taskToBeUpdated === -1) throw new BadRequestException('Task not found'); 
    return tasks[taskToBeUpdated];
  }

  @Get('/task/:id/category/')
  async getTaskCategory(@Param('id') id:number): Promise<Task[]> {
    const tasks= await this.dataService.getData(DataTypes.Task);
    const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
    if (taskToBeUpdated === -1) throw new BadRequestException('Task not found'); 
    if (tasks[taskToBeUpdated].category) return tasks[taskToBeUpdated].category
    else throw new BadRequestException('Task category not found')
  }

  @Post('/task')
  @Header('Cache-Control', 'none')
  async addTask(
    @Body() createTask: CreateTask
  ): Promise<Task> {
      const tasks = await this.dataService.getData(DataTypes.Task);
      const lastId = tasks[tasks.length - 1].id;
      const {summary, dueDate, category, priority} = createTask;
      const categoryObject = await this.dataService.getCategory(category);
      const newTask = { id: lastId + 1, summary, dueDate, category:categoryObject, priority };
      const updatedTasks = tasks.concat(newTask);
      this.dataService.updateDataFiles(updatedTasks, DataTypes.Task);
      return newTask;
  }

  @Patch('/task/:id') 
  @Header('Cache-Control', 'none')
  async patchTask(
    @Param('id') id: number,
    @Body() updateTask?: UpdateTask
  ): Promise<Task> {
      const tasks = await this.dataService.getData(DataTypes.Task);
    const {summary, dueDate, priority} = updateTask;
    const category = undefined;
      const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
      if (taskToBeUpdated === -1) throw new BadRequestException('Task not found'); 
      const updatedDetails = this.dataService.deleteUndefinedKeys({ summary, dueDate, category, priority });
    tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], updatedDetails);
      this.dataService.updateDataFiles(tasks, DataTypes.Task);
      return tasks[taskToBeUpdated] ;
  }

  @Patch('/task/:id/category') 
  @Header('Cache-Control', 'none')
  async patchTaskCategory(
    @Param('id') id: number,
    @Body() updateCategory?: UpdateCategory
  ): Promise<Task> {
    const tasks = await this.dataService.getData(DataTypes.Task);
    const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
    if (taskToBeUpdated === -1) throw new BadRequestException('Task not found'); 
    const {category} = updateCategory;
    const categoryObject = await this.dataService.getCategory(category);
    tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], {category: categoryObject});
    this.dataService.updateDataFiles(tasks, DataTypes.Task);
    return tasks[taskToBeUpdated] ;
  }

  @Put('/task/:id') 
  @Header('Cache-Control', 'none')
  async putTask(
    @Param('id') id: number,
    @Body() createTask?: CreateTask
  ): Promise<Task> {
      const tasks = await this.dataService.getData(DataTypes.Task);
      const {summary, dueDate, category, priority} = createTask;
        const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
        if (taskToBeUpdated === -1) throw new BadRequestException('Task not found');
        const categoryObject = await this.dataService.getCategory(category);
        const updatedDetails = this.dataService.returnUndefinedKeys({ summary, dueDate, category:categoryObject, priority });
        delete tasks[taskToBeUpdated];
        tasks[taskToBeUpdated] = Object.assign({}, tasks[taskToBeUpdated], {id: taskToBeUpdated, ...updatedDetails});
        this.dataService.updateDataFiles(tasks, DataTypes.Task);
        return tasks[taskToBeUpdated] ;
  }

  @Delete('/task/:id')
  @HttpCode(204)
  @Header('Cache-Control', 'none')
  async deleteTask(
    @Param('id') id: number,
  ): Promise<Task> {
      const tasks = await this.dataService.getData(DataTypes.Task);
      const taskToBeUpdated = tasks.findIndex((task) => task.id === +id);
      if (taskToBeUpdated === -1) throw new BadRequestException('Task not found');
      tasks.splice(taskToBeUpdated,1);
      this.dataService.updateDataFiles(tasks,DataTypes.Task);
      return ;
  }
}
