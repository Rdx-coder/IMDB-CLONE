// API URL and your OMDB API key
const apiUrl = 'https://www.omdbapi.com/';
const apiKey = 'dc3748ba';

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchResultsContainer = document.getElementById('searchResults');
const favoritesListContainer = document.getElementById('favoritesList');

// Favorites array to store selected movies
let favorites = [];

// Event listener for search input
searchInput.addEventListener('input', debounce(searchMovies, 300));

// Search movies function
function searchMovies() {
  const searchQuery = searchInput.value.trim();

  if (searchQuery === '') {
    searchResultsContainer.innerHTML = '';
    return;
  }

  fetch(`${apiUrl}?apikey=${apiKey}&s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.Response === 'True') {
        const movies = data.Search;
        displaySearchResults(movies);
      } else {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch(error => console.log(error));
}
// Display search results
function displaySearchResults(movies) {
  searchResultsContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieItem = document.createElement('div');
    movieItem.className = 'card';
    movieItem.innerHTML = `
      <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}">
      <div class="card-body">
        <h5 class="card-title">${movie.Title}</h5>
        <p class="card-text">${movie.Year}</p>
        <button class="btn btn-primary favorite-btn" data-id="${movie.imdbID}">Add to Favorites</button>
      </div>
    `;

    const favoriteBtn = movieItem.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => addToFavorites(movie));

    movieItem.addEventListener('click', () => openMoviePage(movie.imdbID));
    // Add event listener to open movie page

    searchResultsContainer.appendChild(movieItem);
  });
}

// Open movie page
function openMoviePage(imdbID) {
  window.open(`https://www.imdb.com/title/${imdbID}`, '_blank');
}


// Add movie to favorites
function addToFavorites(movie) {
  if (!favorites.includes(movie)) {
    favorites.push(movie);
    updateFavoritesList();
  }
  event.stopPropagation(); // Stop event propagation to prevent redirection
}


// function addToFavorites(movie) {
//   if (!favorites.includes(movie)) {
//     favorites.push(movie);
//     updateFavoritesList();
//   }
// }

// function addToFavorites(event) {
//   const movieId = event.target.dataset.id;
//   const movie = searchResults.find(movie => movie.imdbID === movieId);

//   if (movie && !favorites.includes(movie)) {
//     favorites.push(movie);
//     updateFavoritesList();
//   }
// }

// Update favorites list
function updateFavoritesList() {
  favoritesListContainer.innerHTML = '';

  favorites.forEach(movie => {
    const favoriteItem = document.createElement('li');
    favoriteItem.className = 'mb-3';
    favoriteItem.innerHTML = `
      <div class="card">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="card-img" alt="${movie.Title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${movie.Title}</h5>
              <p class="card-text">${movie.Year}</p>
              <button class="btn btn-danger remove-btn" data-id="${movie.imdbID}">Remove from Favorites</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const removeBtn = favoriteItem.querySelector('.remove-btn');
    removeBtn.addEventListener('click', removeFromFavorites);

    favoritesListContainer.appendChild(favoriteItem);
  });
}

// Remove movie from favorites
function removeFromFavorites(event) {
  const movieId = event.target.dataset.id;
  favorites = favorites.filter(movie => movie.imdbID !== movieId);
  updateFavoritesList();
}

// Debounce function to delay API requests on search input
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
