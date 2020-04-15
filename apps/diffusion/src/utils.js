import { bucket_url } from "./config";
import html2Canvas from "./html2canvas";

export function getNoticeInfo(notice) {
  const base = notice.BASE;
  switch (base) {
    case "Collections des musées de France (Joconde)": {
      let title = "";
      if (notice.TITR) {
        title = notice.TITR;
      } else if ((notice.DENO || []).length) {
        title = notice.DENO.join(", ");
      } else {
        title = (notice.DOMN || []).join(", ");
      }
      title = capitalizeFirstLetter(title);

      const subtitle = !notice.TITR && notice.DENO ? "" : notice.DENO.join(", ");

      const metaDescription = capitalizeFirstLetter(jocondeMetaDescription(notice));
      const images = notice.IMG.map((e, i) => {
        const src = e ? `${bucket_url}${e}` : "/static/noimage.png";
        return { src, alt: `${title}_${i}` };
      });

      const image_preview = images.length ? images[0].src : "/static/noimage.png";

      return { title, subtitle, metaDescription, image_preview, images };
    }

    case "Photographies (Mémoire)": {
      let title = notice.TICO || notice.LEG || `${notice.EDIF || ""} ${notice.OBJ || ""}`.trim();
      title = capitalizeFirstLetter(title);

      let logo = "";
      if (notice.PRODUCTEUR === "CRMH") {
        logo = "/static/mh.png";
      } else if (notice.PRODUCTEUR === "MAP") {
        logo = "/static/map.png";
      } else if (notice.PRODUCTEUR === "INV") {
        logo = "/static/inventaire.jpg";
      }

      const subtitle = notice.TECH;

      const metaDescription = capitalizeFirstLetter(memoireMetaDescription(notice));

      const image_preview = notice.IMG ? `${bucket_url}${notice.IMG}` : "/static/noimage.png";
      const images = notice.IMG ? [{ src: `${bucket_url}${notice.IMG}`, alt: title }] : [];

      return { title, subtitle, metaDescription, logo, image_preview, images };
    }
    case "Répertoire des Musées de France (Muséofile)": {
      let title = notice.NOMOFF || notice.NOMANC || notice.NOMUSAGE;
      title = capitalizeFirstLetter(title);

      let subtitle = "";
      if(notice.DOMPAL){
        subtitle = notice.DOMPAL.join(", ");
      }

      let localisations = [];
      if (notice.VILLE_M) {
        localisations.push(notice.VILLE_M);
      }
      if (notice.DPT) {
        localisations.push(notice.DPT);
      }
      if (notice.REGION) {
        localisations.push(notice.REGION);
      }
      let localisation = localisations.join(", ");

      let metaDescription = "";

      const image_preview = notice.PHOTO ? `${bucket_url}${notice.PHOTO}` : "/static/noimage.png";
      const images = notice.PHOTO ? [{ src: `${bucket_url}${notice.PHOTO}`, alt: title }] : [];

      return { title, subtitle, metaDescription, image_preview, images, localisation };
    }
    case "Enluminures (Enluminures)": {
      let title = `${notice.TITR} - ${notice.SUJET}`;
      title = capitalizeFirstLetter(title);

      const subtitle = notice.SUJET;

      let metaDescription = "";

      const image_preview = notice.VIDEO.length
        ? `${bucket_url}${notice.VIDEO[0]}`
        : "/static/noimage.png";

      const images = notice.VIDEO.map((e, i) => ({
        src: `${bucket_url}${e}`,
        alt: `${title}_${i}`
      }));

      return { title, subtitle, metaDescription, images, image_preview };
    }
    case "Récupération artistique (MNR Rose-Valland)": {
      let title = notice.TICO || notice.TITR;
      title = capitalizeFirstLetter(title);

      const subtitle = notice.DENO ? notice.DENO.join(", ") : "";

      let metaDescription = "";

      const image_preview = notice.VIDEO.length
        ? `${bucket_url}${notice.VIDEO[0]}`
        : "/static/noimage.png";

      const images = notice.VIDEO.map((e, i) => ({
        src: `${bucket_url}${e}`,
        alt: `${title}_${i}`
      }));

      return { title, subtitle, image_preview, metaDescription, images };
    }
    case "Patrimoine mobilier (Palissy)": {
      let title = notice.TICO || notice.TITR;
      title = capitalizeFirstLetter(title);

      let logo = "";
      if (notice.PRODUCTEUR === "Inventaire") {
        logo = "/static/inventaire.jpg";
      } else if (notice.PRODUCTEUR === "Monuments Historiques") {
        logo = "/static/mh.png";
      }

      let metaDescription = "";

      const subtitle = notice.DENO ? notice.DENO.join(", ") : "";

      let localisation = [];
      if (notice.REG) {
        localisation.push(notice.REG);
      }
      if (notice.DPT) {
        if (notice.DPT_LETTRE) {
          localisation.push(`${notice.DPT_LETTRE} (${notice.DPT})`);
        } else {
          localisation.push(notice.DPT);
        }
      }

      //Si WCOM existe, on affiche WCOM, sinon on affiche COM s'il existe
      if (notice.WCOM || notice.COM) {
        if (notice.WCOM){
          localisation.push(notice.WCOM);
        }
        else {
          localisation.push(notice.COM);
        }
      }

      //Si WADRS existe, on affiche WADRS, sinon on affiche ADRS s'il existe
      if (notice.WADRS || notice.ADRS) {
        if (notice.WADRS){
          localisation.push(notice.WADRS);
        }
        else {
          localisation.push(notice.ADRS);
        }
      }

      if (notice.EDIF) {
        localisation.push(notice.EDIF);
      }

      localisation = localisation.join(" ; ");

      const images = notice.MEMOIRE.map((e, i) => {
        const src = e.url ? `${bucket_url}${e.url}` : "/static/noimage.png";
        return { src, alt: `${title}_${i}`, ref: e.ref, copy: e.copy, name: e.name };
      });

      const image_preview = notice.MEMOIRE.filter(e => e.url).length
        ? `${bucket_url}${notice.MEMOIRE.filter(e => e.url)[0].url}`
        : "/static/noimage.png";

      return { title, subtitle, metaDescription, logo, localisation, images, image_preview };
    }
    case "Patrimoine architectural (Mérimée)": {
      let title = notice.TICO || "";
      title = capitalizeFirstLetter(title);

      let logo = "";
      if (notice.PRODUCTEUR === "Inventaire") {
        logo = "/static/inventaire.jpg";
      } else if (notice.PRODUCTEUR === "Monuments Historiques") {
        logo = "/static/mh.png";
      }

      const subtitle = notice.DENO ? notice.DENO.join(", ") : "";

      let localisation = [];
      if (notice.REG) {
        localisation.push(notice.REG);
      }
      if (notice.DPT) {
        if (notice.DPT_LETTRE) {
          localisation.push(`${notice.DPT_LETTRE} (${notice.DPT})`);
        } else {
          localisation.push(notice.DPT);
        }
      }

      //Si WCOM existe, on affiche WCOM, sinon on affiche COM s'il existe
      if (notice.WCOM || notice.COM) {
        if (notice.WCOM){
          localisation.push(notice.WCOM);
        }
        else {
          localisation.push(notice.COM);
        }
      }

      //Si WADRS existe, on affiche WADRS, sinon on affiche ADRS s'il existe
      if (notice.WADRS || notice.ADRS) {
        if (notice.WADRS){
          localisation.push(notice.WADRS);
        }
        else {
          localisation.push(notice.ADRS);
        }
      }

      localisation = localisation.join(" ; ");
      let metaDescription = "";

      const images = notice.MEMOIRE.map((e, i) => {
        const src = e.url ? `${bucket_url}${e.url}` : "/static/noimage.png";
        return { src, alt: `${title}_${i}`, ref: e.ref, copy: e.copy, name: e.name };
      });

      const image_preview = notice.MEMOIRE.filter(e => e.url).length
        ? `${bucket_url}${notice.MEMOIRE.filter(e => e.url)[0].url}`
        : "/static/noimage.png";

      return { title, subtitle, metaDescription, logo, image_preview, images, localisation };
    }
    case "Ressources biographiques (Autor)": {
      let title = 
      (notice.NOMPRENOM ? notice.NOMPRENOM : 
        ( (notice.PREN ? notice.PREN : " ") 
          +(notice.NOM ? notice.NOM : "")
        )
      );
      let logo = "";
      if (notice.PRODUCTEUR === "Inventaire") {
        logo = "/static/inventaire.jpg";
      } else if (notice.PRODUCTEUR === "Monuments Historiques") {
        logo = "/static/mh.png";
      }
      else{
        logo = notice.PRODUCTEUR;
      }

      const images = notice.MEMOIRE.map((e, i) => {
        const src = e.url ? `${bucket_url}${e.url}` : "/static/noimage.png";
        return { src, alt: `${e.name}_${i}`, ref: e.ref, copy: e.copy, name: e.name };
      });

      const image_preview = notice.MEMOIRE.filter(e => e.url).length
        ? `${bucket_url}${notice.MEMOIRE.filter(e => e.url)[0].url}`
        : "/static/noimage.png";

      const nom =  (notice.NOMPRENOM? notice.NOMPRENOM : (notice.PREN + " " + notice.NOM)) + (notice.ALIAS!="" ? (" - " + notice.ALIAS) : "");

      //Description
      let life = "";
      if(notice.DNAISS && notice.DMORT){
        life = " (" + notice.DNAISS + " - " + notice.DMORT + ")";
      }
      else if(notice.DNAISS && !notice.DMORT){
        life = " (" + notice.DNAISS + ")";
      }
      const description = notice.INI + life;

      //Date d'activité
      let activite = "";
      if(notice.DATES || LOCACT){
        activite = " - (dates d'activité : " + notice.DATES + ((notice.DATES && notice.LOCACT)? (" - " + notice.LOCACT) : "");
      }

      //Fonction
      let isOrfevre = false;
      let fonction = "";
      notice.FONC.map( (fonc, index) => {
        if(fonc == "Orfèvre"){
          isOrfevre = true;
        }
        fonction += ( index==0? fonc : (", " + fonc) )
      });

      //Symbole
      let symbole = isOrfevre? notice.SYMB : "";

      //Dates et lieus d'existence
      let datesLieus = "";
      datesLieus += ( notice.DNAISS ? (notice.DNAISS + (notice.LNAISS? (" ("+notice.LNAISS+") ") : "") ) : "" );
      datesLieus += (notice.DNAISS && notice.DMORT ? " - " : "");
      datesLieus += ( notice.DMORT ? (notice.DMORT + (notice.LMORT? (" ("+notice.LMORT+") ") : "") ) : "");

      //Dates – lieu d’activités : SCLE ; DATES – LOCA – LOCACT – ADRS
      let datesActivites = "";
      const SCLE = notice.SCLE.join(", ");
      const DATES = notice.DATES.join(", ");
      datesActivites += SCLE ? (SCLE + "; ") : "";
      datesActivites += ((datesActivites!=""?" - ":"") + (DATES ? (DATES) : ""));
      datesActivites += ((datesActivites!=""?" - ":"") + (notice.LOCA ? (notice.LOCA) : ""));
      datesActivites += ((datesActivites!=""?" - ":"") + (notice.LOCACT ? (notice.LOCACT) : ""));
      datesActivites += ((datesActivites!=""?" - ":"") + (notice.ADRS ? (notice.ADRS) : ""));

      //Référence ISNI : ISNI_VERIFIEE / Lien ark : ARK
      let referenceArk = "";
      referenceArk += notice.ISNI_VERIFIEE ? notice.ISNI_VERIFIEE : "";
      referenceArk += ((notice.ISNI_VERIFIEE? " / " : "") + ( notice.ARK ? ( "Lien ARK : " + notice.ARK) : "")); 

      return { title, images, image_preview, logo, nom, description, fonction, symbole, datesLieus, datesActivites, referenceArk };
    }
    default:
      return {};
  }
}

