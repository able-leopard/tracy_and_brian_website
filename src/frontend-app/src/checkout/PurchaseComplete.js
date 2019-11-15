import React, { Component } from 'react';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import cookie from "react-cookies";

class PurchaseComplete extends Component {
    constructor(props) {
      super(props);
      this.state = {

      }
    }

  
    render() {

        return <h1>Purchase Complete. Thank you!</h1>;

    }
  }
  
  export default PurchaseComplete;