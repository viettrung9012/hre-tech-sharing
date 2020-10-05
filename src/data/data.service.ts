import { writeFileSync } from "fs";
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
    try {
      console.log("writing to " + file);
      writeFileSync(file, data);
    } catch (err) {
      console.error(err);
    }
  }
}