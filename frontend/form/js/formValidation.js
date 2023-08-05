const employmentStatusElement = document.querySelector("#employment_status");
const income = document.querySelector("#income");
const incomeValueElemnt = document.querySelector("#income_value");
const incomeProof = document.querySelector("#income_proof");
const disabilityStatusElement = document.querySelector("#disability_status");
const disabilityProof = document.querySelector("#disability_proof");

// Event listener for employment radio buttons
const employmentRadioButtons = employmentStatusElement.querySelectorAll(
  'input[type="radio"]'
);

employmentRadioButtons.forEach((radio) => {
  radio.addEventListener("input", (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "true") income.classList.remove("hide");
    else income.classList.add("hide");
  });
});

const disabilityRadioButtons = disabilityStatusElement.querySelectorAll(
  'input[name="Disability"]'
);
disabilityRadioButtons.forEach((radio) => {
  radio.addEventListener("input", (e) => {
    const selectedValue = e.target.value;
    console.log(`selectedDisabilityStatus: ${selectedValue}`);
    if (selectedValue === "true") disabilityProof.classList.remove("hide");
    else disabilityProof.classList.add("hide");
  });
});

incomeValueElemnt.addEventListener("input", function (e) {
  e.preventDefault();
  const incomeValue = e.target.value;
  console.log(`incomeValue: ${incomeValue}`);
  if (incomeValue > 0) incomeProof.classList.remove("hide");
  else incomeProof.classList.add("hide");
});
