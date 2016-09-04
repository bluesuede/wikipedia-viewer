/**
  * Function used when a GET request has returned data
  *
  * @param JSON data "this", sent through automatically from the get request
  *
  **/
function successSearch() {
  var response                    = JSON.parse(this.responseText), // Make the JSON response into object
      searchResultInfoSpan        = document.getElementById("search-result-info"),
      responseObject              = {};

      // If Wikipedia returns an error:
      // Display message from Wikipedia, stop executing function
      if(response.error){
        searchResultInfoSpan.style.display  = "inline";
        searchResultInfoSpan.textContent    = response.error.info;
        return false;
      }
      // If Wikipedia returns data without an error:
      // Put info needed from results in object responseObject
      // Call function addResultsToPage passing on object responseObject
      else if(response[1][0]) {
        // Add all results to object
        responseObject.results      = response[1];
        responseObject.descriptions = response[2];
        responseObject.links        = response[3];

        // Call function addResultsToPage and pass through object responseObject
        addResultsToPage(responseObject)
      }
      // If there is no result from the query:
      // Display message
      else {
        searchResultInfoSpan.style.display = "inline";
        searchResultInfoSpan.textContent = "No result could be found";
      }
}

/**
  * Give message to user through alert
  *
  **/
function errorSearch() {
  alert("Something went wrong when communicating with Wikipedia API");
}

/**
  * Display information fetched from Wikipedia from user
  * Only called when results have been found for the search term
  *
  * @param object "responseObject", contains results from Wikipedia
  *
  **/
function addResultsToPage(responseObject) {
  var searchResultAnchorWraps = document.getElementsByClassName("search-result-anchor-wrap"),
      numberOfResults         = responseObject.results.length;

  // For every result that Wikipedia returned:
  // Make div element wrapping the anchor visible
  // Put href in to anchor element
  // Put title and description in the span elements inside the anchor
  for(i = 0; i < numberOfResults; i++) {
    var resultAnchor            = searchResultAnchorWraps[i].children[0], // Anchor elements with class "search-result"
        resultTitleSpan         = searchResultAnchorWraps[i].children[0].children[0], // Span elements with class "search-result-title"
        resultDescriptionSpan   = searchResultAnchorWraps[i].children[0].children[1]; // Span elements with class "search-result-description"

    searchResultAnchorWraps[i].style.display  = "inline-block"; // Make sure anchors wraps are not hidden
    resultAnchor.href                         = responseObject.links[i]; // Add href to anchor
    resultTitleSpan.textContent               = responseObject.results[i]; // Add title text
    resultDescriptionSpan.textContent         = responseObject.descriptions[i]; // Add description text
  }
}

// Make sure DOM content is loaded before attempting to use functions
document.addEventListener("DOMContentLoaded", function() {
  var searchForm            = document.getElementById("search-form");

  // When the search form is submitted (ie. search button is clicked)
  searchForm.addEventListener("submit", function(e) {
    var request                 = new XMLHttpRequest(),
        searchField             = document.getElementById("search-field"),
        searchResultInfoSpan    = document.getElementById("search-result-info"),
        searchResultAnchorWraps = document.getElementsByClassName("search-result-anchor-wrap");

    // Always make sure search-result-info span is hidden when form is submitted
    searchResultInfoSpan.style.display = "none";

    // Always make sure all search-result-anchor-wraps are hidden when form is submitted
    // Make sure their text fields are empty aswell
    for(i = 0; i < searchResultAnchorWraps.length; i++) {
      searchResultAnchorWraps[i].style.display = "none";
    }

    // If the search field is empty:
    // Display message, stop executing function so that no GET request is made
    if(searchField.value === "") {
      searchResultInfoSpan.style.display  = "inline";
      searchResultInfoSpan.textContent    = "No search query has been entered";
      e.preventDefault();
      return false;
    }

    // Calls function successSearch if the get request could fetch data
    request.addEventListener("load", successSearch);

    // Calls function errorSearch if no data fetching failed
    request.addEventListener("error", errorSearch);

    // Prepare GET request towards Wikipedias API
    // Use value(text) from the search field to do action opensearch
    // Limit response to five (5) results
    // Request JSON format
    // origin=* is used because "Access-Control-Allow-Origin is missing" otherwise. I am not sure why. Solution found in StackOverflow comment.
    request.open("GET", "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchField.value + "&limit=5&format=json&origin=*");

    // Do GET request
    request.send();

    // Prevents form from refreshing page
    // e = event
    e.preventDefault();
  });

});