function jocondeMetaDescription(n) {
  const museum = n.NOMOFF || n.LOCA;
  const cleanAutor =
    n.AUTR &&
    String(n.AUTR)
      .split(/[;.]/)[0]
      .replace(/\(.*\)/, "")
      .replace("anonyme", "")
      .trim();
  const cleanRepr = n.REPR && String(n.REPR).replace(/\(.*\)/, "");
  if (n.DESC && cleanAutor && n.DESC.length < 100) {
    return `${n.DESC} par ${cleanAutor}`;
  } else if (cleanRepr && museum && n.TECH && n.TECH.length) {
    if (cleanAutor) {
      return `${cleanRepr} par ${cleanAutor} (${n.TECH[0]}) - ${museum}`;
    } else {
      return `${cleanRepr} (${n.TECH[0]}) - ${museum}`;
    }
  } else if (n.TITR && cleanAutor && museum) {
    return `${cleanAutor} : ${n.TITR} - ${museum}`;
  } else if (n.DESC.length >= 100 && cleanAutor) {
    return `${cleanAutor} : ${String(n.DESC).split(/[;.]/)[0]}`;
  } else if (n.DESC.length < 150 && cleanAutor) {
    return n.DESC;
  } else if (n.TICO) {
    return museum ? `${n.TICO} - ${museum}` : n.TICO;
  }
  return "";
}

