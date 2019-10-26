import React, { Component } from 'react';

class StripeCheckout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null
        };
        
      }
    render() { 
        return ( 
            <main className="container my-5">
                <h1 className="text-primary text-center">Hello {this.state.name}!</h1>
            </main>

         );
    }
}
 
export default StripeCheckout;