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

  const labsModal = document.getElementById("labsModal");
  const joinLabsBtn = document.getElementById("joinLabsBtn");
  const closeLabsBtn = document.getElementById("closeLabsBtn");

  const assistantFab = document.getElementById("assistantFloating");
  const authorNote = document.getElementById("authorNote");

  let hideTimeout = null;
  let insightLocked = false; // ✅ NEW: hover lock

  // ---------- CONFIG ----------
  const APP_URL = "https://orange-moss-08315ef00.2.azurestaticapps.net";
  const VISITOR_API =
    "https://predyxlab-api.blackglacier-cde78dbb.centralindia.azurecontainerapps.io/visitor-log";

  const assistantText =
    "An upcoming AI research assistant that can ingest financial documents, analyze context, and answer questions with traceable insights. Planned for PredyxLab v2.0.";

  // ---------- OVERLAY HELPERS ----------
  const showInsight = (title, content) => {
    clearTimeout(hideTimeout);
    insightLocked = true;

    overlayTitle.textContent = title;
    overlayContent.textContent = content;
    overlay.classList.remove("hidden-soft");
  };

  const hideInsight = () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!insightLocked) {
        overlay.classList.add("hidden-soft");
      }
    }, 180); // ✅ slightly higher delay = no flicker
  };

  const unlockInsight = () => {
    insightLocked = false;
    hideInsight();
  };

  // ---------- LAUNCH APP (CLICK) ----------
  if (launchBtn && modal) {
    launchBtn.addEventListener("click", () => {
      if (sessionStorage.getItem("visitorLogged")) {
        window.location.href = APP_URL;
      } else {
        modal.classList.remove("hidden");
      }
    });
  }

  // ---------- MODAL ACTIONS ----------
  if (continueBtn) {
    continueBtn.addEventListener("click", async () => {
      const name = document.getElementById("nameInput")?.value || "";
      const email = document.getElementById("emailInput")?.value || "";

      try {
        await fetch(VISITOR_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });
      } catch {
        console.warn("Visitor logging failed");
      }

      sessionStorage.setItem("visitorLogged", "true");
      window.location.href = APP_URL;
    });
  }

  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      sessionStorage.setItem("visitorLogged", "true");
      window.location.href = APP_URL;
    });
  }

  // ---------- BUTTON HOVERS ----------
  if (launchBtn) {
    launchBtn.addEventListener("mouseenter", () =>
      showInsight(
        "Launch PredyxLab",
        "Enter the core application for NSE stock price forecasting, trend analysis, and scenario-based insights."
      )
    );
    launchBtn.addEventListener("mouseleave", unlockInsight);
  }

  if (assistantBtn) {
    assistantBtn.addEventListener("mouseenter", () =>
      showInsight("Research Assistant", assistantText)
    );
    assistantBtn.addEventListener("mouseleave", unlockInsight);
  }

  if (labsBtn) {
    labsBtn.addEventListener("mouseenter", () =>
      showInsight(
        "Labs",
        "Experimental models, early signals, and research ideas. Some evolve into core features."
      )
    );
    labsBtn.addEventListener("mouseleave", unlockInsight);

    labsBtn.addEventListener("click", () => {
      if (labsModal) labsModal.classList.remove("hidden");
    });
  }

  // ---------- LABS MODAL ----------
  if (joinLabsBtn) {
    joinLabsBtn.addEventListener("click", async () => {
      const name = document.getElementById("labsNameInput")?.value || "";
      const email = document.getElementById("labsEmailInput")?.value || "";

      try {
        await fetch(VISITOR_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, interest: "labs_beta" }),
        });
      } catch {
        console.warn("Labs beta signup failed");
      }

      labsModal.classList.add("hidden");
    });
  }

  if (closeLabsBtn) {
    closeLabsBtn.addEventListener("click", () => {
      labsModal.classList.add("hidden");
    });
  }

  // ---------- ASSISTANT FAB ----------
  if (assistantFab) {
    assistantFab.addEventListener("mouseenter", () =>
      showInsight("Research Assistant", assistantText)
    );
    assistantFab.addEventListener("mouseleave", unlockInsight);
    assistantFab.addEventListener("click", () =>
      showInsight("Research Assistant", assistantText)
    );
  }

  // ---------- AUTHOR NOTE ----------
  if (authorNote) {
    authorNote.addEventListener("mouseenter", () =>
      showInsight(
        "From the Author",
        "PredyxLab is a personal research project by T Abhilash, created out of a deep interest in understanding market behavior through data, models, and thoughtful experimentation.\n\nThe platform is designed as a learning space — to explore forecasts, identify trends, and reason through scenarios with clarity and discipline. It is an analytical tool, not a source of financial advice."
      )
    );
    authorNote.addEventListener("mouseleave", unlockInsight);
  }

  // ---------- FEATURE CARDS ----------
  document.querySelectorAll(".feature-card").forEach((card) => {
    const type = card.dataset.feature;

    card.addEventListener("mouseenter", () => {
      if (type === "forecasting") {
        showInsight(
          "Forecasting",
          "PredyxLab analyzes historical NSE price behavior to estimate forward-looking price ranges. These forecasts are probabilistic in nature and intended to support analysis, not guarantee outcomes."
        );
      }

      if (type === "trend-analysis") {
        showInsight(
          "Trend Analysis",
          "Trend analysis focuses on identifying momentum, direction, and persistence in price movements. It helps separate meaningful structural shifts from short-term market noise."
        );
      }

      if (type === "scenario-insights") {
        showInsight(
          "Scenario Insights",
          "Scenario insights explore multiple possible future paths rather than a single prediction. This approach encourages contingency thinking and better decision preparation under uncertainty."
        );
      }
    });

    card.addEventListener("mouseleave", unlockInsight);
  });
});
