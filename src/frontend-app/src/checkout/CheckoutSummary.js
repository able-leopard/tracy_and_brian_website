import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";
import '../css/GuestEmailForm.css'
import { Redirect, Link } from 'react-router-dom';

import CartList from '../cart/CartList' 

class CheckoutSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      shipping_address_1: "",
      shipping_city: "",
      shipping_province_or_state: "",
      shipping_country: "",
      shipping_postal_or_zip_code: "",
      billing_address_1: "",
      billing_city: "",
      billing_province_or_state: "",
      billing_country: "",
      billing_postal_or_zip_code: "",
      successfulPOST: false,
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
              shipping_address_1: responseData.shipping_address_1,
              shipping_city: responseData.shipping_city,
              shipping_province_or_state: responseData.shipping_province_or_state,
              shipping_country: responseData.shipping_country,
              shipping_postal_or_zip_code: responseData.shipping_postal_or_zip_code,
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

  // getting the items currently in cart placing them in this.state.currentCart
  getGuestEmail = () => {
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
                shipping_address_1: responseData.shipping_address_1,
                shipping_city: responseData.shipping_city,
                shipping_province_or_state: responseData.shipping_province_or_state,
                shipping_country: responseData.shipping_country,
                shipping_postal_or_zip_code: responseData.shipping_postal_or_zip_code,
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

  handleEmailChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let data = this.state;

    if (data !== undefined){
        (
          this.updateGuestEmail(data)
        )
    } else {
        ""
    }
  };

  resetSucessfulPOST = () => {
      this.setState({
        successfulPOST: false,
      })
  }

  tiggerSucessfulPOST = () => {
    this.setState({
      successfulPOST: true,
    })
}


  componentDidMount() {

    // getting the items currently in the cart and storing in this.state.currentCart
    this.resetSucessfulPOST()
    this.getGuestEmail() 
  }


  render() {

    const { email, 
            shipping_address_1, shipping_city, shipping_province_or_state, shipping_country, shipping_postal_or_zip_code,
            billing_address_1, billing_city, billing_province_or_state, billing_country, billing_postal_or_zip_code,
            successfulPOST} = this.state

    console.log(successfulPOST)

    // redirect to shipping page after successful POST of email
    if (successfulPOST === true)  

      // remember to use push to or else you lose the history and won't be able to go back to prev page
      // https://stackoverflow.com/questions/47956592/going-back-from-a-redirect-tag-react-router
      return <Redirect push to={{ pathname: '/checkout/shippingaddress'}} />
      
    else

      return (
        <form onSubmit={this.handleSubmit}>
            <div>            
                <CartList billing_postal_or_zip_code={billing_postal_or_zip_code}/>

                <h4>Contact Info </h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/guestemail`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>
                Email: {email}

                <hr/>

                <h4>Shipping Information</h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/shippingaddress`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>

                Address: {shipping_address_1}
                City: {shipping_city}
                Province/ State: {shipping_province_or_state}
                Country: {shipping_country}
                Postal Code/ Zip Code: {shipping_postal_or_zip_code}


                <hr/>


                <h4>Billing Information</h4>
                <Link maintainScrollPosition={false} to={{
                    pathname:`/checkout/billingaddress`,
                    state:{fromDashboard: false}
                }}>
                    <h6>Edit </h6>
                </Link>
                Address: {billing_address_1}
                City: {billing_city}
                Province/ State: {billing_province_or_state}
                Country: {billing_country}
                Postal Code/ Zip Code: {billing_postal_or_zip_code}
            </div>
          
        </form>
    );
  }
}

export default CheckoutSummary;
