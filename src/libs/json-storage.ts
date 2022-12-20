import fs from "fs";

export function find(collection: string, name: string) {
  return JSON.parse(fs.readFileSync(`${collection}/${name}.json`).toString());
}

export function create(collection: string, name: string, content: any) {
  fs.writeFileSync(`${collection}/${name}.json`, JSON.stringify(content));
}
