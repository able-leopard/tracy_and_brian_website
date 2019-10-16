import React, { Component } from 'react';
import CartForm from './CartForm'

class CartCreate extends Component {
  
  render() { 
    return ( 
      <div>
        <h1>Create New Cart</h1>
        <CartForm />
      </div>
     );
  }
}
 
export default CartCreate;

