const fetchData = async searchText => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: "12f0cf1f", s: searchText }
  });
  if (response.data.Error) return [];
  return response.data.Search;
};

const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label><b>Search for a Movie</b></label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;
const searchInput = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async event => {
  const movies = await fetchData(event.target.value);
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }
  console.log(movies);

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    option.classList.add("dropdown-item");
    option.innerHTML = `
    <img src="${imgSrc}" />
    ${movie.Title}
    `;

    option.addEventListener("click", () => {
      searchInput.value = movie.Title;
      dropdown.classList.remove("is-active");
      onMovieSelect(movie);
    });
    resultsWrapper.append(option);
  }
};
searchInput.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", event => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async movie => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: "12f0cf1f", i: movie.imdbID }
  });
  if (response.data.Error) return {};
  const summary = document.querySelector("#summary");
  summary.innerHTML = movieTemplate(response.data);
};

const movieTemplate = movieDetail => {
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
  `;
};
