import { writeFile } from "fs";
import { join, resolve } from 'path';
import { DataTypes } from './config';
import { Category } from "src/graphql";


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
  returnUndefinedKeys(data: any) {
    for (const key of Object.keys(data)) {
        if (data[key] === undefined)  data[key] = ""
    }
    return data;
  }

  deleteUndefinedKeys(data: any) {
    for (const key of Object.keys(data)) {
        if (data[key] === undefined) delete data[key]
    }
    return data;
  }
  async getCategory(categoryName: string): Promise<Category> {
    if (categoryName) {
        const categories: Category[] = await this.getData(DataTypes.Category);
        return  categories.find((category) => category.name === categoryName);
    }
    return undefined;
}
}