const autoCompleteConfig = {
  renderOption: movie => {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    return `
  <img src="${imgSrc}" />
  ${movie.Title} (${movie.Year})
  `;
  },
  inputValue: movie => {
    return movie.Title;
  },
  fetchData: async searchText => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: { apikey: "12f0cf1f", s: searchText }
    });
    if (response.data.Error) return [];
    return response.data.Search;
  }
};

createAutoComplete({
  root: document.querySelector("#left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  }
});

createAutoComplete({
  root: document.querySelector("#right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect: movie => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  }
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: "12f0cf1f", i: movie.imdbID }
  });
  if (response.data.Error) return {};
  summaryElement.innerHTML = movieTemplate(response.data);

  side === "left" ? (leftMovie = response.data) : (rightMovie = response.data);
  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
const movieTemplate = movieDetail => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce((prevVal, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return prevVal;
    } else {
      return prevVal + value;
    }
  }, 0);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" />
      </p>
    </figure>

    <div class="media-content">
      <div class="content"
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
  </article>
  <article data-value=${awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value=${metaScore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p></article>
  <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
  `;
};
