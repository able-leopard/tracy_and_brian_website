import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from "react-cookies";


import '../css/Bio.css'

// react-router-dom <Link> documentation: https://reacttraining.com/react-router/web/api/Link

class Bio extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            bio: "",
        };
    };

    getBioPhotos = () => {
        const endpoint = `/api/bio/`;
        const csrfToken = cookie.load("csrftoken");
    
        if (csrfToken !== undefined) {
          let lookupOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken
            },
            credentials: "include"
        };
          fetch(endpoint, lookupOptions)
            .then(response => {
              return response.json();
            })
            .then(responseData => {
              console.log(responseData)
              this.setState({
                bio: responseData[0],
              });
            })
            .catch(error => {
              console.log("error", error);
              alert("An error occured, please try again later.");
            });
        }
      };

      componentDidMount() {
       this.getBioPhotos()
      }
    

    render() { 
        
        const {bio} = this.state
        console.log(bio['src'])
       
        return (
            
            <div className='bio-section'>
       
                <img    className={"bio-img"}
                        src={bio['src']}
                />
                <br/>
                <h1>Our Story</h1>
                <br/>
                <p>
                Brian is an award-winning abstract painter who comes from a long line of artists and 
                grew up in Montreal, Canada. She worked for many years as a graphic designer, ensconced in a life 
                of technology and marketing. In 2011, she gave up a regular paycheque to pursue her love of painting 
                full time. She now has a studio an hour north of Montreal and is represented by galleries in Canada 
                and the States. 
                </p>
                <br/>
                <p>
                Claire launched her collection of women's art apparel, Claire Desjardins by Carré Noir 
                in early 2019. It is currently being sold in about 500 boutiques across North America (click here 
                to find stores in your area). She also sells her original artworks on her website.
                </p>
                <br/>
                <p>
                Claire launched her collection of women's art apparel, Claire Desjardins by Carré Noir 
                in early 2019. It is currently being sold in about 500 boutiques across North America (click here 
                to find stores in your area). She also sells her original artworks on her website.
                </p>
            </div>
         );
    }
}
 
export default Bio;