import apiRoute from "../../libs/api-route";
import fs from "fs";
import { find } from "../../libs/json-storage";

function get(req, res) {
  if (!req.query.hasOwnProperty("name")) {
    return res.json("Object not found");
  }

  const dbDefinition = find("storage", "db-definition");

  return res.json(dbDefinition[req.query.name]);
}

export default apiRoute.create({ get });
