const token = JSON.parse(localStorage.getItem("token"));
const socket = io("http://localhost:8000", {
  auth: {
    token,
  },
});

// Get the URLSearchParams object from the current URL
const urlSearchParams = new URLSearchParams(window.location.search);

// Get the value of the 'caseId' parameter
const caseId = urlSearchParams.get("caseId");

socket.emit("fetchCase", caseId);

socket.on("connect", () => {
  console.log("Connected to server");
});
// Listen for casesList event
socket.on("case", (caseDoc) => {
  console.log("Received case event:", caseDoc);
  console.log(`caseDoc: ${JSON.stringify(caseDoc)}`);

  const caseContainer = document.querySelector("#caseDetails");

  const html = `
        <h1 class="mb-3">${caseDoc.benefit.name}</h1>
        <h4 class="mb-3">Status</h4>
        <p>${caseDoc.status}</p>
        <h4 class="mb-3">Notes</h4>
        <p>${caseDoc.notes}</p>
        <h2 class="mb-3">Application</h2>
        <h4 class="mb-3">Full Name</h4>
        <p>${caseDoc.application.userName}</p>
        <h4 class="mb-3">Email</h4>
        <p>${caseDoc.application.email}</p>
        <h4 class="mb-3">Phone</h4>
        <p>${caseDoc.application.phone}</p>
        <h4 class="mb-3">Gender</h4>
        <p>${caseDoc.application.gender}</p>
        <h4 class="mb-3">Birth Date</h4>
        <p>${new Date(caseDoc.application.birthDate).toLocaleDateString()}</p>
        <h4 class="mb-3">Income</h4>
        <p>${caseDoc.application.income}</p>
        ${
          Number(caseDoc.application.income) > 0
            ? `        <h4 class="mb-3">Income Proof</h4>
        <img src="${caseDoc.application.incomeProof}" width="300" height="200" alt="Income Proof" />`
            : ""
        }
        <h4 class="mb-3">Employment</h4>
        <p>${
          caseDoc.application.employment === true
            ? "Currently Employed"
            : "Currently Not Employed"
        }</p>
        <h4 class="mb-3">Disability</h4>
        <p>${
          caseDoc.application.disability === true
            ? "Has a Disability"
            : "Doesn't have a Disability"
        }</p>
        ${
          caseDoc.application.disability === true
            ? `        <h4 class="mb-3">Disability Proof</h4>
        <img src="${caseDoc.application.nationalIdProof}" width="300" height="200" alt="Disability Proof" />`
            : ""
        }
        <h4 class="mb-3">Why do you need this benefit ?</h4>
        <p>${caseDoc.application.question1}</p>
        <h4 class="mb-3">How this benefit will help you ?</h4>
        <p>${caseDoc.application.question2}</p>
        <h4 class="mb-3">National ID</h4>
        <img src="${
          caseDoc.application.nationalIdProof
        }" width="300" height="200" alt="National ID" />
      `;
  if (caseDoc.user.role !== "admin") {
    caseContainer.innerHTML = html;
  } else {
    caseContainer.insertAdjacentHTML("afterbegin", html);
  }
});

socket.on("caseChanged", () => {
  socket.emit("fetchCase", caseId);
});

const caseEditButton = document.querySelector("#editCase");
if (caseEditButton !== undefined) {
  caseEditButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/cases/case-edit-form.html?caseId=${caseId}`;
  });
}
