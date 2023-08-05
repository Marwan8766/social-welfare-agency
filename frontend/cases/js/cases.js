const token = JSON.parse(localStorage.getItem("token"));
const socket = io("http://localhost:8000", {
  auth: {
    token,
  },
});

socket.emit("fetchCasesList");

socket.on("connect", () => {
  console.log("Connected to server");
});
// Listen for casesList event
socket.on("casesList", (cases) => {
  console.log("Received casesList event:", cases);
  console.log(`cases: ${JSON.stringify(cases)}`);

  const casesContainer = document.querySelector("#cases");
  casesContainer.innerHTML = "";
  if (cases.length === 0) {
    console.log("empty...");
    const html = ` <div class="blog-entry align-self-stretch">
    <div class="text p-4 d-block">
      <div class="meta mb-3"></div>
      
      <h1 class="heading mt-3">
        There is no cases found
      </h1>

    </div>
  </div>`;
    casesContainer.innerHTML = html;
    return;
  }
  cases.forEach((currentCase) => {
    const newCaseElement = document.createElement("div");
    newCaseElement.classList.add("col-md-4");
    newCaseElement.innerHTML = `
      <div class="blog-entry align-self-stretch">
        <div class="text p-4 d-block">
          <div class="meta mb-3"></div>
          <h1 class="heading mt-3">
            <a id="caseBenefitName" href="case-single.html?caseId=${currentCase._id}">${currentCase.benefit.name}</a>
          </h1>
          <h3 class="heading mt-3">
            Status
          </h3>
          <p>
            ${currentCase.status}
          </p>
          <h3 class="heading mt-3">
            Notes
          </h3>
          <p>
            ${currentCase.notes}
          </p>
        </div>
      </div>
    `;

    casesContainer.appendChild(newCaseElement);
  });
});

socket.on("casesListChanged", () => {
  socket.emit("fetchCasesList");
});
