const fetchBenefits = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/benefits");
    const data = await response.json();

    if (data.status === "success") {
      const benefits = data.data.data; // Assuming the benefits are in an array

      const benefitsContainer = document.querySelector("#benefits");

      benefits.forEach((benefit) => {
        const newBenefitElement = document.createElement("div");
        newBenefitElement.classList.add("col-md-4");
        newBenefitElement.innerHTML = `
          <div class="blog-entry align-self-stretch">
            <div class="text p-4 d-block">
              <div class="meta mb-3"></div>
              <h3 class="heading mt-3">
                <a id="benefitName" href="/benefit/benefit-single.html?benefitId=${benefit._id}">${benefit.name}</a>
              </h3>
              <p>
                ${benefit.summary}
              </p>
            </div>
          </div>
        `;

        benefitsContainer.appendChild(newBenefitElement);
      });
    } else {
      console.error("Failed to fetch benefits:", data.message);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Call the fetchBenefits function to load and insert the benefits
fetchBenefits();
