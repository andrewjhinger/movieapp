const fetchData = async searchText => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: "12f0cf1f", s: searchText }
  });
  if (response.data.Error) return [];
  return response.data.Search;
};

const searchInput = document.querySelector("input");

const onInput = async event => {
  const movies = await fetchData(event.target.value);
  console.log(movies);

  const movieSection = document.querySelector("#movies");
  for (let movie of movies) {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
    <img src="${movie.Poster}" />
    <h1>${movie.Title}</h1>
    `;
    movieSection.append(movieDiv);
  }
};
searchInput.addEventListener("input", debounce(onInput, 500));
