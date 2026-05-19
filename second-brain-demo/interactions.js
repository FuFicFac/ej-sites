(function () {
  function initBrainPage() {
    const button = document.getElementById("brain-chaos-button");
    if (!button) return;
    const note = document.getElementById("brain-note");
    const fills = [
      document.getElementById("task-fill-1"),
      document.getElementById("task-fill-2"),
      document.getElementById("task-fill-3"),
    ];
    const thoughts = Array.from(document.querySelectorAll(".thought-bubble"));
    const states = [
      { widths: [112, 44, 78], note: "Current state: channel idea took over, admin got dropped, the site stalled halfway." },
      { widths: [56, 128, 92], note: "Current state: novelty shifted again, so the urgent thing shrank and tax admin suddenly matters." },
      { widths: [138, 22, 146], note: "Current state: one project got a burst of focus, two others are now hanging by a thread." },
    ];
    let index = 0;
    button.addEventListener("click", () => {
      index = (index + 1) % states.length;
      const state = states[index];
      fills.forEach((fill, i) => fill.setAttribute("width", String(state.widths[i])));
      thoughts.forEach((thought, i) => {
        thought.style.opacity = i === index ? "1" : i === (index + 1) % thoughts.length ? "0.85" : "0.55";
      });
      note.textContent = state.note;
    });
  }

  function initNormalPage() {
    const button = document.getElementById("normal-progress-button");
    if (!button) return;
    const note = document.getElementById("normal-note");
    const labels = ["Draft outline", "Reply to email", "Schedule follow-up", "Done for now"];
    const task = document.querySelector("#normal-current-task text:nth-of-type(2)");
    const circles = [
      document.getElementById("normal-check-1"),
      document.getElementById("normal-check-2"),
      document.getElementById("normal-check-3"),
    ];
    const marks = [
      document.getElementById("normal-checkmark-1"),
      document.getElementById("normal-checkmark-2"),
      document.getElementById("normal-checkmark-3"),
    ];
    let step = 0;
    button.addEventListener("click", () => {
      step = Math.min(step + 1, 3);
      if (task) task.textContent = labels[step] || labels[labels.length - 1];
      circles.forEach((circle, i) => {
        const active = i < step;
        circle.setAttribute("r", active ? "22" : "0");
        marks[i].style.opacity = active ? "1" : "0";
      });
      note.textContent =
        step < 3
          ? "Current state: the queue is still intact, and working memory is holding the next item steady."
          : "Current state: sequence complete, no loose thread required.";
    });
  }

  function initSecondPage() {
    const button = document.getElementById("second-bridge-button");
    if (!button) return;
    const signal = document.getElementById("bridge-signal");
    const catchNode = document.getElementById("bridge-catch");
    const caption = document.getElementById("bridge-caption");
    const note = document.getElementById("second-note");
    let running = false;
    button.addEventListener("click", () => {
      if (running) return;
      running = true;
      signal.setAttribute("cx", "452");
      caption.textContent = "Dropped thought detected";
      note.textContent = "Current state: MEMORY.md has spotted a thread falling out of working memory.";
      const frames = [485, 520, 560, 600, 642, 680, 700];
      frames.forEach((value, index) => {
        window.setTimeout(() => {
          signal.setAttribute("cx", String(value));
          if (index === 2) caption.textContent = "Routing through external memory";
          if (index === frames.length - 1) {
            catchNode.setAttribute("fill", "#c4b5fd");
            caption.textContent = "Caught, stored, connected, and ready for any model";
            note.textContent = "Current state: the system caught the thought and routed it into memory, agents, diary, and wiki.";
            window.setTimeout(() => {
              catchNode.setAttribute("fill", "#7dd3fc");
              running = false;
            }, 900);
          }
        }, index * 180);
      });
    });
  }

  function initHarvestPage() {
    const button = document.getElementById("harvest-cycle-button");
    const steps = Array.from(document.querySelectorAll("#harvest-step-list li"));
    if (!button || !steps.length) return;
    const note = document.getElementById("harvest-note");
    const arcs = Array.from(document.querySelectorAll(".flow-arc"));
    const nodes = Array.from(document.querySelectorAll(".flow-node"));
    let active = 0;
    const messages = [
      "Current step: raw work is entering the system.",
      "Current step: cron has fired and HARVEST is awake.",
      "Current step: transcripts are being read for decisions, changes, and loose threads.",
      "Current step: fresh wiki pages are being created or updated.",
      "Current step: new facts are linking back into the existing graph.",
      "Current step: the next session starts with inherited context instead of guesswork.",
    ];

    function syncHarvest(index) {
      steps.forEach((step, i) => step.classList.toggle("is-lit", i === index));
      arcs.forEach((arc, i) => arc.classList.toggle("is-active", i === index || (index === 0 && i === 6)));
      nodes.forEach((node, i) => node.classList.toggle("is-active", i === index));
      note.textContent = messages[index];
    }

    button.addEventListener("click", () => {
      active = (active + 1) % steps.length;
      syncHarvest(active);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = steps.indexOf(entry.target);
          if (idx >= 0) {
            active = idx;
            syncHarvest(active);
          }
        });
      },
      { threshold: 0.65 }
    );
    steps.forEach((step) => observer.observe(step));
  }

  initBrainPage();
  initNormalPage();
  initSecondPage();
  initHarvestPage();
})();
