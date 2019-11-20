import React, { Component } from 'react';
import CartForm from './CartForm'

class CartCreate extends Component {
  
  render() { 
    
    const {paintingId, slug} = this.props

    return ( 
      <div>
        <CartForm paintingId={paintingId}
                  slug={slug} />
      </div>
     );
  }
}
 
export default CartCreate;

