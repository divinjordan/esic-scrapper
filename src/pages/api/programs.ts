import apiRoute from "../../libs/api-route";
import { find, create } from "../../libs/json-storage";

function get(req, res) {
  const programs = find("storage/data", "programs").data.programs;

  return res.json([programs[0]]);
}

function post(req, res) {
  const programs = find("storage/data", "programs").data.programs;

  const certifications = programs
    .map((item) => {
      return {
        programId: item.id,
        certifInfoCode: item.certifInfoCode,
        certificateurContratId: item.certificateurContratId,
        certificateurId: item.certificateurId,
        certificationDetails: item.certificationDetails,
        certificationIncludedInAdditionalExpenses:
          item.certificationIncludedInAdditionalExpenses,
        certificationModality: item.certificationModality,
        certifiedData: item.certifiedData,
      };
    })
    .filter(
      (item) =>
        item.certificationDetails != "" && item.certificationDetails != null
    );

  const categories = programs.map((item) => {
    return item.category;
  });

  create("storage/data", "categories", categories);
  create("storage/data", "certifications", certifications);

  return res.json({ message: "Request process with success" });
}

function put(req, res) {
  const programs = find("storage/data", "programs").data.programs;
}

export default apiRoute.create({ get, post });
