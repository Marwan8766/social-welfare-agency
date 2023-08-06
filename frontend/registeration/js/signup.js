import host from "../../config.js";

const signupForm = document.querySelector("#register-form");

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Construct the form data object
  const formData = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    password: document.querySelector("#pass").value,
    passwordConfirm: document.querySelector("#re_pass").value,
  };

  // Send data to the signup API handler
  await signupApiHandler(formData);
});

const signupApiHandler = async (formData) => {
  try {
    const response = await fetch(`${host}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.status === "success") {
      // Handle success: Redirect to confirm email page or show success message
      console.log("User registered successfully");

      // Set user email in localStorage
      localStorage.setItem("userEmail", JSON.stringify(formData.email));

      // redirect user to confirm otp page
      window.location.href = "../registeration/otp.html";
    } else {
      // You can display the error message on the frontend to inform the user
      const errorMessage =
        data.message || "Registration failed. Please try again.";
      console.error("Registration failed:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // alert(error);
    // Handle other errors, such as network issues
  }
};
