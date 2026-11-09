import type { ReactNode } from "react";

export type NavTab = "home" | "explore" | "compare" | "more";

const TABS: { id: NavTab; label: string; href: string; icon: ReactNode }[] = [
  {
    id: "home",
    label: "Home",
    href: "#/",
    icon: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  },
  {
    id: "explore",
    label: "Explore",
    href: "#/explore",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
  },
  {
    id: "compare",
    label: "Compare",
    href: "#/compare",
    icon: <path d="M5 20V10M12 20V4M19 20v-7" />,
  },
  {
    id: "more",
    label: "More",
    href: "#/settings",
    icon: (
      <>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </>
    ),
  },
];

export function BottomNav({ active }: { active: NavTab }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((tab) => (
        <a
          key={tab.id}
          href={tab.href}
          className={`bottom-nav__item${tab.id === active ? " is-active" : ""}`}
          aria-current={tab.id === active ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {tab.icon}
          </svg>
          <span>{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}
