import fs from "fs";

export default function handle(req, res) {
  fs.writeFileSync("storage/pages.json", JSON.stringify(req.body.pages));

  return res.status(200).json({
    name: "Pages link save with success",
  });
}
