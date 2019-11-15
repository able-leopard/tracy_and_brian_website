import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import { createBrowserHistory } from 'history'

import PaintingList from './paintings/PaintingList';
import PaintingDetail from './paintings/PaintingDetail';
import PaintingCreate from './paintings/PaintingCreate';
import CartList from './cart/CartList'

import GuestEmailForm from './checkout/GuestEmailForm'
import AddressCreate from './checkout/AddressCreate'
import ShippingAddressForm from './checkout/ShippingAddressForm'
import BillingAddressForm from './checkout/BillingAddressForm'
import CheckoutSummary from './checkout/CheckoutSummary'
import StripeCheckout from './checkout/StripeCheckout'
import PurchaseComplete from './checkout/PurchaseComplete'


// go to edit t_and_b_paintings/urls.py if you wish to add more routes other than paintings

class App extends Component {

  render() {

    return (
      <BrowserRouter history={createBrowserHistory}>
        <Switch>   
        <Route exact path='/' component={PaintingList}/>
        <Route exact path='/paintings' component={PaintingList}/>
        <Route exact path='/paintings/create' component={PaintingCreate}/>
        <Route exact path='/paintings/detail/:slug' component={PaintingDetail}/>
        <Route exact path='/paintings/cart' component={CartList}/>
        <Route exact path='/checkout/guestemail' component={GuestEmailForm}/>
        <Route exact path='/checkout/shippingaddress' component={ShippingAddressForm}/>
        <Route exact path='/checkout/billingaddress' component={BillingAddressForm}/>
        <Route exact path='/checkout/summary' component={CheckoutSummary}/>
        <Route exact path='/checkout/payment' component={StripeCheckout}/>
        <Route exact path='/checkout/purchasecomplete' component={PurchaseComplete}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;

// remember to mannually npm install some of the dependencies again if you start over again

// to do:

/*

TO FIX:
- in list view - fix how to handle photos with not src, right now it throws an error
- Pagination, when it gets really small results it still renders 2 page numbers when messes things up

TO DO:

here are some good examples to use in the list view: 
https://www.artfinder.com/tinydebruin/page-8/sort-artist_order/
https://www.dailypaintworks.com/
https://www.saatchiart.com/paintings

In the detailed view, I like the Saatchi Art examples:
https://www.saatchiart.com/art/Painting-Readymade-Painting-7/298854/4255196/view


*/


/*
Pagination examples: 

https://stackoverflow.com/questions/44182132/unique-url-for-pagination-pages-in-react
https://github.com/gladchinda/build-react-pagination-demo

*/