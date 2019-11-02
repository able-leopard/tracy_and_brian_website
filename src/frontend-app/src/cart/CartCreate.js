import React, { Component } from 'react';
import CartForm from './CartForm'

class CartCreate extends Component {
  
  render() { 
    
    const {paintingId, slug} = this.props

    return ( 
      <div>
        <h1>Create New Cart</h1>
        <CartForm paintingId={paintingId}
                  slug={slug} />
      </div>
     );
  }
}
 
export default CartCreate;

