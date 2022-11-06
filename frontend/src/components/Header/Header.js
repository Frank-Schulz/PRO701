import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "./Header.css";

const Header = () => {
  // const navigate = useNavigate();

  return (
    <Navbar className="navbar navbar-expand-lg navbar-light bg-light">
      <Container>
        <Link to="/">
          <Navbar.Brand>
            Working with Big Data - Ancestry Example
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header;
