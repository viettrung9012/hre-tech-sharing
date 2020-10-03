import { Task } from '../graphql';
import { writeFile } from "fs";
import { join, resolve } from 'path';

export class DataService {
  async getData(): Promise<Task[]> {
    delete require.cache[require.resolve("./tasks.json")];
    return (await import("./tasks.json")).default;
  }

  updateDataFiles(updatedData: Task[]) {
    const dataString = JSON.stringify(updatedData, null, 2);
    this.writeDataToFile(dataString, join(__dirname, "tasks.json"));
    this.writeDataToFile(dataString, join(resolve(__dirname, "../.."), "/src/data/tasks.json"));
  }

  writeDataToFile(data: string, file: string) {
    writeFile(file, data, function writeJSON(err) {
      if (err) return console.log(err);
      console.log("writing to " + file);
    });
  }
}