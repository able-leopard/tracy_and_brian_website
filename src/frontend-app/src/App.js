import React, { Component } from "react";
import "./App.css";
import cookie from "react-cookies";

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Navbar, Nav } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/fontawesome-free-solid";

import PaintingList from "./paintings/PaintingList";
import PaintingDetail from "./paintings/PaintingDetail";
import PaintingCreate from "./paintings/PaintingCreate";
import CartList from "./cart/CartList";

import GuestEmailForm from "./checkout/GuestEmailForm";
import ShippingAddressForm from "./checkout/ShippingAddressForm";
import BillingAddressForm from "./checkout/BillingAddressForm";
import CheckoutSummary from "./checkout/CheckoutSummary";
import StripeCheckout from "./checkout/StripeCheckout";
import PurchaseComplete from "./checkout/PurchaseComplete";

import Bio from "./bio/Bio";

// go to edit t_and_b_paintings/urls.py if you wish to add more routes other than paintings

class App extends Component {
  // some code for React Nav Bar: https://react-bootstrap.github.io/components/navbar/

  render() {
    return (
      <BrowserRouter history={createBrowserHistory}>
        <Navbar className="my-nav" bg="light" expand="lg" fixed="top">
          <Navbar.Brand>Tracy and Brian's Website</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/bio">Meet Tracy and Brian</Nav.Link>
            </Nav>
            <Nav className="mr-left">
              <Nav.Link href="/paintings/cart">
                <FontAwesomeIcon icon={faShoppingCart} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br />
        <br />
        <hr />
        <Switch>
          <Route exact path="/" component={PaintingList} />
          <Route exact path="/paintings" component={PaintingList} />
          <Route exact path="/paintings/create" component={PaintingCreate} />
          <Route
            exact
            path="/paintings/detail/:slug"
            component={PaintingDetail}
          />
          <Route exact path="/paintings/cart" component={CartList} />
          <Route exact path="/checkout/guestemail" component={GuestEmailForm} />
          <Route
            exact
            path="/checkout/shippingaddress"
            component={ShippingAddressForm}
          />
          <Route
            exact
            path="/checkout/billingaddress"
            component={BillingAddressForm}
          />
          <Route exact path="/checkout/summary" component={CheckoutSummary} />
          <Route exact path="/checkout/payment" component={StripeCheckout} />
          <Route
            exact
            path="/checkout/purchasecomplete"
            component={PurchaseComplete}
          />
          <Route exact path="/bio" component={Bio} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
