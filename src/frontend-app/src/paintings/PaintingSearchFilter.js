import React, { Component } from 'react';

class PaintingSearchFiler extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            firstQuery: true,
            sizeFilters: [],
            sizeQuery: "",
            styleFilters: [],
            styleQuery: "",
            artistFilters: [],
            artistQuery: "",
        }
    }

    // this concatenate all the search queries into one string and then runs loadPaintings on that string
    handleAllFilters = (currentApiEndpoint, loadPaintings) => {
        
        let sizeQuery = this.state.sizeQuery
        let artistQuery = this.state.artistQuery
        let styleQuery = this.state.styleQuery

        let myEndpoint = currentApiEndpoint.concat(sizeQuery, artistQuery, styleQuery)        
        loadPaintings(myEndpoint);
    }

    filterQuerySize = (currentApiEndpoint, loadPaintings, event) => {

            let currentFilters = this.state.sizeFilters
            const { name, value } = event.target;
            
            // on each click if the size filter (e.g. large, medium, small) is in the list we take it out, or else we add it in
            if (currentFilters.includes(value)){
                let myIndex = currentFilters.indexOf(value)
                currentFilters.splice(myIndex, 1)
            }else{
                currentFilters.push(value)
            }
            this.setState({ [name]: currentFilters });

            // we join the list into a string so we can use it in the search queries
            let myFilters = this.state.sizeFilters.join('')

            // we're storing the sizeQuery into our state which we will use later     
            if (this.state.sizeFilters.length !== 0) {
                let myQuery = '&size_class='.concat(myFilters)
                
                // using the callback here do run the function after setState
                // https://stackoverflow.com/questions/34687091/can-i-execute-a-function-after-setstate-is-finished-updating
                this.setState({
                    sizeQuery: myQuery
                }, () => {
                    this.handleAllFilters(currentApiEndpoint, loadPaintings);
                });
            } else {
                let myQuery = ''
                this.setState({
                    sizeQuery: myQuery
                }, () => {
                    this.handleAllFilters(currentApiEndpoint, loadPaintings);
                });    
            }
    };

    filterStyle = (currentApiEndpoint, loadPaintings, event) => {

        let currentFilters = this.state.styleFilters
        const { name, value } = event.target;
        
        // on each click if the size filter (e.g. large, medium, small) is in the list we take it out, or else we add it in
        if (currentFilters.includes(value)){
            let myIndex = currentFilters.indexOf(value)
            currentFilters.splice(myIndex, 1)
        }else{
            currentFilters.push(value)
        }
        this.setState({ [name]: currentFilters });

        // we join the list into a string so we can use it in the search queries
        let myFilters = this.state.styleFilters.join('')

        if (this.state.styleFilters.length !== 0) {
            let myQuery = '&style='.concat(myFilters)   
            this.setState({
                styleQuery: myQuery
            }, () => {
                this.handleAllFilters(currentApiEndpoint, loadPaintings);
            });
        } else {
            let myQuery = ''
            this.setState({
                styleQuery: myQuery
            }, () => {
                this.handleAllFilters(currentApiEndpoint, loadPaintings);
            });
        }
    };

    filterArtist = (currentApiEndpoint, loadPaintings, event) => {

        let currentFilters = this.state.artistFilters
        const { name, value } = event.target;
        
        // on each click if the size filter (e.g. large, medium, small) is in the list we take it out, or else we add it in
        if (currentFilters.includes(value)){
            let myIndex = currentFilters.indexOf(value)
            currentFilters.splice(myIndex, 1)
        }else{
            currentFilters.push(value)
        }
        this.setState({ [name]: currentFilters });

        // we join the list into a string so we can use it in the search queries
        let myFilters = this.state.artistFilters.join('')

        if (this.state.artistFilters.length !== 0) {
            let myQuery = '&artist='.concat(myFilters)   
            this.setState({
                artistQuery: myQuery
            }, () => {
                this.handleAllFilters(currentApiEndpoint, loadPaintings);
            });
        } else {
            let myQuery = ''
            this.setState({
                artistQuery: myQuery
            }, () => {
                this.handleAllFilters(currentApiEndpoint, loadPaintings);
            });
        }
    };


    render() { 
        
        const {currentApiEndpoint, loadPaintings} = this.props;

        return ( 
            <div>
                <div>
                    Large
                    <input type="checkbox"
                        value="large|"
                        name="sizeFilters"
                        onClick={ (event) => this.filterQuerySize(currentApiEndpoint, loadPaintings, event)}
                        />
                    Medium
                    <input  type="checkbox"
                            value="medium|"
                            name="sizeFilters"                      
                            onClick={ (event) => this.filterQuerySize(currentApiEndpoint, loadPaintings, event)}
                            />
                    Small
                    <input  type="checkbox"
                            value="small|"
                            name="sizeFilters"                                          
                            onClick={ (event) => this.filterQuerySize(currentApiEndpoint, loadPaintings, event)}
                            />
                </div>
                <div>
                    Abstract
                    <input type="checkbox"
                        value="abstract|"
                        name="styleFilters"
                        onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                        />
                    Animal
                    <input  type="checkbox"
                            value="animal|"
                            name="styleFilters"                      
                            onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                            />
                    Landscape
                    <input  type="checkbox"
                            value="landscape|"
                            name="styleFilters"                                          
                            onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                            />
                    Nature
                    <input  type="checkbox"
                            value="nature|"
                            name="styleFilters"                                          
                            onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                            />
                    People
                    <input  type="checkbox"
                            value="people|"
                            name="styleFilters"                                          
                            onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                            />
                    Portrait
                    <input  type="checkbox"
                            value="portrait|"
                            name="styleFilters"                                          
                            onClick={ (event) => this.filterStyle(currentApiEndpoint, loadPaintings, event)}
                            />
                </div>
                <div>
                    Brian
                    <input type="checkbox"
                        value="Brian|"
                        name="artistFilters"
                        onClick={ (event) => this.filterArtist(currentApiEndpoint, loadPaintings, event)}
                        />
                    Tracy
                    <input  type="checkbox"
                            value="Tracy|"
                            name="artistFilters"                      
                            onClick={ (event) => this.filterArtist(currentApiEndpoint, loadPaintings, event)}
                            />
                    Alex
                    <input  type="checkbox"
                            value="Alex|"
                            name="artistFilters"                                          
                            onClick={ (event) => this.filterArtist(currentApiEndpoint, loadPaintings, event)}
                            />
                </div>
            </div>
         );
    }
}

export default PaintingSearchFiler;



/* 
Regarding finding distinct values from reach field:

The two methods I thought of was the perform an SQL query on the backend to get the distinct values
distinctList = Painting.objects.order_by().values_list("size_class").distinct() on views.py
or get the distinct values by looping over the JSON objects once the data comes over to the front end
but this requires it to be looped everytime the page renders

Couldn't find a efficient solution that gets all the possible distinct values for each field  
without looping over the entire dataset each time so just hardcoding the links for now
*/
