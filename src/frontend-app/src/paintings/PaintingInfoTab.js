import React, { Component } from 'react';
import CartCreate from "../cart/CartCreate"
import CartForm from '../cart/CartForm'

import '../css/PaintingDetail.css'

class PaintingInfoTab extends Component {
    
    constructor(props){
        super(props);
        
    }
    
    render() { 

        const {id, slug, title, style, medium, description, artist, price, size_measurements, available, completed_year} = this.props;
        
        return ( 
            <div className={'painting-info-tab-container'}>
                <h4>By {artist}, {completed_year}</h4>

                <br/>
                <p>Medium: {medium}</p>
                <p>Size: {size_measurements}</p>
                <br/>                  
                <p>{description}</p>
                <hr/>     
                <p>Price: ${parseInt(price).toLocaleString()} CAD</p>
                <p>Shipping Included</p>
                <CartForm 
                    paintingId={id}
                    slug={slug} 
                    />

            </div>
            );
    }
}
 
export default PaintingInfoTab;