import React, { Component } from "react";
import { Link } from "react-router-dom";
import "whatwg-fetch";
import cookie from "react-cookies";
import PaintingForm from "./PaintingForm";
import PaintingPhoto from "./PaintingPhoto";
import PaintingInfoTab from "./PaintingInfoTab";

import "../css/PaintingDetail.css";

class PaintingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: null,
      painting: null,
      doneLoading: false
    };
  }

  handlePaintingItemUpdated = paintingItemData => {
    this.setState({
      painting: paintingItemData
    });
  };

  loadPainting(slug) {
    const endpoint = `/api/paintings/${slug}/`;

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
        if (responseData.detail) {
          this.setState({
            doneLoading: true,
            painting: null
          });
        } else {
          this.setState({
            doneLoading: true,
            painting: responseData
          });
        }
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    if (this.props.match) {
      const { slug } = this.props.match.params;
      this.setState({
        slug: slug,
        doneLoading: false
      });
      this.loadPainting(slug);
    }
  }

  render() {
    const { doneLoading, painting } = this.state;

    return (
      <p>
        {doneLoading === true ? (
          <div>
            {painting === null ? (
              "Not Found"
            ) : (
              <div>
                <div className={"detail-view-grid"}>
                  <div className={"detail-view-title-section"}>
                    <h1>{painting.title}</h1>
                    <br />
                  </div>
                  <div className={"detail-view-image-section"}>
                    <PaintingPhoto srcs={painting.srcs} />
                  </div>
                  <div className={"detail-view-info-tab-section"}>
                    <PaintingInfoTab
                      title={painting.title}
                      style={painting.style}
                      medium={painting.medium}
                      description={painting.description}
                      artist={painting.artist}
                      price={painting.price}
                      size_measurements={painting.size_measurements}
                      available={painting.available}
                      completed_year={painting.completed_year}
                      id={painting.id}
                      slug={painting.slug}
                    />
                  </div>
                </div>
                <br />
                <p>
                  {painting.owner === true ? (
                    <Link
                      maintainScrollPosition={false}
                      to={{
                        pathname: `/paintings/create`,
                        state: { fromDashboard: false }
                      }}
                    >
                      Create New Painting
                    </Link>
                  ) : (
                    ""
                  )}
                </p>
                {painting.owner === true ? (
                  <PaintingForm
                    painting={painting}
                    paintingItemUpdated={this.handlePaintingItemUpdated}
                  />
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        ) : (
          "Loading..."
        )}
      </p>
    );
  }
}

export default PaintingDetail;
