document.addEventListener("DOMContentLoaded", function() {
  var searchForm          = document.getElementById("search-form"),
      randomArticleButton = document.getElementById("random-article-button"),
      formData;

  searchForm.addEventListener("submit", function(e) {
    console.log("submitted");
    searchForm.className = "do-slide-to-flex-start"; // Move the entire search form to top of page using animation
    e.preventDefault(); // Prevents form from refreshing page
  });

  randomArticleButton.addEventListener("click", function(e) {
    console.log("klickad");
    e.preventDefault(); // Prevents form from refreshing page and submitting form
  });

});
