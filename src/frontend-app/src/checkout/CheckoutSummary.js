import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import '../css/CheckoutForms.css'
import '../css/CheckoutSummary.css'

import { Redirect, Link } from 'react-router-dom';

import CartList from '../cart/CartList' 

class CheckoutSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      shipping_first_name: "",
      shipping_last_name: "",
      shipping_address_1: "",
      shipping_city: "",
      shipping_province_or_state: "",
      shipping_country: "",
      shipping_postal_or_zip_code: "",
      billing_first_name: "",
      billing_last_name: "",
      billing_address_1: "",
      billing_city: "",
      billing_province_or_state: "",
      billing_country: "",
      billing_postal_or_zip_code: "",
    };
  }

  // either adding or removing the item coming from data into cart send sending it to the REST api
  // Important to note that the paintingId must be in the products[] before sending the data through or else the backend won't know what to do
  // this.getCart() also gets called in this
  updateCheckoutSummary = (data) => {
    console.log(data)
    const endpoint = "/api/cart/checkout/"; 
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "POST",
        redirect: 'follow',
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        body: JSON.stringify(data),
        credentials: "include"
      };
      fetch(endpoint, lookupOptions)
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          this.setState({
              email: responseData.email,
              shipping_first_name: responseData.shipping_first_name,
              shipping_last_name: responseData.shipping_last_name,
              shipping_address_1: responseData.shipping_address_1,
              shipping_city: responseData.shipping_city,
              shipping_province_or_state: responseData.shipping_province_or_state,
              shipping_country: responseData.shipping_country,
              shipping_postal_or_zip_code: responseData.shipping_postal_or_zip_code,
              billing_first_name: responseData.billing_first_name,
              billing_last_name: responseData.billing_last_name,
              billing_address_1: responseData.billing_address_1,
              billing_city: responseData.billing_city,
              billing_province_or_state: responseData.billing_province_or_state,
              billing_country: responseData.billing_country,
              billing_postal_or_zip_code: responseData.billing_postal_or_zip_code,
            })
        })
        .then(responseData => {
          this.setState({
            successfulPOST: true,
          });
        })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };

  // getting all order summary info
  getOrderSummaryInfo = () => {
    const endpoint = `/api/cart/checkout/`;
    const csrfToken = cookie.load("csrftoken");

    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken
        },
        credentials: "include"
    };
      fetch(endpoint, lookupOptions)
        .then(response => {
          return response.json();
        })
        .then(responseData => {
            this.setState({
                email: responseData.email,
                shipping_first_name: responseData.shipping_first_name,
                shipping_last_name: responseData.shipping_last_name,
                shipping_address_1: responseData.shipping_address_1,
                shipping_city: responseData.shipping_city,
                shipping_province_or_state: responseData.shipping_province_or_state,
                shipping_country: responseData.shipping_country,
                shipping_postal_or_zip_code: responseData.shipping_postal_or_zip_code,
                billing_first_name: responseData.billing_first_name,
                billing_last_name: responseData.billing_last_name,
                billing_address_1: responseData.billing_address_1,
                billing_city: responseData.billing_city,
                billing_province_or_state: responseData.billing_province_or_state,
                billing_country: responseData.billing_country,
                billing_postal_or_zip_code: responseData.billing_postal_or_zip_code,
              })
          })
        .catch(error => {
          console.log("error", error);
          alert("An error occured, please try again later.");
        });
    }
  };


  routeChangePayment = () => {
    let myPath = `/checkout/payment`;
    this.props.history.push(myPath);
  }


  componentDidMount() {

    this.getOrderSummaryInfo() 
  }

  render() {

    const { email, 
            shipping_first_name, shipping_last_name, shipping_address_1, shipping_city, shipping_province_or_state, shipping_country, shipping_postal_or_zip_code,
            billing_first_name, billing_last_name, billing_address_1, billing_city, billing_province_or_state, billing_country, billing_postal_or_zip_code,
          } = this.state

    return (
      <form>
          <div>
            <h1>Order Summary</h1>  
            <br/>          
            <CartList billing_postal_or_zip_code={billing_postal_or_zip_code}/>

            <div className='all-contact-info'>
              <div className='email-info'>
                <h4>Contact Info </h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/guestemail`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>
                <table>
                  <tr>
                    <td>Email:</td>
                    <td>{email}</td>
                  </tr>
                </table>
              </div>

              <hr/>
              <div className='address-info'>
                <h4>Shipping Information</h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/shippingaddress`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>
                <table>
                  <tr>
                    <td>Name:</td>
                    <td>{shipping_first_name} {shipping_last_name}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>{shipping_address_1}</td>
                  </tr>
                  <tr>
                    <td>City:</td>
                    <td>{shipping_city}</td>
                  </tr>
                  <tr>
                    <td>Province/ State:</td>
                    <td>{shipping_province_or_state}</td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>{shipping_country}</td>
                  </tr>
                  <tr>
                    <td>Postal Code/ Zip Code:</td>
                    <td>{shipping_postal_or_zip_code}</td>
                  </tr>
                </table>
              </div>
              <hr/>

          
              <div className="address-info">
                <h4>Billing Information</h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/billingaddress`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>
                <table>
                  <tr>
                    <td>Name:</td>
                    <td>{billing_first_name} {billing_last_name}</td>
                  </tr>
                  <tr>
                    <td>Address:</td>
                    <td>{billing_address_1}</td>
                  </tr>
                  <tr>
                    <td>City:</td>
                    <td>{billing_city}</td>
                  </tr>
                  <tr>
                    <td>Province/ State:</td>
                    <td>{billing_province_or_state}</td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>{billing_country}</td>
                  </tr>
                  <tr>
                    <td>Postal Code/ Zip Code:</td>
                    <td>{billing_postal_or_zip_code}</td>
                  </tr>
                </table>
              </div>
              <hr/>
              <br/>
             
              <button 
              onClick={this.routeChangePayment}
              className="btn btn-primary"
              >
              Make Payment
              </button>
          
              <br/>
              <br/>
              <br/>
          </div>

        </div>
        
      </form>
  );
  }
}

export default CheckoutSummary;
