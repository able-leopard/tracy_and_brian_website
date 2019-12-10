import React, { Component } from 'react';
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
                <h1>Welcome to our website. Great to meet you!</h1>
                <br/>
                <p>
                We are an artist couple located in Niagara Falls, Canada. 
                We have each been painting for over ten years and we enjoy sharing our artwork with the community.
                We like to look for beauty in every day objects. Our favourite styles include landscape, portraits, abstracts, people, and animals.
                </p>
                <br/>
                <p>
                Aside from painting we also like to travel, read and be involved in our community.
                We draw inpiration from visiting beautiful places and interacting with interesting people.   
                </p>
            </div>
         );
    }
}
 
export default Bio;