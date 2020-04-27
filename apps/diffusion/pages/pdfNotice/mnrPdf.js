import Field from "../../src/notices/Field";
import mapping from "../../src/services/mapping";
import queryString from "query-string";
import { Document, Page, View, Text, Image, Link, StyleSheet, Font } from '@react-pdf/renderer';
import { styles } from "../pdfNotice/styles";

export function MnrPdf(notice, title){
  return(
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>{notice.TICO || notice.TITR}</Text>

        <View style={styles.content}>
          <View style={styles.body}>
            <View>
                <Field title={mapping.mnr.INV.label} content={notice.INV} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DOMN.label} separator="#" content={pdfLinks(notice.DOMN, "domn")} join=" ; " isPdf={true} link={true} />
                <Field title={mapping.mnr.AUTR.label} content={notice.AUTR} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.PAUT.label} content={notice.PAUT} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.ATTR.label} content={notice.ATTR} join=" ; " separator="#" isPdf={true} />
                <Field title={mapping.mnr.AATT.label} separator="#" content={notice.AATT} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.ECOL.label} content={notice.ECOL} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.TITR.label} separator="#" content={notice.TITR} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.ATIT.label} separator="#" content={notice.ATIT} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.PTIT.label} separator="#" content={notice.PTIT} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.AUTI.label} separator="#" content={notice.AUTI} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DENO.label} separator="#" content={notice.DENO} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.MILL.label} separator="#" content={notice.MILL} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.SCLE.label} separator="#" content={notice.SCLE} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.STYL.label} separator="#" content={notice.STYL} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.TECH.label} separator="#" content={notice.TECH} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DIMS.label} separator="#" content={notice.DIMS} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DESC.label} content={notice.DESC} join=" ; " separator="#" isPdf={true} />
                <Field title={mapping.mnr.INSC.label} content={notice.INSC} join=" ; " separator="#" isPdf={true} />
                <Field title={mapping.mnr.GENE.label} content={notice.GENE} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.HIST.label} content={notice.HIST} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.PROV.label} separator="#" content={notice.PROV} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.COMM.label} content={notice.COMM} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.CATE.label} separator="#" content={notice.CATE} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.OBSE.label} content={notice.OBSE} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.NUMS.label} content={notice.NUMS} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.MARQ.label} content={notice.MARQ} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.LOCA.label} separator="#" content={notice.LOCA} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.AFFE.label} content={notice.AFFE} separator="#" join=" ; " isPdf={true} />
                <Field title={mapping.mnr.EXPO.label} separator="#" content={notice.EXPO} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.BIBL.label} separator="#" content={notice.BIBL} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.NOTE.label} separator="#" content={notice.NOTE} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.RESUME.label} separator="#" content={notice.RESUME} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.ETAT.label} separator="#" content={notice.ETAT} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.SUITE.label} separator="#" content={notice.SUITE} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.REPR.label} separator="#" content={notice.REPR} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.SREP.label} content={notice.SREP} join=" ; " separator="#" isPdf={true} />
                <Field title={mapping.mnr.PREP.label} separator="#" content={notice.PREP} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DREP.label} separator="#" content={notice.DREP} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.DMAJ.label} separator="#" content={notice.DMAJ} join=" ; " isPdf={true} />
                <Field title={mapping.mnr.PHOT.label} content={notice.PHOT} separator="#" join=" ; " isPdf={true} />
            </View>
          </View>
          <View style={styles.seeMore}>
            { notice.VIDEO.length > 0 ?
            <View>
              <Image style={styles.image}
                src={"https://s3.eu-west-3.amazonaws.com/pop-phototeque-staging/" + notice.VIDEO[0]}
              />
            </View> : null}

            <View style={styles.aPropos}>
              <Text  style={styles.subtitle} >À propos de la notice</Text>
              <Field title={mapping.mnr.REF.label} content={notice.REF} separator="#" isPdf={true} />
              <Field title={mapping.mnr.BASE.label} content={notice.BASE} separator="#" isPdf={true} />
              <Field title={mapping.mnr.DMAJ.label} content={notice.DMAJ} separator="#" isPdf={true} />
              <Field title={"Contactez-nous"} content={notice.CONTACT || "francoise.gaborit@culture.gouv.fr"} separator="#" isPdf={true} />
            </View>
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
)}

function pdfLinks(value, name){
    if(value && value!==""){
      if(Array.isArray(value)){
        let links = value.map( val => {
          return {url:`https://www.pop.culture.gouv.fr/search/list?${queryString.stringify({ [name]: JSON.stringify([val]) })}`, val: val};
        });
        return links;
      }
      else{
        return {url: `https://www.pop.culture.gouv.fr/search/list?${queryString.stringify({ [name]: JSON.stringify([value]) })}`, val: value};
      }
    }
    return null;
};