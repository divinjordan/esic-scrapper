import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // axios.get("api/programs").then((res) => {
    //   setData(() => res.data);
    // });
  }, []);

  function migrationProgram() {
    const res = axios.get("api/programs").then((res) => {
      const program = res.data[0];
      const data = {
        libelle: program.name,
        souslibelle: program.subtitle,
        contenu: program.description,
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
      axios.post("https://admin.esic-online.chillo.fr/items/formations", data, {
        headers: {
          Autorization: "Bearer lK7DlJvWeIMK6Yac9C3XsFfYVMcKiLYX",
          "content-type": "application/json",
        },
      });

      //setData(() => [data]);
      res.data.forEach((program) => {});
    });
  }

  return (
    <div className="mx-auto  pt-12">
      <div className="space-x-4 flex">
        <button
          onClick={migrationProgram}
          className="bg-red-500 text-white rounded-md px-4 py-2"
        >
          Migrate data.
        </button>
      </div>
      <div>
        <div id="demo">{data.length}</div>
      </div>
      <div className="mt-8  p-8">
        <pre>{JSON.stringify(data, null, 4)}</pre>
      </div>
    </div>
  );
}
