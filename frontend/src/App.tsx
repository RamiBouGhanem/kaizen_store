import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import NotFoundPage from "./pages/NotFound";

// Root wrapper
const RootRoute = createRootRoute({ 
  component: () => <Outlet />,
});

// Child routes
const HomeRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Home,
});

const AboutRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/about",
  component: About,
});

const ShopRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/shop",
  component: Shop,
  validateSearch: (search: {
    team?: string;
    kitType?: string;
    season?: string;
    q?: string;
    sort?: string;
  }) => search,
});

// Catch-all route for 404 - must be last
const CatchAllRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "*",
  component: NotFoundPage,
});

// Build the route tree
const routeTree = RootRoute.addChildren([
  HomeRoute,
  AboutRoute,
  ShopRoute,
  CatchAllRoute, // This must be the last entry
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}