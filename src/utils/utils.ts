import fs from "fs";
import csv from "csv-parser";

export function readCsvWithPagination(
  filePath: string,
  size: number,
  page: number
): Promise<any[]> {
  let results: string[] = [];
  let start = size * (page - 1);
  let end = size * page;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        let paginatedResults = results.slice(start, end);
        resolve(paginatedResults);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export function readJSONFromFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

export function encrypt(input: string): string {
  let encryptedString = '';
  
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const encryptedCharCode = charCode + 1;
    
    encryptedString += String.fromCharCode(encryptedCharCode);
  }
  
  return encryptedString;
}

