import { useEffect, useState } from "react";
import axios from "axios";
import { slugify } from "../libs/slugify";

export default function Home() {
  const [data, setData] = useState({});
  const [objects, setObjects] = useState([]);

  async function getPages() {
    const schemas = await axios
      .get("https://app.digiforma.com/graphql_docs/grade.doc.html")
      .then((res) => {
        const div = document.createElement("html");
        div.innerHTML = res.data;
        const sections = div
          .querySelector("nav")
          .querySelectorAll(".slds-grid");
        const object = Object.fromEntries(
          Array.prototype.map.call(sections, (section) => {
            const key = section.querySelector("h4").innerText;
            const value = Array.prototype.map.call(
              section.querySelector("ul").querySelectorAll("a"),
              (a) => {
                return {
                  ref: a.href.split("/").pop(),
                  name: a.innerText.trim(),
                };
              }
            );
            return [key, value];
          })
        );
        return Promise.resolve(object);
      });

    axios
      .post("/api/pages", { schemas })
      .then((res) => console.log("Schemas save with success"));
  }

  async function getDefinition(object: any) {
    const res = await axios.get(
      `https://app.digiforma.com/graphql_docs/${object.ref}`
    );
    const div = document.createElement("div");
    div.innerHTML = res.data;
    const definition = Array.prototype.map
      .call(
        div.querySelector("code").querySelector("ul").querySelectorAll("li"),
        (li) => {
          const value = {
            isProp: false,
            comment: "",
            slug: "",
            name: "",
            type: "",
            cardinal: "",
          };
          const a = li.querySelector(".support");
          if (a == null) {
            value.isProp = false;
          } else {
            value.isProp = true;
            value.name = li.querySelector(".meta").innerText.trim();
            value.type = a.innerText.trim();
            if (li.previousSibling != null) {
              const commentElement =
                li.previousSibling.querySelector(".comment");

              if (commentElement != null) {
                value.comment = commentElement.innerText
                  .trim()
                  .split("#")
                  .pop()
                  .trim();
                value.slug = slugify(value.comment, "_");
              } else {
                value.slug = value.name;
              }
            }
            // check cardinal
            if (li.innerText.includes("[") && li.innerText.includes("]")) {
              value.cardinal = "many";
            }
          }
          return value;
        }
      )
      .filter((e) => e.isProp);

    return axios.post("api/definitions", {
      name: object.name,
      definition,
    });
  }

  async function generateDefinition() {
    const { data: objects } = await axios.get("api/objects");
    setObjects(objects);
    objects.forEach((object) => {
      getDefinition(object).finally(() => {
        console.log(object.name);
      });
    });
  }

  useEffect(() => {});

  function testing() {
    const element = document.getElementById("demo");
    console.log(element.innerText);
  }

  return (
    <div className="max-w-7xl mx-auto pt-12">
      <div className="space-x-4 flex">
        <button
          onClick={generateDefinition}
          className="bg-red-500 text-white rounded-md px-4 py-2"
        >
          Generate definition
        </button>
        <button
          onClick={testing}
          className="bg-red-500 text-white rounded-md px-4 py-2"
        >
          Testing
        </button>
      </div>
      <div>
        <div id="demo">
          <span className="tab">
            <span className="meta">assessments</span>: [
            <a className="support type" href="programassessments.doc.html">
              ProgramAssessments
            </a>
            ]
          </span>
        </div>
      </div>
      <div className="mt-8 bg-gray-900 text-white p-8">
        <table></table>
      </div>
    </div>
  );
}
