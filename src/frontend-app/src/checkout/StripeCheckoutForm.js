import React, { Component } from 'react';
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';

class StripeCheckoutForm extends Component {
    constructor(props) {
      super(props);
      
    }
  
    async submit(ev) {
      // User clicked submit
    }
  
    render() {
      return (
        <div className="checkout">
          <p>Would you like to complete the purchase?</p>
          <CardElement />
          <button onClick={this.submit}>Purchase</button>
        </div>
      );
    }
  }
  
  export default injectStripe(StripeCheckoutForm);