import { writeFile } from "fs";
import { join, resolve } from 'path';
import { DataTypes } from './config';


export class DataService {
  async getData(dataType: DataTypes): Promise<any[]> {
    delete require.cache[require.resolve(`./${dataType}.json`)];
    return (await import(`./${dataType}.json`)).default;
  }

  updateDataFiles(updatedData: any[], dataType: DataTypes) {
    const dataString = JSON.stringify(updatedData, null, 2);
    this.writeDataToFile(dataString, join(__dirname, `${dataType}.json`));
    this.writeDataToFile(dataString, join(resolve(__dirname, "../.."), `/src/data/${dataType}.json`));
  }

  writeDataToFile(data: string, file: string) {
    writeFile(file, data, function writeJSON(err) {
      if (err) return console.log(err);
      console.log("writing to " + file);
    });
  }
}