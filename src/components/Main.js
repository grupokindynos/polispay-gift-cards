import React, { Component } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import countries from 'i18n-iso-countries'
import Header from './Header';

const benefits = [
    {
        id: 0,
        name: "All gift cards",
        icon: "",
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

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            selectedCountry: "MX",
            vouchersFromCountry: [],
            productsFromVoucher: [],
            showProductsFromCountry: true,
            selectedVoucher: {}
        };
    }

    componentDidMount() {
        this.getCountries();
        this.getVouchersFromCountry(this.state.selectedCountry);
    }

    async getCountries() {
        const response =
            await axios.get("https://hestia.polispay.com/open/voucher/list/countries");
        countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
        this.setState({
            countries: response.data
        });
    }

    groupBy(objectArray, property) {
        return objectArray.reduce((acc, obj) => {
            let key = obj[property]
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, [])
    }

    async getVouchersFromCountry(countryCode) {
        const response =
            await axios.get("https://hestia.polispay.com/open/voucher/list/products/" + countryCode);
        let vouchers = response.data;
        let vouchersAux = Object.values(this.groupBy(vouchers, 'provider_id'));
        let voucherList = [];
        vouchersAux.map((voucher) => (
            voucherList.push(voucher[0])
        ))
        console.log(voucherList)
        this.setState({
            vouchersFromCountry: voucherList
        });
    }

    async getProductsFromVoucher(voucher) {
        let products = voucher.variants;
        let productList = [];
        products.map((product) => (
            productList.push(product)
        ))
        this.setState({
            productsFromVoucher: productList,
            showProductsFromCountry: false,
            selectedVoucher: voucher,
        });
    }

    handleCountrySelect = (event) => {
        this.setState({
            selectedCountry: event.target.value,
            selectedProduct: "",
            showProductsFromCountry: true
        });
        this.getVouchersFromCountry(event.target.value);
    }

    handleBreadcrumbItemSelect = (country) => {
        this.setState({
            selectedCountry: country,
            selectedProduct: "",
            showProductsFromCountry: true
        });
        this.getVouchersFromCountry(country);
    }

    handleProductSelect = (voucher) => {
        this.setState({
            selectedProduct: voucher
        });
        this.getProductsFromVoucher(voucher);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <section className="container main">
                    <div className="row">
                        <ul className="col-lg-4 main__sidebar">
                            <li>
                                <form>
                                    <div className="form-group">
                                        <label>Countries</label>
                                        <select className="form-control" onChange={this.handleCountrySelect} value={this.state.selectedCountry}>
                                            {
                                                this.state.countries
                                                    .sort((a, b) => countries.getName(a, "en") < countries.getName(b, "en") ? -1 : 1)
                                                    .map((country) => {
                                                    return (
                                                        <option key={country} value={country}>{countries.getName(country, "en")}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                </form>
                            </li>
                            <div className="divider" />
                            <h3>Gift Cards</h3>
                            <Accordion defaultActiveKey="0">
                                <Accordion.Toggle as={Button} variant="link" eventKey="0" className="form__accordion">
                                    <div>
                                        <span>Benefits</span>
                                    </div>
                                    <div>
                                        <span className="fas-icon">chevron-down</span>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <div>
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
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </ul>
                        <div className="col-lg-8">
                            <div className="row">
                                <Breadcrumb>
                                    <Breadcrumb.Item href="#">Gift Cards</Breadcrumb.Item>
                                    <Breadcrumb.Item href="#" onClick={e => this.handleBreadcrumbItemSelect(this.state.selectedCountry)}>
                                        {this.state.selectedCountry}
                                    </Breadcrumb.Item>
                                    { this.state.selectedProduct &&
                                        !this.state.showProductsFromCountry && 
                                            <Breadcrumb.Item active href="#">
                                                {this.state.selectedProduct.provider_name}
                                            </Breadcrumb.Item>
                                    }
                                </Breadcrumb>
                            </div>

                            <div className="row">
                                {         
                                    this.state.showProductsFromCountry &&     
                                        this.state.vouchersFromCountry.map((voucher) => {
                                            return (
                                                <div className="col-md-4 abs-center" key={voucher.product_id}>
                                                    <div className="main__card" onClick={e => this.handleProductSelect(voucher)}>
                                                        <div className="main__card__img">
                                                            <img src={voucher.image} alt={voucher.name} />
                                                        </div>
                                                        <p>{voucher.provider_name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                }
                                
                                { 
                                    !this.state.showProductsFromCountry &&
                                        this.state.productsFromVoucher.map((product) => {
                                            let currencyValue = product.currency==="" ? 'EUR' : product.currency;
                                            const formatter = new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: currencyValue,
                                                minimumFractionDigits: 2
                                            })
                                            return (
                                                <div className="col-md-4 abs-center" key={this.state.selectedVoucher.product_id}>
                                                    <div className="main__card">
                                                        <div className="main__card__img">
                                                            <img src={this.state.selectedVoucher.image} alt={this.state.selectedVoucher.name} />
                                                        </div>
                                                        <p className="abs-center">{this.state.selectedVoucher.provider_name}</p>
                                                        <p className="abs-center">{product.currency}</p>
                                                        <p className="abs-center">{formatter.format(product.value/100)}</p>
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

export default Main;
