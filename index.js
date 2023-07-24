

const itemsPerPage = 15; 
let currentPage = 1; 
let totalItems = 0; 
let carsData = [];
function saveDataToLocalStorage(data) {
  localStorage.setItem("carsData", JSON.stringify(data));
}


function getDataFromLocalStorage() {
  const storedData = localStorage.getItem("carsData");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return [];
}
// table create

function renderTablePage(data) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const tableData = data
 
  .slice(startIndex, endIndex)
  .map((el) => {
    
    return `<tr>
    <td>${el.car}</td>
    <td>${el.car_color}</td>
    <td>${el.car_vin}</td>
    <td>${el.car_model}</td>
    <td>${el.car_model_year}</td>
    <td>${el.price}</td>
    <td>${el.availability}</td>
    <td> 
    <div class="dropdown  ">
    <button class="btn btn-secondary dropdown-toggle bg-warning text-dark " type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
    select an action
    </button>
    <ul class="dropdown-menu dropdown-menu-dark ">
    <li>
    <button type="button" class=" dropdown-item " data-bs-toggle="modal" data-bs-target="#edit-modal"> Edit </button>
    </li>
    <li>
    <button type="button" class="dropdown-item "" data-bs-toggle="modal" data-bs-target="#delete-modal"> Delete </button>
    </li>
    </ul>
    </div>
    
    </td>
    </tr>`

  })
  
  
  .join("");
  document.getElementById("table_body").innerHTML = tableData;
  
  // pagination
}

function renderPaginationButtons() {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  let paginationHtml = "";

  const maxVisibleButtons = 15;

  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

  
  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  if (startPage > 1) {
    paginationHtml += `<button  onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      paginationHtml += `<span class="ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHtml += `<button onclick="goToPage(${i})" ${
      i === currentPage ? "style='font-weight: bold;'" : ""
    }>${i}</button>`;
  }

 
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHtml += `<span class="ellipsis">...</span>`;
    }
    paginationHtml += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
 
  if (currentPage > 1) {
    paginationHtml += `<button onclick="goToPage(${currentPage - 1})">Previous</button>`;
  }
  if (currentPage < totalPages) {
    paginationHtml += `<button onclick="goToPage(${currentPage + 1})">Next</button>`;
  }

  paginationContainer.innerHTML = paginationHtml;
}

function goToPage(page) {
  currentPage = page;
  fetchCarsData();
}
// data retrieval

function fetchCarsData() {
  fetch("https://myfakeapi.com/api/cars/")
    .then((res) => res.json())
    .then((data) => {
     carsData = data.cars;
      console.log(carsData)
      totalItems = carsData.length;
      renderTablePage(carsData);
      renderPaginationButtons();


      
    })
    .catch((err) => console.log(err));
}
fetchCarsData() 

document.addEventListener("DOMContentLoaded", function () {
  carsData = getDataFromLocalStorage();

  if (carsData.length === 0) {
    fetchCarsData();
  } else {
    totalItems = carsData.length;
    renderTablePage(carsData);
    renderPaginationButtons();
  }
});

// add car
function addCar() {
  const table = document.querySelector('table-responsive');
  let newCar = {
    car: document.getElementById("add-car-company").value,
    car_model: document.getElementById("add-car-model").value,
    car_vin: document.getElementById("add-car-vin").value,
    car_color: document.getElementById("add-car-color").value,
    car_model_year: document.getElementById("add-car-year").value,
    price: document.getElementById("add-car-price").value,
    availability: document.getElementById("add-car-availability").value,
  };
  
  console.log(newCar);
  carsData.unshift(newCar);


  renderTablePage(carsData);


  const addModal = document.getElementById("add-modal");
  addModal.addEventListener("show.bs.modal", function () {
  
    const inputs = addModal.querySelectorAll("input");
    inputs.forEach((input) => (input.value = "")); 
  
    const select = addModal.querySelector("select");
  select.selectedIndex = 0;
 
  });

  saveDataToLocalStorage(carsData);




}
// delete

// edit
let editData = document.getElementById('edit-body');
 editData.innerHTML = `  <input type="text" placeholder="Company"  disabled>
 <input type="text"placeholder="Model"  disabled>
 <input type="text"placeholder="VIN"  disabled>
 <input type="text"placeholder="Color">
 <input type="text"placeholder="Year"  disabled>
 <input type="number" placeholder="Price">
 <select class="form-select" >
   <option selected> Availability </option>
   <option value="1">Yes</option>
   <option value="2">No</option>
 </select>`


// search
function tableSearch() {
  var phrase = document.getElementById('search-text');
  var table = document.getElementById('info-table');
  var regPhrase = new RegExp(phrase.value, 'i');
  var flag = false;
  for (var i = 1; i < table.rows.length; i++) {
      flag = false;
      for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
          flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
          if (flag) break;
      }
      if (flag) {
          table.rows[i].style.display = "";
      } else {
          table.rows[i].style.display = "none";
      }

  }
}