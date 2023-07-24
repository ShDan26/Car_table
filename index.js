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

function renderTablePage(data, search = '') {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(search.toLowerCase()))
  );
  const tableData = filteredData

  .slice(startIndex, endIndex)
  .map((el, index) => {

    return `<tr>
    <td>${el.car}</td>
    <td>${el.car_color}</td>
    <td>${el.car_vin}</td>
    <td>${el.car_model}</td>
    <td>${el.car_model_year}</td>
    <td>${el.price}</td>
    <td>${el.availability}</td>
    <td> 
    <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle bg-warning text-dark " type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
      select an action
    </button>
    <ul class="dropdown-menu dropdown-menu-dark">
      <li>
        <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#edit-modal" data-row-index="${index}">Edit</button>
      </li>
      <li>
        <button type="button" class="dropdown-item" onclick="openDeleteModal(${el.id})">Delete</button>
      </li>
    </ul>
  </div>
</td>
</tr>`;

  })


  .join("");
  document.getElementById("table_body").innerHTML = tableData;

  // Add event listener to the "Edit" button
  const editButtons = document.querySelectorAll('[data-bs-target="#edit-modal"]');
  editButtons.forEach((button) => {
    button.addEventListener('click', handleEditClick);
  });

}

// Event listener function for "Edit" button
function handleEditClick(event) {
  const rowIndex = event.target.dataset.rowIndex;
  const storedData = getDataFromLocalStorage();
  const editBody = document.getElementById('edit-body');
  const rowData = storedData[rowIndex];

  editBody.innerHTML = `
    <input type="text" id="car-company" value="${rowData.car}" disabled/>
    <input type="text" id="car-color" value="${rowData.car_color}" />
    <input type="text" id="car-vin" value="${rowData.car_vin}" disabled />
    <input type="text" id="car-model" value="${rowData.car_model}" disabled />
    <input type="text" id="car-year" value="${rowData.car_model_year}" disabled />
    <input type="text" id="car-price" value="${rowData.price}" />
    <input type="text" value="${rowData.availability}" />
    <button type="button" id="save-changes-button" data-row-index="${rowIndex}" class="btn btn-primary bg-warning text-dark">Save changes</button>
  `;

  const saveChangesButton = document.getElementById('save-changes-button');
  saveChangesButton.dataset.rowIndex = rowIndex;
  saveChangesButton.addEventListener('click', handleSaveChanges);
}


function handleSaveChanges (event){
  const carInputCompany = document.getElementById('car-company');
  const carInputVin = document.getElementById('car-vin');
  const carInputModel = document.getElementById('car-model');
  const carInputYear = document.getElementById('car-year');
  const carInputColor = document.getElementById('car-color');
  const carCompany = carInputCompany.value;
  const carVin = carInputVin.value;
  const carModel = carInputModel.value;
  const carYear = carInputYear.value;
  const carColor = carInputColor.value;
  const saveChangesButton = event.target;
  const rowIndex = saveChangesButton.dataset.rowIndex;


  const storedData =  getDataFromLocalStorage();
  console.log('carInputCompany', carInputCompany);
  // Update the corresponding row data in the data array
  if (storedData.length > rowIndex) {
    storedData[rowIndex].car = carCompany;
    storedData[rowIndex].car_color = carColor;
    storedData[rowIndex].car_vin = carVin;
    storedData[rowIndex].car_model = carModel;
    storedData[rowIndex].car_model_year = carYear;
  }

  // Save the updated data back to localStorage
  localStorage.setItem('carsData', JSON.stringify(storedData));


  // Refresh the table with the updated data
  renderTablePage(storedData);
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
  const storedData = getDataFromLocalStorage();
  fetch("https://myfakeapi.com/api/cars/")
    .then((res) => res.json())
    .then((data) => {
     carsData = data.cars;
      console.log(carsData)
      totalItems = carsData.length;
      if(storedData.length) {
        renderTablePage(storedData);
      } else {
        renderTablePage(carsData);
      }
      renderPaginationButtons();

    saveDataToLocalStorage(carsData);

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
  const searchQuery = document.getElementById('search-text').value;
  const storedData = getDataFromLocalStorage();
  renderTablePage(storedData, searchQuery);
}
function openDeleteModal(id) {
  const deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'), {});
  deleteModal.show();

  const deleteInfo = document.getElementById('delete-info');
  const carToDelete = carsData.find((car) => car.id === id);

  deleteInfo.innerHTML = `
    <p>Are you sure you want to delete the following car?</p>
    <p>Car: ${carToDelete.car}</p>
    <p>Color: ${carToDelete.car_color}</p>
    <p>VIN: ${carToDelete.car_vin}</p>
  `;

  deleteIndex = id;
}
function handleDeleteClick() {
  if (deleteIndex !== -1) {
    carsData = carsData.filter((car) => car.id !== deleteIndex);
    saveDataToLocalStorage(carsData);
    renderTablePage(carsData);
    renderPaginationButtons();
    deleteIndex = -1;
  }
}
