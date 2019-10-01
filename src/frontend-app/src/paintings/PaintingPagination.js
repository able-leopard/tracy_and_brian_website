import React, { Component, Fragment } from "react";
import "../css/PaintingPagination.css";
import { max } from "moment";

const PaginationNumbers = props => (
  <a
    className={`page-number${
        props.currentPage === props.index.pageNumber ? " active" : ""
      }`}
    onClick={() => {
      props.onPageClick(props.index.apiUrl);
      props.changeCurrentPage(props.index.pageNumber);
      // console.log(props.index)
    }}
  >
    {props.index.pageNumber}{" "}
  </a>

  // onclick need to setstate of parent and run load more paintings with custom pagination
);

class PaintingPagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  changeCurrentPage = pageNumber => {
    this.setState({
      currentPage: pageNumber
    });
  };

  clickNextPage = (currentPage, onPageClick, numberOfPages, currentApiEndpoint) => {
    const corePaginationEndpoint = currentApiEndpoint.concat('/?page=');
    const nextPageApiUrl = corePaginationEndpoint.concat(currentPage + 1);

    this.state.currentPage !== numberOfPages
      ? (onPageClick(nextPageApiUrl),
        this.setState({
          currentPage: currentPage + 1
        }))
      : "";
  };

  clickPrevPage = (currentPage, onPageClick, currentApiEndpoint) => {
    const corePaginationEndpoint = currentApiEndpoint.concat('/?page=');
    const nextPageApiUrl = corePaginationEndpoint.concat(currentPage - 1);

    this.state.currentPage !== 1
      ? (onPageClick(nextPageApiUrl),
        this.setState({
          currentPage: currentPage - 1
        }))
      : "";
  };

  render() {
    // console.log(this.state.currentPage);

    const { totalItemsCount, onPageClick, currentApiEndpoint } = this.props;
    const maxItemsPerPage = 10; //this has to be the same as class PaintingPageNumberPagination in views.py
    const numberOfPages = totalItemsCount / maxItemsPerPage;


    // creating an array here where there are two key value pairs in each index.

    //pageNumber is the page number, apiUrl is the Django API link that gets the data from the backend 
    const corePaginationEndpoint = currentApiEndpoint.concat('/?page=');
    const allPageNumbersArray = [];
    for (let i = 1; i < numberOfPages + 1; i++) {
      allPageNumbersArray.push({
        pageNumber: i,
        apiUrl: corePaginationEndpoint.concat(i)
      });
    }

    // slicing the array into different parts so we can put it together more easily in the pagination nav
    const firstPageNumber = allPageNumbersArray.slice(0, 1);
    const lastPageNumber = allPageNumbersArray.slice(-1);
    const middlePageNumbers = allPageNumbersArray.slice(1, -1);

    const displayedMiddlePageNumbers = middlePageNumbers.slice(
      Math.max(0, this.state.currentPage - 4),
      this.state.currentPage + 1
    );

    return (
      <nav>
        <ul className={"pagination-bar"}>
          <a
            className={"page-number"}
            onClick={() => {
              this.clickPrevPage(this.state.currentPage, onPageClick, currentApiEndpoint);
            }}
          >
            ←
          </a>

          {firstPageNumber.map(index => (
            <PaginationNumbers
              index={index}
              onPageClick={onPageClick}
              changeCurrentPage={this.changeCurrentPage}
              currentPage={this.state.currentPage}
            />
          ))}

          {this.state.currentPage > 4 ? (
            <a className={"page-number"}> ... </a>
          ) : (
            ""
          )}

          {displayedMiddlePageNumbers.map(index => (
            <PaginationNumbers
              index={index}
              onPageClick={onPageClick}
              changeCurrentPage={this.changeCurrentPage}
              currentPage={this.state.currentPage}

            />
          ))}

          {numberOfPages - this.state.currentPage > 3 ? (
            <a className={"page-number"}> ... </a>
          ) : (
            ""
          )}

          {lastPageNumber.map(index => (
            <PaginationNumbers
              index={index}
              onPageClick={onPageClick}
              changeCurrentPage={this.changeCurrentPage}
              currentPage={this.state.currentPage}
            />
          ))}
          
          <a
            className={"page-number"}
            onClick={() => {
              this.clickNextPage(
                this.state.currentPage,
                onPageClick,
                numberOfPages,
                currentApiEndpoint
              );
            }}
          >
            →
          </a>{" "}
        </ul>

      </nav>
    );
  }
}

export default PaintingPagination;
