const output = document.getElementById("output");
const restoreBtn = document.getElementById("restore-btn");


const nextPageButton = document.querySelector(".next");
const prevPageButton = document.querySelector(".prev");
let currentPage = 1;
const currentPageNumber = document.querySelector(".curr-page");

const renderList = (elements) => {
  return elements.reduce((acc, current) => {
    acc += `<li>
    <img src="${current.image}">
        <div class="wrap-item">
            <div class='name-content'>Имя:
                <p>${current.name}</p>
            </div>
            <div class='name-content'>Статус:
                <p> ${current.status}</p>
            </div>
            <div class='name-content'>Айди: 
                <p>${current.id}</p>
            </div>
            <button btn-name="delete">Delete Block</button>
        </div>
    </li>`;

    return acc;
  }, "");
};

async function fetchData(pagNum) {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${pagNum}`)
  const data = await response.json()
  return data;
}

nextPageButton.addEventListener("click", () => {
  currentPage++;
  currentPageNumber.textContent = currentPage;
  fetchData(currentPage)
    .then((data) => {
      if(data.info.next === null){
        nextPageButton.setAttribute('disabled', true);
      }
      if(data.info.prev !== null){
        prevPageButton.removeAttribute('disabled', true);
      }
      output.innerHTML = renderList(data.results);  

    });
});

prevPageButton.addEventListener("click", () => {
  currentPage--;
  currentPageNumber.textContent = currentPage;
  fetchData(currentPage)
    .then((data) => {
      console.log(data);
      if(data.info.next !== null){
        nextPageButton.removeAttribute('disabled', true);
      }
      if(data.info.prev === null){
        prevPageButton.setAttribute('disabled', true);
      }
      output.innerHTML = renderList(data.results);
    });
});

fetch("https://rickandmortyapi.com/api/character/")
  .then((response) => response.json())
  .then((data) => {
    currentPageNumber.textContent = currentPage;
    output.innerHTML = renderList(data.results);
    
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

    restoreBtn.addEventListener("click", () => {
      const listItems = document.querySelectorAll("li");
      const result = document.querySelector(".res span");

      if (listItems.length > 0) {
        listItems.forEach((item) => {
          item.remove();
          result.textContent = "";
          currentPageNumber.textContent = 1;
        });
      }

      output.innerHTML = renderList(data.results);
    });
  });
