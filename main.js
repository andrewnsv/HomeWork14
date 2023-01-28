const output = document.getElementById("output");
const restoreBtn = document.getElementById("restore-btn");

const nextPageButton = document.querySelector(".next");
const prevPageButton = document.querySelector(".prev");
let currentPage = 1;
const currentPageNumber = document.querySelector(".curr-page");

const statusSelect = document.getElementById("status-select");

let dataGlobal = [];

const renderList = (elements) => {
  return elements.map(current => 
  `<li>
    <img src="${current.image}">
      <div class="wrap-item">
        <div class='name-content'>Имя:
            <p>${current.name}</p>
        </div>
        <div class='name-content'>Статус:
            <p> ${current.status}</p>
        </div>
        <div class='name-content'>Раса: 
            <p>${current.species}</p>
        </div>
        <button btn-name="delete">Delete Block</button>
      </div>
  </li>`
  ).join('')
};

async function fetchData(pagNum) {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character/?page=${pagNum}`
  );
  const data = await response.json();
  return data;
}

//Кнопка вперед
nextPageButton.addEventListener("click", () => {
  currentPage++;
  currentPageNumber.textContent = currentPage;
  statusSelect.value = 'all'
  fetchData(currentPage).then((data) => {
    dataGlobal = data.results;
    if (data.info.next === null) {
      nextPageButton.setAttribute("disabled", true);
    }
    if (data.info.prev !== null) {
      prevPageButton.removeAttribute("disabled");
    }
    output.innerHTML = renderList(dataGlobal);
  });
});

//Кнопка назад
prevPageButton.addEventListener("click", () => {
  currentPage--;
  currentPageNumber.textContent = currentPage;
  statusSelect.value = 'all'
  fetchData(currentPage).then((data) => {
    dataGlobal = data.results;
    if (data.info.next !== null) {
      nextPageButton.removeAttribute("disabled", true);
    }
    if (data.info.prev === null) {
      prevPageButton.setAttribute("disabled", true);
    }
    output.innerHTML = renderList(dataGlobal);
  });
});

//Первый рендер и выбор LI
fetchData(currentPage).then((data) => {
  dataGlobal = data.results;
  currentPageNumber.textContent = currentPage;
  output.innerHTML = renderList(dataGlobal);

  output.addEventListener("click", (e) => {
    let target = e.target.closest("li");
    if (target) {
      let allLi = document.querySelectorAll("li");
      allLi.forEach((li) => {
        li.classList.remove("active");
      });
      target.classList.add("active");

      const res = document.querySelector(".res span");
      res.textContent = target.querySelectorAll("p")[0].textContent;

      if (e.target.matches('button[btn-name="delete"]')) {
        target.remove();
        res.textContent = "";
      }
    }
  });

  // Функционал SELECT
  statusSelect.addEventListener("change", (e) => {
    if (e.target.value === "all") {
      output.innerHTML = renderList(dataGlobal);
    } else {
      const filteredElements = dataGlobal.filter(
        (element) => element.status === e.target.value
      );
      output.innerHTML = renderList(filteredElements);
    }
  });

  //Функционал кнопки Restor
  restoreBtn.addEventListener("click", () => {
    const listItems = document.querySelectorAll("li");
    const result = document.querySelector(".res span");

    if (listItems.length > 0) {
      listItems.forEach((item) => {
        item.remove();
        result.textContent = "";
        statusSelect.value = 'all'
      });
    }
    output.innerHTML = renderList(dataGlobal);
  });
});
