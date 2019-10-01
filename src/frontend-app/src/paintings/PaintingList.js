import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";

import { Link } from "react-router-dom";
import PaintingInline from "./Paintinginline";
import PaintingPagination from "./PaintingPagination";
import PaintingSearchFilter from "./PaintingSearchFilter";


class PaintingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paintings: [],
      next: null,
      previous: null,
      author: false,
      totalItemsCount: 0,      //this is the count for the total number of results coming from the Django REST API   
      totalPages: null,
      currentApiEndpoint: `/api/paintings/?`,   
    };
  }

  onFilterClick = (newApiEndpoint) => {
      
    let endpoint = newApiEndpoint
    // this.setState({
    //   currentApiEndpoint: endpoint
    // })
    // console.log(this.state.currentApiEndpoint)
    console.log(endpoint)
    this.loadPaintings(endpoint)
  }; 

  // loads the endpoint that is passed through the argument
  onPageClick = (apiEndpoint) => {
    const myEndpoint = apiEndpoint

    if (myEndpoint !== null || myEndpoint !== undefined){
      this.loadPaintings(myEndpoint)
    }

  }

  loadPaintings = (clickedEndpoint) => {
    // console.log(clickedEndpoint)
 
    //notice the endpoint is going to a relative request, (relative to where the final javascript built code will be)
    //note that because this is relative, when you render in localhost:3000 this may run into some issues

    let endpoint = this.state.currentApiEndpoint
 
    // have to change this endpoint here to match the pagination
    if (clickedEndpoint !== undefined){
        endpoint = clickedEndpoint
    }


    // this goes into the options argument in fetch(url, options)
    let lookupOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }; 
    
    const csrfToken = cookie.load("csrftoken");
    if (csrfToken !== undefined) {
      // this goes into the options argument in fetch(url, options)
      lookupOptions["credentials"] = "include";
      lookupOptions["headers"]["X-CSRFToken"];
    }
    
    // fetch documentation: https://github.github.io/fetch/
    // more explaination on the Options argument: https://github.github.io/fetch/#options
    fetch(endpoint, lookupOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {

        // console.log(responseData);

        this.setState({
          paintings: responseData.results,
          next: responseData.next,
          previous: responseData.previous,
          author: responseData.author,
          totalItemsCount: responseData.count,
        });
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.loadPaintings();
  }

  //populating to the list right after adding new
  handleNewPaintings = paintingItemData => {
    // console.log(paintingItemData);
    let currentPaintings = [...this.state.paintings];
    currentPaintings.unshift(paintingItemData);
    this.setState({
      paintings: currentPaintings
    });
  };


  render() {
    const { paintings, author, totalItemsCount, currentApiEndpoint} = this.state;

    this.state
    return (
      <div>
        <h1>Original Paintings</h1>
        <h4>Total Results: {totalItemsCount}</h4>

        <PaintingSearchFilter currentApiEndpoint={currentApiEndpoint}
                              loadPaintings={this.loadPaintings}/>

        {author === true ? (
          <Link
            className="mr-2"
            maintainScrollPosition={false}
            to={{
              pathname: `/paintings/create`,
              state: { fromDashboard: false }
            }}
          >
            Create Painting
          </Link>
        ) : (
          ""
        )}
        {paintings.length > 0 ? (
          
            paintings.map((paintingItem, index) => {
            return <PaintingInline paintingItem={paintingItem}/>;
          })
        ) : (
          <p>No Paintings Found</p>
        )}
      
        <PaintingPagination totalItemsCount={totalItemsCount}
                            onPageClick={this.onPageClick}
                            currentApiEndpoint={currentApiEndpoint}      
          />
      </div>
    );
  }
}

export default PaintingList;
