const loginForm = document.querySelector("#login-form");

const loginApiHandler = async (formData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.status === "success") {
      console.log("Login successful");

      // get the token
      const token = data.token;

      // set the token in the localstorage
      localStorage.setItem("token", JSON.stringify(token));

      // redirect the user to home page
      window.location.href = "../index.html";
    } else {
      const errorMessage =
        data.message || "Login failed. Please check your credentials.";
      console.error("Login failed:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
};

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // get the formData
  const formData = {
    email: document.querySelector("#your_email").value,
    password: document.querySelector("#your_pass").value,
  };

  // send the api request
  await loginApiHandler(formData);
});
