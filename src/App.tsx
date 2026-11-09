import { AppStateProvider } from "./state/AppStateContext";
import { useRoute, type Route } from "./lib/route";
import { BottomNav, type NavTab } from "./components/BottomNav";
import { HomeScreen } from "./screens/HomeScreen";
import { ExplorerScreen } from "./screens/ExplorerScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { CompareScreen } from "./screens/CompareScreen";
import { ReferencesScreen } from "./screens/ReferencesScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

function activeTab(route: Route): NavTab {
  switch (route.name) {
    case "explore":
    case "material":
      return "explore";
    case "compare":
      return "compare";
    case "references":
    case "settings":
      return "more";
    default:
      return "home";
  }
}

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case "home":
      return <HomeScreen />;
    case "explore":
      return <ExplorerScreen initialQuery={route.query} />;
    case "material":
      return <DetailsScreen id={route.id} />;
    case "compare":
      return <CompareScreen />;
    case "references":
      return <ReferencesScreen />;
    case "settings":
      return <SettingsScreen />;
    case "notFound":
      return (
        <div className="empty-state">
          <h2>Page not found</h2>
          <a className="btn btn--outline" href="#/">
            Go to home
          </a>
        </div>
      );
  }
}

function AppContent() {
  const route = useRoute();

  return (
    <div className="app">
      <main className="page" key={route.name}>
        <Screen route={route} />
      </main>
      <BottomNav active={activeTab(route)} />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
