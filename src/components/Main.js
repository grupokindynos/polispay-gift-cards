import React, { Component } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import countries from 'i18n-iso-countries'
import Header from './Header';
import { css } from "@emotion/core";
import PulseLoader from "react-spinners/PulseLoader";

const override = css`display: block;margin: 0 auto;border-color: #2dab66;`;
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
            vouchersFromCountry: [],
            productsFromVoucher: [],
            selectedCountry: "MX",
            selectedProduct: "",
            selectedVoucher: {},
            selectedBenefit: "",
            showBenefits: false,
            showLoadingCircle: false,
            showEmptyMessage: false,
            showProductsFromVoucher: true,
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
        this.setState({
            showLoadingCircle: true,
            vouchersFromCountry: [],
            showEmptyMessage: false,
        })
        const response =
            await axios.get("https://hestia.polispay.com/open/voucher/list/products/" + countryCode);
        let vouchers = response.data;
        let voucherList = [];
        
        if (this.state.selectedBenefit === "Allgiftcards" || this.state.selectedBenefit === "") {
            let vouchersAux = Object.values(this.groupBy(vouchers, 'provider_id'));
            vouchersAux.map((voucher) => (
                voucherList.push(voucher[0])
            ))
            this.setState( {selectedBenefit: ""} )
        } else {
            voucherList = Object.values(vouchers).filter((voucher) => voucher.benefits[this.state.selectedBenefit] === true);
        }

        if (voucherList.length === 0) {
            this.setState( {showEmptyMessage: true} )
        } else {
            voucherList.sort((a, b) => a.provider_name.toLowerCase() < b.provider_name.toLowerCase() ? -1 : 1)
        }
        this.setState({
            vouchersFromCountry: voucherList,
            selectedProduct: "",
            selectedCountry: countryCode,
            showBenefits: true,
            showLoadingCircle: false,
        });
    }
    async getProductsFromVoucher(voucher) {
        this.setState({
            showLoadingCircle: true,
            productsFromVoucher: [],
        })
        let products = voucher.variants;
        let productList = [];
        products.map((product) => (
            productList.push(product)
        ))
        this.setState({
            productsFromVoucher: productList,
            selectedVoucher: voucher,
            showLoadingCircle: false,
            showProductsFromVoucher: false,
            showBenefits: true,
        });
    }
    handleCountrySelect = (event) => {
        this.setState({
            selectedCountry: event.target.value,
            selectedProduct: "",
            selectedBenefit: "",
            showBenefits: false,
            showProductsFromVoucher: true,
        });
        this.getVouchersFromCountry(event.target.value);
    }
    handleBreadcrumbCountrySelect = (country) => {
        this.setState({
            selectedCountry: country,
            selectedProduct: "",
            selectedBenefit: "",
            showBenefits: false,
            showProductsFromVoucher: true,
        });
        this.getVouchersFromCountry(country);
    }
    handleProductSelect = (voucher) => {
        this.setState({
            selectedProduct: voucher,
            showBenefits: false,
        });
        this.getProductsFromVoucher(voucher);
    }
    handleBenefitSelected = (benefit) => {
        this.setState({
            selectedBenefit: benefit,
            selectedProduct: "",
            showBenefits: true,
            showProductsFromVoucher: true
        })
        this.getVouchersFromCountry(this.state.selectedCountry);
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
                                                    .sort((a, b)   => countries.getName(a, "en") < countries.getName(b, "en") ? -1 : 1)
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
                                                    <li key={benefit.id} onClick={e => this.handleBenefitSelected(benefit.name.replaceAll(" ",""))}>
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
                                    <Breadcrumb.Item href="#" onClick={e => this.handleBreadcrumbCountrySelect(this.state.selectedCountry)}>
                                        {this.state.selectedCountry}
                                    </Breadcrumb.Item>
                                    {
                                        this.state.selectedBenefit &&
                                            this.state.showProductsFromVoucher && 
                                                this.state.selectedBenefit !== "Allgiftcards" &&
                                                    <Breadcrumb.Item href="#">
                                                        {this.state.selectedBenefit}
                                                    </Breadcrumb.Item>
                                    }
                                    { 
                                        this.state.selectedProduct &&
                                            !this.state.showProductsFromVoucher && 
                                                <Breadcrumb.Item active href="#">
                                                    {this.state.selectedProduct.provider_name}
                                                </Breadcrumb.Item>
                                    }
                                </Breadcrumb>
                            </div>
                            <div className="row">
                                <PulseLoader
                                    css={override}
                                    size={12}
                                    margin={6}
                                    color={"#2dab66"}
                                    loading={this.state.showLoadingCircle}
                                />
                                {
                                    this.state.showEmptyMessage &&
                                    <div className="form__accordion">
                                        <h4>There are no products to show in this category</h4>
                                    </div>
                                }
                                {         
                                    !this.state.showEmptyMessage && 
                                        this.state.showProductsFromVoucher &&     
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
                                    !this.state.showProductsFromVoucher &&
                                        this.state.productsFromVoucher.map((product) => {
                                            let currencyValue = product.currency==="" ? 'EUR' : product.currency;
                                            const formatter = new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: currencyValue,
                                                minimumFractionDigits: 2
                                            })
                                            return (
                                                <div className="col-md-4 abs-center" key={product.variant_id}>
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