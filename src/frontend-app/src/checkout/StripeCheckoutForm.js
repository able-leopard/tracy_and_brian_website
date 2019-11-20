import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import cookie from "react-cookies";
import { Redirect  } from 'react-router-dom';

import '../css/StripeCheckoutForm.css'

class StripeCheckoutForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        order_id: "",
        email: "",
        name: "",
        amount: "",
        billing_address_1: "",
        billing_city: "",
        billing_province_or_state: "",
        billing_country: "",
        billing_postal_or_zip_code: "",
        total: "",
        painting_info: "",
        successfulPOST: false,
        disableFormSubmission: false,
        failedSubmissionAttempted: false,
      }
    }


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
                  order_id: responseData.order_id, 
                  email: responseData.email,
                  total: responseData.total,
                  billing_address_1: responseData.billing_address_1,
                  billing_city: responseData.billing_city,
                  billing_province_or_state: responseData.billing_province_or_state,
                  billing_country: responseData.billing_country,
                  billing_postal_or_zip_code: responseData.billing_postal_or_zip_code,
                  painting_info: responseData.painting_info
                })
            })
          .catch(error => {
            console.log("error", error);
            alert("An error occured, please try again later.");
          });
      }
    };

    // This function creates the stripe token as well as sends a bunch of other relavent data to the backend via a POST request
    sendPaymentInfo = async () => {
      

        /* 
        disable form submission after first click to make sure we don't double charge customers
        but if customers makes a failed submission attempt, we have to enable to form to let them try again
        */
        this.state.failedSubmissionAttempted === false ? this.setState({disableFormSubmission: true})
        : this.setState({disableFormSubmission: false})
      if (this.state.disableFormSubmission === false && this.state.total > 0 === true ) {


        this.setState({failedSubmissionAttempted: false})

        // this data gets send into the stripe dashboard
        let {token} = await this.props.stripe.createToken({
          name: this.state.name,
          currency: 'cad',
          address_line1: this.state.billing_address_1,
          address_city: this.state.billing_city,
          address_state: this.state.billing_province_or_state,
          address_zip: this.state.billing_postal_or_zip_code,
          address_country: this.state.billing_country==="Canada" ? "CA" 
                          :this.state.billing_country==="United States" ? "US" 
                          : ""
        });

        // this data gets send over to the backend
        let total           = this.state.total
        let email           = this.state.email
        let order_id        = this.state.order_id
        let painting_info   = this.state.painting_info

        const csrfToken = cookie.load("csrftoken");
        const endpoint = "/api/cart/checkout/";
      
        if (csrfToken !== undefined) {
          let lookupOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({token, total, email, order_id, painting_info}),
            credentials: "include"
          };
          console.log(token);
          console.log(total);
          console.log(email);
          let response = await fetch(endpoint, lookupOptions);
          console.log(response)
          if (response.ok) 
            {
              this.setState({successfulPOST: true}), 
              console.log("made successful post");
            }
          else {
            this.setState({failedSubmissionAttempted: true})
          }
        }
      }
      else {
        ""
      }
    
    }

    handleInputChange = event => {
      event.preventDefault();
      // console.log(event.target.name, event.target.value);
      this.setState({
        [event.target.name]: event.target.value
      });
    };

    // this is to prevent the user from submitting the form twice and double paying
    disableButton = () => {
      this.setState({
        buttonIsDisabled: true
      })
    }

    handleSubmit = (e) => {
      e.preventDefault();  
      this.sendPaymentInfo()        
    }
    
    componentDidMount() {

      this.getOrderSummaryInfo() 
    }
  
    render() {

      const {name, total, successfulPOST} = this.state;

      if (successfulPOST===true) return (
          <Redirect push to={{ pathname: '/checkout/purchasecomplete'}} />
          )

      return (
        <main className="container">
          <form 
            onSubmit={this.handleSubmit}
            className="form-group mt-3 border border-primary rounded shadow-1g p-3"
            > 
            <h4>Complete Your Purchase</h4>
            <br/>
            <lable>Card Holder Name</lable>
            <input 
              type="text"
              id="name"
              name="name"
              value={name}
              className="input-group my-1 p-1 border border-dark"
              onChange={this.handleInputChange}
            />
            <lable>Amount</lable>
            <a className="input-group my-1 p-1 border border-dark">$ {total} CAD</a>
            <br/>
          

            <label>CC Number -- Exp. Date -- CVC</label>
            <CardElement />
           
            <br/>
            <button 
              className="btn btn-primary border border-dark shadow"
              >
              Purchase
            </button>
          </form>
        </main>
      );
    }
  }
  
  export default injectStripe(StripeCheckoutForm);