function memoireMetaDescription(n) {
  const cleanAutor =
    n.AUTP &&
    String(n.AUTP.join(', '))
      .trim();
  if (n.EDIF && n.LEG && n.COM) {
    return `${n.EDIF} à ${n.COM} - ${n.LEG}${cleanAutor ? ` - Photo : ${cleanAutor}` : ""}`;
  } else if (n.LEG && n.LIEUCOR) {
    return `${n.LEG} - ${n.LIEUCOR}${cleanAutor ? ` - Photo : ${cleanAutor}` : ""}`;
  } else if (n.LEG) {
    return `${n.LEG}${cleanAutor ? ` - Photo : ${cleanAutor}` : ""}`;
  } else if (n.OBJT) {
    return `${n.OBJT}${cleanAutor ? ` - Photo : ${cleanAutor}` : ""}`;
  }
  return "";
}

const capitalizeFirstLetter = s => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

//Fonction d'export pdf d'une notice
export function printPdf(fileName){
  //const html2Canvas = require('html2canvas');
  const jsPDF = require("jspdf");
  hideButtons("none");
  showButtons("block");
  
  html2Canvas(document.querySelector("#__next"), { allowTaint: false, useCORS: true, x:0, y:0, scrollX: 0, scrollY:0 } )
  .then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    var doc = new jsPDF('p', 'mm');
    var position = 0;

    var imgWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight(); 
    var imgHeight = canvas.height * imgWidth / canvas.width;
    var heightLeft = imgHeight;    

    doc.page=1;
    doc.setFontSize(7);
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    doc.text(imgWidth-10,pageHeight-5, 'page ' + doc.page);
    doc.text(5,pageHeight-5, fileName);

    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      doc.page ++;
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      doc.text(imgWidth-10,pageHeight-5, 'page ' + doc.page);
      doc.text(5,pageHeight-5, fileName);
      heightLeft -= pageHeight;
    }

    hideButtons("block");
    showButtons("none");
    doc.save(fileName + '.pdf');
  });
}




