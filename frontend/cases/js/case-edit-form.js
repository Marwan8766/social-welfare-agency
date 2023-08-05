// Get the URLSearchParams object from the current URL
const urlSearchParams = new URLSearchParams(window.location.search);

// Get the value of the 'caseId' parameter
const caseId = urlSearchParams.get("caseId");
const caseStatus = urlSearchParams.get("caseStatus");
const caseNotes = urlSearchParams.get("caseNotes");

// function to create case
const submitCaseEditApiHandler = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/cases/${caseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      // Handle success: Redirect to confirm email page or show success message
      console.log("Case Edited successfully");

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

const caseForm = document.querySelector("#case-edit-form");
// add eventListener to form submit to create the case
caseForm.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log("submitted...");

  const formStatus = document.querySelector("#status").value;
  const formNotes = document.querySelector("#notes").value;

  const formData = {};

  if (formStatus !== undefined) formData.status = formStatus;
  if (formNotes !== undefined) formData.notes = formNotes;

  // call the applicationSubmissionAPIHAnlder
  await submitCaseEditApiHandler(formData);
});
