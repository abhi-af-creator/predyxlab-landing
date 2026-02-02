document.addEventListener("DOMContentLoaded", () => {
  // ---------- ELEMENTS ----------
  const launchBtn = document.getElementById("launchAppBtn");
  const modal = document.getElementById("visitorModal");
  const continueBtn = document.getElementById("continueBtn");
  const skipBtn = document.getElementById("skipBtn");

  const assistantBtn = document.getElementById("assistantBtn");
  const labsBtn = document.getElementById("labsBtn");

  const overlay = document.getElementById("insightOverlay");
  const overlayTitle = document.getElementById("insightTitle");
  const overlayContent = document.getElementById("insightContent");

  let hideTimeout = null;

  // ---------- CONFIG ----------
  const APP_URL = "https://your-react-app-url";
  const VISITOR_API =
    "https://predyxlab-api.blackglacier-cde78dbb.centralindia.azurecontainerapps.io/visitor-log";

  // ---------- OVERLAY HELPERS ----------
  const showInsight = (title, content) => {
    clearTimeout(hideTimeout);
    overlayTitle.textContent = title;
    overlayContent.textContent = content;
    overlay.classList.remove("hidden-soft");
  };

  const hideInsight = () => {
    hideTimeout = setTimeout(() => {
      overlay.classList.add("hidden-soft");
    }, 120);
  };

  // ---------- LAUNCH APP (CLICK) ----------
  launchBtn.addEventListener("click", () => {
    if (sessionStorage.getItem("visitorLogged")) {
      window.location.href = APP_URL;
    } else {
      modal.classList.remove("hidden"); // IMPORTANT
    }
  });

  // ---------- MODAL ACTIONS ----------
  continueBtn.addEventListener("click", async () => {
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;

    try {
      await fetch(VISITOR_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
    } catch {
      console.warn("Visitor logging failed");
    }

    sessionStorage.setItem("visitorLogged", "true");
    window.location.href = APP_URL;
  });

  skipBtn.addEventListener("click", () => {
    sessionStorage.setItem("visitorLogged", "true");
    window.location.href = APP_URL;
  });

  // ---------- BUTTON HOVERS ----------
  launchBtn.addEventListener("mouseenter", () =>
    showInsight(
      "Launch PredyxLab",
      "Enter the core application for NSE stock price forecasting, trend analysis, and scenario-based insights."
    )
  );
  launchBtn.addEventListener("mouseleave", hideInsight);

  assistantBtn.addEventListener("mouseenter", () =>
    showInsight(
      "Research Assistant",
      "An upcoming AI assistant designed to analyze financial documents with traceable insights."
    )
  );
  assistantBtn.addEventListener("mouseleave", hideInsight);

  labsBtn.addEventListener("mouseenter", () =>
    showInsight(
      "Labs",
      "Experimental models, early signals, and research ideas. Some evolve into core features."
    )
  );
  labsBtn.addEventListener("mouseleave", hideInsight);

  // ---------- FEATURE CARDS ----------
  document.querySelectorAll(".feature-card").forEach((card) => {
    const type = card.dataset.feature;

    card.addEventListener("mouseenter", () => {
      if (type === "forecasting") {
        showInsight(
          "Forecasting (NSE)",
          "Probabilistic price range estimation using historical NSE data."
        );
      }

      if (type === "trend-analysis") {
        showInsight(
          "Trend Analysis",
          "Momentum and directional signal analysis."
        );
      }

      if (type === "scenario-insights") {
        showInsight(
          "Scenario Insights",
          "Multiple possible market paths instead of single-point predictions."
        );
      }
    });

    card.addEventListener("mouseleave", hideInsight);
  });
});
