import apiRoute from "../../../libs/api-route";
import { find } from "../../../libs/json-storage";

// function createAttributes(objectName, toExludes) {
//   const dbDefinition = find("storage", "db-definition");
//   return Object.fromEntries(
//     dbDefinition[objectName].props.map((item) => {
//       return [item.name, true];
//     })
//   );
// }
// objectName == Type

function get(req, res) {
  let toExcludes = [];

  function createSubRecussif(objectName) {
    const dbDefinition = find("storage", "db-definition");
    const object = dbDefinition[objectName];
    toExcludes = [...toExcludes, ...objectName];
    return Object.fromEntries(
      object.props.map((prop) => {
        if (!prop.relation) {
          return [prop.name, ""];
        } else {
          if (
            toExcludes.includes(prop.type) ||
            prop.type == objectName ||
            toExcludes.includes(`${objectName}.${prop.name}`)
          ) {
            return [];
          } else {
            return [prop.name, createSubRecussif(prop.type)];
          }
        }
      })
    );
  }

  function createSub(objectName) {
    const dbDefinition = find("storage", "db-definition");
    const object = dbDefinition[objectName];
    return Object.fromEntries(
      object.props.map((item) => {
        if (!item.relation) {
          return [item.name, ""];
        } else {
          return [];
        }
      })
    );
  }

  const dbDefinition = find("storage", "db-definition");
  let types = find("storage", "query-types");

  const { type, excludes, collection } = types[req.query.collection];

  const object = dbDefinition[type];
  toExcludes = [...toExcludes, ...excludes, type];

  const query = {};
  query[collection] = Object.fromEntries(
    object.props.map((prop) => {
      if (prop.type == type) {
        return [];
      } else {
        if (!prop.relation) {
          return [prop.name, ""];
        } else {
          return [prop.name, createSub(prop.type)];
        }
      }
    })
  );

  if (req.query.hasOwnProperty("format")) {
    if (req.query.format == "graphql") {
      let queryString = JSON.stringify(query).replace(/:/g, "");
      queryString = queryString.replace(/"/g, "");
      return res.json(queryString);
    }
  }

  return res.json(query);
}

export default apiRoute.create({ get });
