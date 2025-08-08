
  window.addEventListener("load", () => {
    document.getElementById("banner").classList.add("visible");
  });

  const visitSpan = document.getElementById('visitCount');
  const STORAGE_KEY = 'visitCount';
  let visitCount = localStorage.getItem(STORAGE_KEY);
  if (visitCount === null) {
    visitCount = 3605555;
  } else {
    visitCount = parseInt(visitCount, 10);
  }
  visitSpan.textContent = visitCount.toString().padStart(8, '0');
  setInterval(() => {
    visitCount++;
    localStorage.setItem(STORAGE_KEY, visitCount);
    visitSpan.textContent = visitCount.toString().padStart(8, '0');
  }, 60000);

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const movieCards = Array.from(document.querySelectorAll('.movie-card'));
  const pagination = document.getElementById('pagination');
  const itemsPerPage = 5;
  let filteredResults = [];

  function renderPagination(currentPage, totalPages) {
    pagination.innerHTML = "";
    pagination.style.display = totalPages > 1 ? "block" : "none";

    const createBtn = (text, page, isActive = false, isDisabled = false) => {
      const btn = document.createElement("a");
      btn.textContent = text;
      btn.style.padding = "6px 12px";
      btn.style.background = isActive ? "#00aaff" : "#222";
      btn.style.color = "#fff";
      btn.style.textDecoration = "none";
      btn.style.borderRadius = "4px";
      btn.style.border = "2px solid #00aaff";
      btn.style.margin = "2px";
      btn.style.fontWeight = "bold";
      btn.style.fontFamily = "sans-serif";
      btn.href = "#";
      if (!isDisabled && page !== null) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          showPage(page);
        });
      } else {
        btn.style.pointerEvents = "none";
        btn.style.opacity = "0.5";
      }
      return btn;
    };

    if (currentPage > 1) {
      pagination.appendChild(createBtn("Anterior", currentPage - 1));
    }

    if (currentPage > 3) {
      pagination.appendChild(createBtn("1", 1));
      if (currentPage > 4) pagination.appendChild(createBtn("...", null, false, true));
    }

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pagination.appendChild(createBtn(i, i, i === currentPage));
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pagination.appendChild(createBtn("...", null, false, true));
      pagination.appendChild(createBtn(totalPages, totalPages));
    }

    if (currentPage < totalPages) {
      pagination.appendChild(createBtn("Siguiente", currentPage + 1));
    }
  }

  function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    movieCards.forEach(card => card.style.display = 'none');
    filteredResults.slice(start, end).forEach(card => card.style.display = 'flex');
    renderPagination(page, Math.ceil(filteredResults.length / itemsPerPage));
    document.getElementById('pagination-header').textContent = `PÁGINA ${page} DE ${Math.ceil(filteredResults.length / itemsPerPage)}`;
  }

  function filterMovies() {
    const query = searchInput.value.toLowerCase().trim();
    const resultMsg = document.getElementById('search-result-msg');
    const resultTitle = document.getElementById('search-result-title');
    const resultImage = document.getElementById('search-result-image');
    const resultNoResult = document.getElementById('search-result-noresult');
    const resultDesc = document.getElementById('search-result-desc');
    const mainPagination = document.getElementById('main-pagination');

    if (query === "") {
      movieCards.forEach(card => card.style.display = 'flex');
      pagination.style.display = "none";
      mainPagination.style.display = "block";
      resultMsg.style.display = "none";
      document.getElementById('pagination-header').textContent = "";
      return;
    }

    filteredResults = movieCards.filter(card => {
      const title = card.querySelector('.movie-title').textContent.toLowerCase();
      return title.includes(query);
    });

    movieCards.forEach(card => card.style.display = 'none');
    resultMsg.style.display = "block";
    mainPagination.style.display = "none";
    resultTitle.textContent = `Resultados para: "${query}"`;

    if (filteredResults.length > 0) {
      showPage(1);
      resultImage.style.display = "none";
      resultNoResult.textContent = "";
      resultDesc.textContent = `${filteredResults.length} resultados encontrados.`;
    } else {
      pagination.style.display = "none";
      resultImage.style.display = "block";
      resultNoResult.textContent = "No se encontraron coincidencias";
      resultDesc.textContent = "Lo sentimos, pero nada coincide con sus términos de búsqueda. Intente nuevamente con algunas palabras clave diferentes.";
    }
  }

  searchBtn.addEventListener('click', filterMovies);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      filterMovies();
    }
  });
