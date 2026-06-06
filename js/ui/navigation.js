export const navItems = [
  {
    id: "scan",
    label: "Scan",
  },
  {
    id: "tests",
    label: "Tests",
  },
  {
    id: "signals",
    label: "Signals",
  },
  {
    id: "results",
    label: "Results",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
  },
];

export function renderNavigation(state) {
  return `
    <nav class="app-nav">
      ${navItems
        .map(
          item => `
            <button
              class="app-nav-item ${state.ui.activeView === item.id ? "is-active" : ""}"
              data-nav-view="${item.id}"
              type="button"
            >
              ${item.label}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}