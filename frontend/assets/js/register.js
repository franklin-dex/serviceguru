async function loadStateLGAData() {
  try {
    const response = await fetch("stateLGA.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const stateLGA = await response.json();

    document.getElementById("state").addEventListener("change", (event) => {
      const selectedState = event.target.value;
      const lgaSelect = document.getElementById("lga");

      // Clear previous LGAs
      lgaSelect.innerHTML = '<option value="">Select LGA</option>';

      if (stateLGA[selectedState]) {
        stateLGA[selectedState].forEach((lga) => {
          const option = document.createElement("option");
          option.value = lga;
          option.textContent = lga;
          lgaSelect.appendChild(option);
        });
      }
    });
  } catch (error) {
    console.error("Error loading state LGA data:", error);
  }
}

document
  .getElementById("registrationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const state = document.getElementById("state").value;
    const lga = document.getElementById("lga").value;
    const service = document.getElementById("service").value;

    const location = { state, lga };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, location, service }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        document.getElementById("message").textContent =
          "Registration successful!";
        document.getElementById("registrationForm").reset(); // Clear the form
      } else {
        alert("Error registering service provider");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error registering service provider");
    }
  });

// Load state LGA data on page load
window.addEventListener("load", loadStateLGAData);
