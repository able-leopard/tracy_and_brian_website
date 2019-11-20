import React, { Component } from "react";
import "whatwg-fetch";
import cookie from "react-cookies";

import { Link } from "react-router-dom";
import PaintingPagination from "./PaintingPagination";
import PaintingSearchFilter from "./PaintingSearchFilter";
import PaintingGallery from "./PaintingGallery";

import '../css/PaintingList.css'

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
      maxItemsPerPage: 20,   //this has to be the same as class PaintingPageNumberPagination in views.py
    };
  }

  onFilterClick = (newApiEndpoint) => {
      
    let endpoint = newApiEndpoint
    // this.setState({
    //   currentApiEndpoint: endpoint
    // })
    // console.log(this.state.currentApiEndpoint)
    // console.log(endpoint)
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
      lookupOptions["credentials"] = "include";
      lookupOptions["headers"]["X-CSRFToken"];
    }
    
    fetch(endpoint, lookupOptions)
      .then(response => {
        return response.json();
      })
      .then(responseData => {

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
    const { paintings, author, totalItemsCount, currentApiEndpoint, maxItemsPerPage} = this.state;

    return (
      <div className={"list-view"}>
        <h1>Original Paintings</h1>
        <br/>
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
        <div className={"list-view-body"}>
          <div className={"list-view-body-filter-section"}>
            <h4>Total Results: {totalItemsCount}</h4>

            <PaintingSearchFilter currentApiEndpoint={currentApiEndpoint}
                                  loadPaintings={this.loadPaintings}/>
          </div>
          <div className={"list-view-body-gallery-section"}>
            <PaintingGallery paintings={paintings}/>
            <br/>

          {totalItemsCount < maxItemsPerPage + 1 ?
            ""
            : 
            <div>
              <PaintingPagination totalItemsCount={totalItemsCount}
                                  onPageClick={this.onPageClick}
                                  currentApiEndpoint={currentApiEndpoint}
                                  maxItemsPerPage={maxItemsPerPage}      
                />
            </div>
          }
          </div>
        </div>
      </div>
    );
  }
}

export default PaintingList;
