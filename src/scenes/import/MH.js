import React from "react";
import { Container } from "reactstrap";
import Importer from "./importer";
import Merimee from "../../entities/Merimee";
import Palissy from "../../entities/Palissy";

import api from "../../services/api";
import utils from "./utils";

export default class Import extends React.Component {
  render() {
    return (
      <Container className="import">
        <Importer
          collection="monuments-historiques"
          parseFiles={parseFiles}
          dropzoneText={
            <div>
              Glissez & déposez vos fichiers au format MH ( extension .csv avec
              séparateur | ) et les images associées (au format .jpg) dans cette
              zone
              <br /> <br />1-Les champs INSEE et DPT sont obligatoires à
              l'import
              <br />2-Une création de notice implique de noter en REF uniquement PA ou PM
              <br />3-Une mise à jour de notice implique de noter la REF complète, DPT et INSEE avec leur valeur
            </div>
          }
        />
      </Container>
    );
  }
}

function parseFiles(files, encoding) {
  return new Promise((resolve, reject) => {
    var objectFile = files.find(file => file.name.includes(".csv"));
    if (!objectFile) {
      reject("Pas de fichiers .csv detecté");
      return;
    }
    utils.readCSV(objectFile, "|", encoding).then(async objs => {
      const importedNotices = [];
      for (var i = 0; i < objs.length; i++) {
        const obj = objs[i];

        if (!obj.REF) {
          reject(
            "Impossible de détecter les notices. Vérifiez que le séparateur est bien | et que chaque notice possède une référence"
          );
          return;
        }

        //Create New notices
        if (obj.REF === "PM") {
          if (!obj.DPT) {
            reject("DPT est vide. Impossible de générer un id");
            return;
          }
          const ref = await api.getNewId("palissy", "PM", obj.DPT);
          obj.REF = ref.id;
        } else if (obj.REF === "PA") {
          if (!obj.DPT) {
            reject("DPT est vide. Impossible de générer un id");
            return;
          }
          const ref = await api.getNewId("merimee", "PA", obj.DPT);
          obj.REF = ref.id;
        }

        let newNotice;
        if (obj.REF.indexOf("PM") !== -1) {
          newNotice = new Palissy(obj);
        } else if (obj.REF.indexOf("PA") !== -1) {
          newNotice = new Merimee(obj);
        } else {
          reject(`La référence ${obj.REF} n'est ni palissy, ni mérimée`);
          return;
        }

        if (!newNotice.INSEE || !newNotice.INSEE.value) {
          newNotice._errors.push("INSEE ne doit pas être vide");
        }
        if (!newNotice.DPT || !newNotice.DPT.value) {
          newNotice._errors.push("DPT ne doit pas être vide");
        }

        if (
          newNotice.INSEE &&
          newNotice.DPT &&
          !String(newNotice.INSEE.value).startsWith(String(newNotice.DPT.value))
        ) {
          newNotice._errors.push("INSEE et Département ne coincident pas");
        }
        importedNotices.push(newNotice);
      }
      resolve({ importedNotices, fileNames: [objectFile.name] });
    });
  });
}
