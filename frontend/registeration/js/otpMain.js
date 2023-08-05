let timerOn = true;
function timer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  document.getElementById("countdown").innerHTML = `Time left: ${m} : ${s}`;
  remaining -= 1;
  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    document.getElementById("resend").innerHTML = `
    `;
    return;
  }
  if (!timerOn) {
    return;
  }
  document.getElementById("resend").innerHTML = `Don't receive the code? 
  <span class="font-weight-bold text-color cursor" onclick="timer(60)">Resend
  </span>`;
}
timer(90);

const textInputs = document.querySelectorAll(".form-control");

textInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    const trimmedValue = value.substring(0, 1);
    e.target.value = trimmedValue;

    if (trimmedValue) {
      if (index < textInputs.length - 1) {
        textInputs[index + 1].focus();
      }
    }
  });
});
