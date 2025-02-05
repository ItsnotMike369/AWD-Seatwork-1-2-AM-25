function toggleMenu() {
  const navbarLinks = document.querySelector('.navbar-links');
  navbarLinks.classList.toggle('active');
}

// Load cars from localStorage or use default data

const storedCars = localStorage.getItem("cars");
const cars = storedCars ? JSON.parse(storedCars) : [
  { id: 1, name: "Ferrari SF90 Spider", price: 350, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/Ferrari SF90 Spider.jpg" },
  { id: 2, name: "Lamborghini Aventador", price: 400, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/Lamborghini Aventador.jpg" },
  { id: 3, name: "Porsche 911 Turbo", price: 350, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/Porsche 911 Turbo.jpg" },
  { id: 4, name: "Aston Martin DB11", price: 500, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/Aston Martin DB11.jpg" },
  { id: 5, name: "BMW i8", price: 450, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/BMW i8.jpg" },
  { id: 6, name: "McLaren 720S", price: 550, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/McLaren 720S.jpg" },
  { id: 7, name: "Bentley Continental GT", price: 600, seats: 4, doors: 2, type: "Auto", available: true, image: "./assets/img/Bentley Continental GT.jpg" },
  { id: 8, name: "Rolls-Royce Dawn", price: 700, seats: 4, doors: 2, type: "Auto", available: true, image: "./assets/img/Rolls-Royce Dawn.jpg" },
  { id: 9, name: "Jaguar F-Type", price: 450, seats: 2, doors: 2, type: "Auto", available: true, image: "./assets/img/Jaguar F-Type.jpg" },
  { id: 10, name: "Tesla Model S", price: 400, seats: 4, doors: 4, type: "Electric", available: true, image: "./assets/img/Tesla Model S.jpg" }
];

// Load rental history from localStorage

const rentalHistory = JSON.parse(localStorage.getItem("rentalHistory")) || [];

// Save cars to localStorage

function saveCarsToStorage() {
  localStorage.setItem("cars", JSON.stringify(cars));
}

// Save rental history to localStorage

function saveRentalHistory() {
  localStorage.setItem("rentalHistory", JSON.stringify(rentalHistory));
}

// Render cars to the DOM

function renderCars() {
  const carGrid = document.getElementById("car-grid");
  carGrid.innerHTML = "";
  cars.forEach((car) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
          <img src="${car.image}" alt="${car.name}">
          <div class="card-content">
              <h2 class="card-title">${car.name}</h2>
              <p class="card-price">${car.price}$ / Day</p>
              <div class="card-meta">
                  <span>${car.seats} Seats</span>
                  <span>${car.doors} Doors</span>
                  <span>${car.type}</span>
              </div>
              <button class="rent-btn" ${!car.available ? "disabled" : ""} onclick="rentCar(${car.id})">
                  ${car.available ? "Rent Now" : "Unavailable"}
              </button>
              ${!car.available ? `<button class="cancel-btn" onclick="cancelRental(${car.id})">Cancel Rental</button>` : ""}
          </div>
      `;
      carGrid.appendChild(card);
  });
}

// Rent a car

function rentCar(carId) {
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1 && cars[carIndex].available) {
    const renterName = prompt("Enter your name:");
    if (renterName) {
      const paymentMethod = prompt("Choose payment method: Card or Cash").toLowerCase();
      if (paymentMethod === "card" || paymentMethod === "cash") {
        const paymentAmount = prompt(`Enter payment amount for ${cars[carIndex].name} in $:`);
        if (paymentAmount !== null) {
          const payment = parseFloat(paymentAmount);
          if (!isNaN(payment) && payment >= cars[carIndex].price) {
            cars[carIndex].available = false;
            cars[carIndex].renter = renterName;
            cars[carIndex].rentalPrice = payment;
            rentalHistory.push({ 
              carId: cars[carIndex].id, 
              name: cars[carIndex].name, 
              renter: cars[carIndex].renter, 
              rentalPrice: cars[carIndex].rentalPrice, 
              paymentMethod: paymentMethod,
              date: new Date().toLocaleString() 
            });
            saveCarsToStorage();
            saveRentalHistory();
            alert(`Thank you, ${renterName}. You have successfully rented the ${cars[carIndex].name}. Payment of $${payment.toFixed(2)} received via ${paymentMethod}.`);
            renderCars();
          } else {
            alert("Invalid payment amount. Please enter a valid amount equal to or greater than the rental price.");
          }
        } else {
          alert("Payment canceled.");
        }
      } else {
        alert("Invalid payment method. Please choose 'Card' or 'Cash'.");
      }
    } else {
      alert("Rental canceled. Please enter your name to proceed.");
    }
  } else {
    alert("This car is not available.");
  }
}

// Cancel a rental

function cancelRental(carId) {
  const carIndex = cars.findIndex((c) => c.id === carId);
  if (carIndex !== -1 && !cars[carIndex].available) {
    cars[carIndex].available = true; 
    saveCarsToStorage(); 
    alert(`You have canceled the rental for ${cars[carIndex].name}.`);
    renderCars(); 
  } else {
    alert("This car is already available.");
  }
}

// Display rental history

function displayRentalHistory() {
  console.log("Rental History:", rentalHistory);
}

renderCars();
