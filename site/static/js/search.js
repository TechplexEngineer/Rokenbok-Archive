(() => {
  const searchPage = document.querySelector("[data-search-page]");

  if (!searchPage) {
    return;
  }

  const form = searchPage.querySelector(".search-form");
  const input = searchPage.querySelector("#site-search-input");
  const status = searchPage.querySelector("[data-search-status]");
  const results = searchPage.querySelector("[data-search-results]");
  const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
  let fuse;

  input.value = initialQuery;

  const updateUrl = (query) => {
    const url = new URL(window.location.href);

    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    window.history.replaceState({}, "", url);
  };

  const renderResults = (query) => {
    results.replaceChildren();

    if (!query) {
      status.textContent = "Enter a search term to find pages across the site.";
      return;
    }

    const matches = fuse.search(query);

    if (!matches.length) {
      status.textContent = `No results found for “${query}”.`;
      return;
    }

    status.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} found.`;

    const list = document.createElement("div");
    list.className = "list-group";

    matches.forEach(({item}) => {
      const result = document.createElement("a");
      result.className = "list-group-item list-group-item-action";
      result.href = item.url;

      const title = document.createElement("h2");
      title.className = "h5 mb-1";
      title.textContent = item.title;

      const excerpt = document.createElement("p");
      excerpt.className = "mb-0 text-muted";
      excerpt.textContent = item.summary || item.content.slice(0, 180);

      result.append(title, excerpt);
      list.append(result);
    });

    results.append(list);
  };

  fetch(searchPage.dataset.indexUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Search index request failed: ${response.status}`);
      }

      return response.json();
    })
    .then((index) => {
      fuse = new Fuse(index, {
        keys: [
          {name: "title", weight: 0.4},
          {name: "summary", weight: 0.3},
          {name: "content", weight: 0.3}
        ],
        threshold: 0.35,
        ignoreLocation: true
      });

      renderResults(input.value.trim());
    })
    .catch(() => {
      status.textContent = "Search is temporarily unavailable. Please try again later.";
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();

    updateUrl(query);

    if (fuse) {
      renderResults(query);
    }
  });

  input.addEventListener("input", () => {
    const query = input.value.trim();

    updateUrl(query);

    if (fuse) {
      renderResults(query);
    }
  });
})();
