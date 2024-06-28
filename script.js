document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Collect form data
    let formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      location: document.getElementById("location").value,
      services: document
        .getElementById("services")
        .value.split(",")
        .map((service) => service.trim()),
    };

    // Load existing data from JSON file (if any)
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        // Append new form data to existing pseudo data
        data.serviceProviders.push({
          id: data.serviceProviders.length + 1, // Generate unique ID (in practice, use UUIDs or backend-generated IDs)
          name: formData.name,
          email: formData.email,
          location: formData.location,
          services: formData.services,
        });

        // Save updated data back to JSON file
        saveData(data);
      })
      .catch((error) => console.error("Error loading JSON:", error));
  });

function saveData(data) {
  // Save updated data back to JSON file
  fetch("data.json", {
    method: "PUT", // Use PUT method to update file
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      alert("Signup successful!");
      // Optionally, reset form fields after successful submission
      document.getElementById("signupForm").reset();
    })
    .catch((error) => console.error("Error updating JSON:", error));
}
