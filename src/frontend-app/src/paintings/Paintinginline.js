import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../css/Paintinginline.css'

// react-router-dom <Link> documentation: https://reacttraining.com/react-router/web/api/Link

class PaintingInline extends Component {
    
    constructor(props){
        super(props)
    };

    render() { 
    
        const {paintingItem} = this.props
        // console.log(paintingItem)
        // console.log(paintingItem.srcs[0].src)
        return ( 
            <div>
                {paintingItem !== undefined ? 
                <div className={"inline-container"}>     
                    <Link maintainScrollPosition={false} to={{
                        pathname:`/paintings/detail/${paintingItem.slug}`,
                        state:{fromDashboard: false}
                    }}>
                        <img    className={"inline-main-image"}
                                src={paintingItem.srcs[0].src}
                                /> 
                    </Link>
                    <h6>{paintingItem.title}</h6>
                    <a>{paintingItem.size_measurements}</a>   
                    <a>${parseInt(paintingItem.price).toLocaleString()}</a>

                 </div>
                : ""}
            </div>

         );
    }
}
 
export default PaintingInline;