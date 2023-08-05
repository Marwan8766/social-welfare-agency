const verifyButton = document.querySelector("#verify");
const resendButton = document.querySelector("#resend");
const userEmailField = document.querySelector("#userEmail");

const userEmail = JSON.parse(localStorage.getItem("userEmail"));
userEmailField.innerHTML = userEmail;

// Function to handle OTP verification
const verifyOTP = async (otpValue, userEmail) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/auth/confirmEmail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpValue, email: userEmail }),
      }
    );

    const data = await response.json();
    console.log(`data: ${JSON.stringify(data)}`);

    if (data.status === "success") {
      console.log("OTP verified successfully");

      const token = data.token;
      console.log(`token: ${token}`);

      // set a token in localstorage
      localStorage.setItem("token", JSON.stringify(token));

      // You can redirect the user to a success page
      window.location.href = "../index.html";
    } else {
      const errorMessage =
        data.message || "OTP verification failed. Please try again.";
      console.error("OTP verification failed:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
};

// Function to handle OTP resend
const resendOTP = async (userEmail) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/auth/resendOtp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      console.log("OTP reend successfully");
      resendButton.innerHTML = `
      `;
    } else {
      const errorMessage =
        data.message || "OTP verification failed. Please try again.";
      console.error("OTP verification failed:", errorMessage);
      alert(errorMessage);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    alert("An error occurred. Please try again.");
  }
};

// Event listener for the OTP verification verrify button
verifyButton.addEventListener("click", async function (e) {
  e.preventDefault();

  // retreive the user email
  // const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  console.log("User email:", userEmail);

  // Concatenate OTP digits from multiple input fields
  const otpValue = Array.from(document.querySelectorAll(".form-control"))
    .map((input) => input.value)
    .join("");

  await verifyOTP(otpValue, userEmail);
});

// Event listener for the OTP verification resend button
resendButton.addEventListener("click", async function (e) {
  e.preventDefault();

  // retreive the user email
  // const userEmail = JSON.parse(localStorage.getItem("userEmail"));
  console.log("User email:", userEmail);

  await resendOTP(userEmail);
});
