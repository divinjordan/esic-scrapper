import apiRoute from "../../libs/api-route";
import { find, create } from "../../libs/json-storage";
import axios from "axios";

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

async function put(req, res) {
  const programs = find("storage/data", "programs").data.programs;
  const program = programs[0];
  const data = {
    libelle: program.name,
    souslibelle:
      program.subtitle == null || program.subtitle == "null"
        ? ""
        : program.subtitle,
    // contenu: program.description,
    // objectifs: `<ul>${program.goals.reduce(
    //   (a, b) => `${a}<li>${b.text}</li>`,
    //   ""
    // )}</ul>`,
    // programme: `<ul>${program.steps.reduce(
    //   (a, b) => `${a}<li>${b.text}</li>`,
    //   ""
    // )}</ul>`,
    // etudiants: `<ul>${program.targets.reduce(
    //   (a, b) => `${a}<li>${b.text}</li>`,
    //   ""
    // )}</ul>`,
    // duree_en_jours: program.durationInDays,
    // duree_en_heures: program.durationInHours,
    // prix: program.costsInter.cost,
    // accessibilite: program.handicappedAccessibility,
    // cpf_code: program.cpfCode,
    // ressources: `<ul>${program.pedagogicalResources.reduce(
    //   (a, b) => `${a}<li>${b.text}</li>`,
    //   ""
    // )}</ul>`,
    // formateurs: program.mentoring,
  };

  const result = await axios.post(
    "https://admin.esic-online.chillo.fr/items/formations",
    data,
    {
      headers: {
        Autorization: "Bearer lK7DlJvWeIMK6Yac9C3XsFfYVMcKiLYX",
      },
    }
  );
  return res.json("success");
}

export default apiRoute.create({ get, post, put });
