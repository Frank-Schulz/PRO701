import React from "react";
import { Container, Row } from "react-bootstrap";
import "./Screen.css";

function MainScreen({ title, children }) {
  return (
    <div className="mainback">
      <Container>
        <Row>
          <div className="page main">
            {title && (
              <>
                <h1 className="heading">{title}</h1>
                <hr />
              </>
            )}
            {children}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default MainScreen;
