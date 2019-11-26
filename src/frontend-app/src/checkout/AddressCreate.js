import React, { Component } from "react";
import ShippingAddressForm from "./ShippingAddressForm";
import BillingAddressForm from "./BillingAddressForm";

class AddressCreate extends Component {
  render() {
    return (
      <div>
        <h1>Shipping Address</h1>
        <ShippingAddressForm />

        <h1>Billing Address</h1>
        <BillingAddressForm />
      </div>
    );
  }
}

export default AddressCreate;
