// Get the URLSearchParams object from the current URL
const urlSearchParams = new URLSearchParams(window.location.search);

// Get the value of the 'benefitId' parameter
const benefitId = urlSearchParams.get("benefitId");

// function to create case
const submitApplicationApiHandler = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const response = await fetch("http://127.0.0.1:8000/api/v1/cases", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
      },
      body: formData,
    });

    const data = await response.json();
    console.log(`data:${JSON.stringify(data)}`);

    if (data.status === "success") {
      // Handle success: Redirect to confirm email page or show success message
      console.log("Application submitted successfully");

      // redirect user to confirm otp page
      window.location.href = "../cases.html";
    } else {
      // You can display the error message on the frontend to inform the user
      const errorMessage =
        data.message || "Application submission failed. Please try again.";
      console.error("Application Submission failed:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert(error);
    // Handle other errors, such as network issues
  }
};

const applicationForm = document.querySelector("#application_form");
// add eventListener to form submit to create the case
applicationForm.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log("submitted...");

  // Get selected gender value
  const selectedGender = document.querySelector('input[name="Gender"]:checked');
  const genderValue = selectedGender ? selectedGender.value : "";

  // Get selected employment value
  const selectedEmployement = document.querySelector(
    'input[name="employment"]:checked'
  );
  const employmentValue = selectedEmployement ? selectedEmployement.value : "";

  // Get selected disability value
  const selectedDisability = document.querySelector(
    'input[name="Disability"]:checked'
  );
  const disabilityValue = selectedDisability ? selectedDisability.value : "";

  console.log(`benefitID: ${benefitId}`);

  // get the data
  const formData = new FormData();

  formData.append("benefit", benefitId);
  formData.append("userName", document.querySelector("#userName").value);
  formData.append("phone", document.querySelector("#phone_number").value);
  formData.append("email", document.querySelector("#user_email").value);
  formData.append("gender", genderValue);
  formData.append("birthDate", document.querySelector("#birthDate").value);
  formData.append("employment", employmentValue);
  formData.append("disability", disabilityValue);
  formData.append("question1", document.querySelector("#question1").value);
  formData.append("question2", document.querySelector("#question2").value);

  const nationalIdProofFile = document.querySelector(
    "input[name='national_id_input']"
  ).files[0];
  const incomeProofFile = document.querySelector("input[name='income_proof']")
    .files[0];
  const disabilityProofFile = document.querySelector(
    "input[name='disability_proof']"
  ).files[0];

  formData.append("nationalIdProof", nationalIdProofFile);
  formData.append("incomeProof", incomeProofFile);
  formData.append("disabilityProof", disabilityProofFile);

  // call the applicationSubmissionAPIHAnlder
  await submitApplicationApiHandler(formData);
});
