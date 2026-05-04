import fs from "fs";
import csv from "csv-parser";

export const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    let columns = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headers) => {
        columns = headers;
      })
      .on("data", (data) => {
        if (rows.length < 5) rows.push(data);
      })
      .on("end", () => {
        resolve({
          columns,
          sample: rows,
        });
      })
      .on("error", reject);
  });
};
