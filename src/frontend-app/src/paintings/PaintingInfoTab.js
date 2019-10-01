import React, { Component } from 'react';
import '../css/PaintingDetail.css'

class PaintingInfoTab extends Component {
    
    constructor(props){
        super(props);
        
    }
    
    render() { 

        const {title, style, medium, description, artist, price, size_measurements, available, completed_year} = this.props;
        
        return ( 
            <div className={'painting-info-tab-container'}>
                <h4>By {artist}, {completed_year}</h4>
                <p>{description}</p>

                <br/>
                <p>Style: {style}</p>
                <p>Medium: {medium}</p>

                <br/>
                <p>Size: {size_measurements}</p>
                <p>Availability: {available === true ? ("Yes") : ("Sorry not available")}</p>
                <p>Price: ${parseInt(price).toLocaleString()}</p>

                <h4>ADD TO CART</h4>

            </div>
            );
    }
}
 
export default PaintingInfoTab;