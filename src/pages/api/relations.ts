import apiRoute from "../../libs/api-route";
import fs from "fs";

function get(req, res) {
  const relations = JSON.parse(
    fs.readFileSync("storage/relations.json").toString()
  );

  const { mode, object } = req.query;

  if (!["origin", "target"].includes(mode)) {
    return res.status(422).json({ message: "Unknow relation mode" });
  }

  return res.status(200).json(relations.filter((r) => r[mode] == object));
}

function post(req, res) {
  let objectNames = [];
  let definitions = Object.fromEntries(
    fs.readdirSync("storage/definitions").map((definition) => {
      objectNames.push(definition.split(".json")[0]);
      return [
        definition.split(".json")[0],
        {
          props: JSON.parse(
            fs.readFileSync(`storage/definitions/${definition}`).toString()
          ),
        },
      ];
    })
  );

  let relations = [];
  let roots = [];
  definitions = Object.fromEntries(
    Object.entries(definitions).map(([name, definition]) => {
      // go trought definition props.
      const tempRelations = definition.props
        .filter((prop) => objectNames.includes(prop.type))
        .map((prop) => {
          if (prop.cardinal == "many" && !roots.includes(name)) {
            roots.push(name);
          }
          return {
            origin: name,
            target: prop.type,
            name: prop.name,
            type: prop.cardinal == "many" ? "many" : "one", // relation
          };
        });
      relations = [...relations, ...tempRelations];
      // return
      return [
        name,
        {
          props: definition.props.map((item) => ({
            ...item,
            relation: objectNames.includes(item.type),
          })),
          relations: Object.fromEntries(
            tempRelations.map((relation) => {
              return [relation.name, { ...relation }];
            })
          ),
        },
      ];
    })
  );

  fs.writeFileSync("storage/db-definition.json", JSON.stringify(definitions));
  fs.writeFileSync("storage/relations.json", JSON.stringify(relations));

  // Find root objects

  fs.writeFileSync("storage/roots.json", JSON.stringify(roots));

  return res.json("relations generated with success");
}

export default apiRoute.create({ post, get });
