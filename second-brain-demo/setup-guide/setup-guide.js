function setAccordionState(details, open) {
  details.open = open;
  details.dataset.open = String(open);
}

function wireExpanders(root = document) {
  root.querySelectorAll("[data-expand]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.expand);
      if (target) {
        setAccordionState(target, true);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  root.querySelectorAll("[data-collapse]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.collapse);
      if (target) {
        setAccordionState(target, false);
      }
    });
  });
}

function wireProgress() {
  const accordions = Array.from(document.querySelectorAll("[data-progress-item]"));
  const bar = document.querySelector("[data-progress-bar]");
  const value = document.querySelector("[data-progress-value]");
  const doneCount = document.querySelector("[data-progress-count]");
  const listItems = Array.from(document.querySelectorAll("[data-progress-label]"));
  if (!accordions.length || !bar || !value || !doneCount) return;

  function render() {
    const openCount = accordions.filter((item) => item.open).length;
    const pct = Math.round((openCount / accordions.length) * 100);
    bar.style.width = pct + "%";
    value.textContent = pct + "%";
    doneCount.textContent = openCount + " / " + accordions.length;
    listItems.forEach((item, index) => {
      item.classList.toggle("is-done", accordions[index] && accordions[index].open);
    });
  }

  accordions.forEach((item) => item.addEventListener("toggle", render));
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  wireExpanders();
  wireProgress();
});
