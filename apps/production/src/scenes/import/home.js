import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { connect } from "react-redux";

import "./home.css";

class Import extends React.Component {
  renderTiles(tiles) {
    return tiles.map(({ url, name, image }, i) => {
      return (
        <Col md="4" sm="6" className="box text-center" key={i}>
          <Link style={{ textDecoration: "none" }} to={url}>
            <div className="tile">
              <img src={image} alt="dummy image" className="img-fluid" />
              <div className="caption">
                <div className="name">{name}</div>
              </div>
            </div>
          </Link>
        </Col>
      );
    });
  }

  renderOldImports(group){
    if(group === "admin"){
      return (
        <Col className="m-4 text-center">
          <Link to="/import/list">Consultez les anciens imports</Link>
        </Col>
      );
    }
  }

  render() {
    const image = require("../../assets/outbox.png");
    const group = this.props.group;

    let listRoutes = [];
    if(group === "admin"){
      listRoutes = [{ url: "/import/joconde", name: "Joconde", image },
      { url: "/import/mnr", name: "MNR", image },
      { url: "/import/inv", name: "Inventaire", image },
      { url: "/import/mh", name: "Monuments historiques", image },
      { url: "/import/memoire", name: "MAP (Service Archives Photos)", image },
      { url: "/import/museo", name: "Museo", image }];
    }
    else {
      if(this.props.authorizedImports){
        let authorizedImports = this.props.authorizedImports;
        if(authorizedImports.includes("joconde")){
          listRoutes.push({ url: "/import/joconde", name: "Joconde", image });
        }
        if(authorizedImports.includes("mnr")){
          listRoutes.push({ url: "/import/mnr", name: "MNR", image });
        }
        if(authorizedImports.includes("inv")){
          listRoutes.push({ url: "/import/inv", name: "Inventaire", image });
        }
        if(authorizedImports.includes("mh")){
          listRoutes.push({ url: "/import/mh", name: "Monuments historiques", image });
        }
        if(authorizedImports.includes("map")){
          listRoutes.push({ url: "/import/memoire", name: "MAP (Service Archives Photos)", image });
        }
        if(authorizedImports.includes("museo")){
          listRoutes.push({ url: "/import/museo", name: "Museo", image });
        }
      }
    }
    


    return (
      <Container>
        <div className="home-import">
          <div className="subtitle">Je souhaite importer</div>
          <Row>
            {this.renderTiles(listRoutes)}
          </Row>
          <Row>
            {this.renderOldImports(group)}
          </Row>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const { group } = Auth.user;
  return { group };
};

export default connect(
  mapStateToProps,
  {}
)(Import);