//Fonction d'export pdf du panier de notices
//Les tâches prennant du temps, l'utilisation des promesses est devenue obligatoire pour cet export
export async function printBucketPdf(fileName, blocNumber){
  const html2Canvas = require('html2canvas');
  const jsPDF = require("jspdf");
  var doc = new jsPDF('p', 'mm');
  window.scrollTo(0, 0);

  //On cache les boutons que l'on ne veut pas afficher dans le pdf
  const btnList = document.getElementsByClassName("onPrintHide");
  hideButtons("none")

  //On récupère les blocs à imprimer en pdf
  let listOfBlocs = [];
  for(let i=0; i<blocNumber-1; i++){
    listOfBlocs.push(document.querySelector("#bloc_" + i))
  }

  await Promise.all(
    listOfBlocs.map( bloc => {
      return html2Canvas(bloc, { useCORS: true, backgroundColor: "#E6F3F2" } )
        .then(canvas => {
          return canvas;
        });
    })
  ).then( async canvasList => {
    await transformCanvasToPdf(doc, canvasList, fileName);
    hideButtons("block")
    doc.save(fileName + '.pdf'); 
  })    
}

async function transformCanvasToPdf(doc, canvasList, fileName){  
  doc.page=1;
  for(let i=0; i<canvasList.length; i++){
    const canvas = canvasList[i];
    if(i !== 0){
      doc.addPage();
    }
    makePdfPage(doc, canvas, fileName);
    doc.page ++;
  }
}

function makePdfPage(doc, canvas, fileName){
  var imgWidth = doc.internal.pageSize.getWidth();
  var pageHeight = doc.internal.pageSize.getHeight();
  const imgData = canvas.toDataURL('image/png');
  var imgHeight = canvas.height * imgWidth / canvas.width;
  doc.setFontSize(7);
  doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  doc.text(imgWidth-10,pageHeight-2, 'page ' + doc.page);
  doc.text(2,pageHeight-2, fileName);
  return doc;
}

//Fonction permettant de cacher certains éléments/boutons pour l'impression pdf
function hideButtons(show){
  const listToHide = document.getElementsByClassName("onPrintHide");
  //On cache ceux à cacher anciennement affichés
  for(let i=0; i<listToHide.length; i++){
    listToHide[i].style.display = show;
  }
}

function showButtons(show){
  const listToShow = document.getElementsByClassName("onPrintShow");
  //On affiche ceux anciennement cachés, maintenant affichés
  for(let i=0; i<listToShow.length; i++){
    listToShow[i].style.display = show;
  }
}
