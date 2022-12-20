import fs from "fs";

export default function handle(req, res) {
  if (req.method == "POST") {
    fs.writeFileSync(
      `storage/definitions/${req.body.name}.json`,
      JSON.stringify(req.body.definition)
    );
    return res.status(200).json({
      name: "Definition save with succes",
    });
  }

  if (req.method == "GET") {
    return res.status(403).json({
      message: "GET Method not supported for this route",
    });
  }
}
