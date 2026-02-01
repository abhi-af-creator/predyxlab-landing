const launchBtn = document.getElementById("launchBtn");
const modal = document.getElementById("visitorModal");
const continueBtn = document.getElementById("continueBtn");
const skipBtn = document.getElementById("skipBtn");

const assistantBtn = document.getElementById("assistantBtn");
const assistantFab = document.getElementById("assistantFloating");

// 🔗 CHANGE THESE WHEN READY
const APP_URL = "https://your-react-app-url";
const VISITOR_API = "https://predyxlab-api.blackglacier-cde78dbb.centralindia.azurecontainerapps.io/visitor-log";

launchBtn.onclick = () => {
  if (sessionStorage.getItem("visitorLogged")) {
    window.location.href = APP_URL;
  } else {
    modal.classList.remove("hidden");
  }
};

continueBtn.onclick = async () => {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;

  try {
    await fetch(VISITOR_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
  } catch (e) {
    console.warn("Visitor logging failed");
  }

  sessionStorage.setItem("visitorLogged", "true");
  window.location.href = APP_URL;
};

skipBtn.onclick = () => {
  sessionStorage.setItem("visitorLogged", "true");
  window.location.href = APP_URL;
};

const assistantMessage = () => {
  alert(
    "Our AI Research Assistant for document-based financial insights is launching soon.\n\nAvailable in PredyxLab v2.0."
  );
};

assistantBtn.onclick = assistantMessage;
assistantFab.onclick = assistantMessage;
