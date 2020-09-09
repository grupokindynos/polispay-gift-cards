import React from 'react';
import './App.css';
import { Navbar, Nav, NavDropdown, Form } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/img/logo.png';

const countries = [
  {
    id: 0,
    name: "Germany"
  },
  {
    id: 1,
    name: "Mexico"
  },
  {
    id: 2,
    name: "United States"
  },
];

const categories = [
  {
    id: 1,
    src: "",
    icon: "cash-register",
    name: "Ecomerce"
  },
  {
    id: 2,
    src: "",
    icon: "utensils",
    name: "Food"
  },
  {
    id: 3,
    src: "",
    icon: "mobile-alt",
    name: "Mobile"
  },
  {
    id: 4,
    src: "",
    icon: "gamepad",
    name: "Game"
  },
];

const giftCards = [
  {
    id: 1,
    src: require("./assets/img/gift-card.png"),
    title: "Amazon"
  },
  {
    id: 2,
    src: require("./assets/img/gift-card.png"),
    title: "Amazon"
  },
  {
    id: 3,
    src: require("./assets/img/gift-card.png"),
    title: "Amazon"
  },
  {
    id: 4,
    src: require("./assets/img/gift-card.png"),
    title: "Amazon"
  },
  {
    id: 5,
    src: require("./assets/img/gift-card.png"),
    title: "Amazon"
  },
]
function App() {
  return (
    <div className="App">
      <Navbar className="nav" expand="lg">
        <Navbar.Brand href="#home">
          <img className="nav__brand" src={logo} alt="" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <section className="container main">
        <div className="row">
          <ul className="col-lg-4 main__sidebar">
            <li>
              <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Country</Form.Label>
                  <Form.Control as="select">
                    {
                      countries.map((country) => {
                        return(
                        <option key={country.id}>{country.name}</option>
                        );
                      })
                    }
                  </Form.Control>
                </Form.Group>
              </Form>
            </li>
            <div className="divider"></div>
            <h3>Gift Cards</h3>
            {
              categories.map((category) => {
                return (
                  <li key={category.id}>
                    <span className="fas-icon">{category.icon}</span>
                    <span>{category.name}</span>
                  </li>
                );
              })
            }
          </ul>
          <div className="col-lg-8">
            <div className="row">
              <Breadcrumb>
                <Breadcrumb.Item href="#">Gift Cards</Breadcrumb.Item>
                <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
                  Mexico
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Ecomerce</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="row">
              {
                giftCards.map((giftCard) => {
                  return (
                    <div className="col-md-4 abs-center" key={giftCard.id}>
                      <div className="main__card">
                        <img src={giftCard.src} alt="" />
                        <p>{giftCard.title}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </section>
      <section className="footer">
        <div className="container"></div>
      </section>
    </div>
  );
}

export default App;
