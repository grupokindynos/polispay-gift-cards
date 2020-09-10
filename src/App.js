import React, { Component } from 'react';
import './App.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/img/logo.png';
import axios from 'axios';

const benefits = [
  {
    id: 0,
    name: "All gift cards",
    icon: ""
  }, {
    id: 1,
    name: "Data",
    icon: "globe"
  },
  {
    id: 2,
    name: "Digital Product",
    icon: "mobile-alt"
  },
  {
    id: 3,
    name: "Gaming",
    icon: "gamepad"
  },
  {
    id: 4,
    name: "Long Distance",
    icon: "globe-americas"
  },
  {
    id: 5,
    name: "Minutes",
    icon: "phone-volume"
  },
  {
    id: 6,
    name: "Mobile",
    icon: "mobile"
  },
  {
    id: 7,
    name: "TV",
    icon: "tv"
  },
  {
    id: 8,
    name: "Utility",
    icon: "file-invoice"
  },

];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      selectedCountry: "MX",
      vouchersFromCountry: []
    };
  }

  componentDidMount() {
    this.getCountries();
    this.getVouchersFromCountry(this.state.selectedCountry);
  }

  async getCountries() {
    const response =
      await axios.get("https://hestia.polispay.com/open/voucher/list/countries");
/*       let countryCodes = response.data;
      for(let countryCode of countryCodes){

      } */
    this.setState({
      countries: response.data
    });
  }

  async getVouchersFromCountry(countryCode) {
    const response =
      await axios.get("https://hestia.polispay.com/open/voucher/list/products/" + countryCode);
    this.setState({
      vouchersFromCountry: response.data
    });
  }

  handleCountrySelect = (event) => {
    this.setState({
      selectedCountry: event.target.value
    });
    this.getVouchersFromCountry(event.target.value);
  }

  render() {
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
                <form>
                  <div className="form-group">
                    <label>Countries</label>
                    <select className="form-control" onChange={this.handleCountrySelect}>
                      {
                        this.state.countries.map((country) => {
                          return (
                            <option key={country} value={country}>{country}</option>
                          );
                        })
                      }
                    </select>
                  </div>
                </form>
              </li>
              <div className="divider" />
              <h3>Gift Cards</h3>
              {
                benefits.map((benefit) => {
                  return (
                    <li key={benefit.id}>
                      <span className="fas-icon">{benefit.icon}</span>
                      <span>{benefit.name}</span>
                    </li>
                  );
                })
              }
            </ul>
            <div className="col-lg-8">
              <div className="row">
                <Breadcrumb>
                  <Breadcrumb.Item href="#">Gift Cards</Breadcrumb.Item>
                  <Breadcrumb.Item active href="#">
                    {this.state.selectedCountry}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="row">
                {
                  this.state.vouchersFromCountry.map((voucher) => {
                    return (
                      <div className="col-md-4 abs-center" key={voucher.product_id}>
                        <div className="main__card">
                          <div className="main__card__img">
                            <img src={voucher.image} alt={voucher.name} />
                          </div>
                          <p>{voucher.provider_name}</p>
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

        </section>
      </div>
    );
  }
}

export default App;
