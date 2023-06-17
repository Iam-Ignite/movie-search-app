  const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const sortReleaseButton = document.getElementById('sort-release-button');
    const sortAlphabeticalButton = document.getElementById('sort-alphabetical-button');
    const moviesContainer = document.getElementById('movies-container');
    const paginationContainer = document.getElementById('pagination-container');
    const errorMessage = document.getElementById('error-message');

    let currentPage = 1;
    const itemsPerPage = 8;

    searchButton.addEventListener('click', searchMovies);
    sortReleaseButton.addEventListener('click', sortMoviesByReleaseDate);
    sortAlphabeticalButton.addEventListener('click', sortMoviesAlphabetically);

    async function searchMovies() {
      const query = searchInput.value;

      try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=f208557a`);
        const data = await response.json();

        if (data.Response === 'True') {
          displayMovies(data.Search);
        } else {
          displayError(data.Error);
        }
      } catch (error) {
        displayError('An error occurred. Please try again later.');
      }
    }

    function displayMovies(movies) {
      moviesContainer.innerHTML = '';

      const totalPages = Math.ceil(movies.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentMovies = movies.slice(startIndex, endIndex);

      currentMovies.forEach(movie => {
        const movieElement = createMovieElement(movie);
        moviesContainer.appendChild(movieElement);
      });

      paginationContainer.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement('button');
          pageButton.textContent = i;
          pageButton.className = 'pagination-button';
          if (i === currentPage) {
            pageButton.disabled = true;
          }
          pageButton.addEventListener('click', () => {
            currentPage = i;
            displayMovies(movies);
          });
          paginationContainer.appendChild(pageButton);
        }
      }
    }

    function createMovieElement(movie) {
      const movieElement = document.createElement('div');
      movieElement.className = 'movie';

      const poster = movie.Poster === 'N/A' ? 'https://via.placeholder.com/150x200' : movie.Poster;
      const title = movie.Title.length > 18 ? movie.Title.substring(0, 17) + "..." : movie.Title;
      movieElement.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">
        <h3 class="movie-title">${title}</h3>
        <p class="movie-release"><strong>Release Date:</strong> ${movie.Year}</p>
        <button class="details-button" onclick="showDetails('${movie.imdbID}')">View Details</button>
      `;

      return movieElement;
    }

    function showDetails(imdbID) {
      const modal = document.getElementById('modal');
      const overlay = document.getElementById('overlay');
      overlay.style.display = 'flex';
      modal.innerHTML = 'Loading...';
      modal.style.display = 'block';

      fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=f208557a`)
        .then(response => response.json())
        .then(data => {
          const detailsHTML = `
        <div class="details-flex">
        <div>
            <img class="detail-img" src="${data.Poster}" alt="${data.Title}">
          <p class="details-button"><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
        </div>
           <div class="detail-content">
             <h3>${data.Title}</h3>
        <p><strong>Plot:</strong> ${data.Plot}</p>
        <p><strong>Director:</strong> ${data.Director}</p>
        <p><strong>Actors:</strong> ${data.Actors}</p>
        <p><strong>Genre:</strong> ${data.Genre}</p>
        <p><strong>Released:</strong> ${data.Released}</p>
        <p><strong>Runtime:</strong> ${data.Runtime}</p>
      
        <p><strong>Awards:</strong> ${data.Awards}</p>
        <button class="details-button" onclick="closeDetails()">Close</button>
           </div>
        </div>
      `;

          modal.innerHTML = detailsHTML;
        })
        .catch(() => {
          modal.innerHTML = 'An error occurred. Please try again later.';
        });
    }

    function closeDetails() {
      const modal = document.getElementById('modal');
      const overlay = document.getElementById('overlay');
      overlay.style.display = 'none';
      modal.style.display = 'none';
      modal.innerHTML = '';
    }


    function displayError(message) {
      errorMessage.textContent = message;
    }


    function sortMoviesByReleaseDate() {
      const movieElements = Array.from(document.getElementsByClassName('movie'));
      const sortedMovies = movieElements.sort((a, b) => {
        const releaseDateA = new Date(a.querySelector('.movie-release').textContent.split(':')[1]);
        const releaseDateB = new Date(b.querySelector('.movie-release').textContent.split(':')[1]);
        return releaseDateB - releaseDateA;
      });
      moviesContainer.innerHTML = '';
      sortedMovies.forEach(movie => {
        moviesContainer.appendChild(movie);
      });
    }

    function sortMoviesAlphabetically() {
      const movieElements = Array.from(document.getElementsByClassName('movie'));
      const sortedMovies = movieElements.sort((a, b) => {
        const titleA = a.querySelector('.movie-title').textContent.toLowerCase();
        const titleB = b.querySelector('.movie-title').textContent.toLowerCase();
        if (titleA < titleB) {
          return -1;
        } else if (titleA > titleB) {
          return 1;
        } else {
          return 0;
        }
      });
      moviesContainer.innerHTML = '';
      sortedMovies.forEach(movie => {
        moviesContainer.appendChild(movie);
      });
    }