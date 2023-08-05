const fetchBenefitDetails = async (benefitId) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/benefits/${benefitId}`
    );
    const data = await response.json();

    console.log(`data: ${JSON.stringify(data)}`);

    if (data.status === "success") {
      const benefit = data.data.data;
      console.log(`data: ${JSON.stringify(benefit)}`);

      const benefitDetailsContainer = document.querySelector("#benefitDetails");
      const html = `
        <h1 class="mb-3">${benefit.name}</h1>
        <h4 class="mb-3">Summary</h4>
        <p>${benefit.summary}</p>
        <h4 class="mb-3">description</h4>
        <p>${benefit.description}</p>
        <h4 class="mb-3">Eligibility</h4>
        <p>${benefit.eligibility}</p>
        <h4 class="mb-3">Required Documents</h4>
        <p>${benefit.requiredDocuments}</p>
      `;
      benefitDetailsContainer.insertAdjacentHTML("afterbegin", html);
    } else {
      console.error("Failed to fetch benefit details:", data.message);
      const newBenefitElement = document.createElement("div");
      newBenefitElement.innerHTML = `
        <h2 class="mb-3">${data.message}</h2>
      `;
      benefitDetailsContainer.appendChild(newBenefitElement);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Get the URLSearchParams object from the current URL
const urlSearchParams = new URLSearchParams(window.location.search);

// Get the value of the 'benefitId' parameter
const benefitId = urlSearchParams.get("benefitId");

// call the fetch function with the benefitId
await fetchBenefitDetails(benefitId);

//////////////////////
// add event listener on apply
const applyButton = document.querySelector("#applyBenefit");
applyButton.addEventListener("click", (e) => {
  e.preventDefault();

  // check if there is a token if not alert error
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token)
    return alert("You must login first to be able to apply to this benefit");

  // send the user to the form and put the benefit id on the params
  window.location.href = `./form/form.html?benefitId=${benefitId}`;
});
