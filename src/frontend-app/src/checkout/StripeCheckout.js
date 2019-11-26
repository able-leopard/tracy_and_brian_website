import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import StripeCheckoutForm from "./StripeCheckoutForm";

// documentation: https://stripe.com/docs/recipes/elements-react

class StripeCheckout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null
    };
  }
  render() {
    return (
      <StripeProvider apiKey="pk_test_CwlnViHKaxeXaEy0vW2O2PTL00LphAnP8w">
        <div className="example">
          <Elements>
            <StripeCheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}

export default StripeCheckout;
