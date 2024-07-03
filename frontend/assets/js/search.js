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
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const state = document.getElementById("state").value;
    const lga = document.getElementById("lga").value;
    const service = document.getElementById("service").value;

    const location = { state, lga };

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, service }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      if (result.success) {
        if (result.providers.length === 0) {
          // Display no results message
          document.getElementById("results").innerHTML =
            "<p>No match found.</p>";
        } else {
          // Display the results
          displayProviders(result.providers);
        }
      } else {
        alert(result.message); // Display any error message from the server
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching providers");
    }
  });

function displayProviders(providers) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  providers.forEach((provider) => {
    const providerDiv = document.createElement("div");
    providerDiv.className = "card";
    providerDiv.innerHTML = `
                    <p><strong>Name:</strong> ${provider.name}</p>
                    <p><strong>Service:</strong> ${provider.service}</p>
                    <p><strong>Location:</strong> ${provider.location.state}, ${provider.location.lga}</p>
                    <p><strong>Phone:</strong> ${provider.phone}</p>
                `;
    resultsDiv.appendChild(providerDiv);
  });
}

window.addEventListener("load", loadStateLGAData);
