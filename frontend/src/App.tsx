import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Route components (each page is its own component)
import Home from "./pages/Home";
import About from "./pages/About";

// Root wrapper (kept empty so each page controls its own layout/header)
const RootRoute = createRootRoute({ component: () => <Outlet /> });

// Child routes (one per page)
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


// Build the tree (remove any you don't need)
const routeTree = RootRoute.addChildren([
  HomeRoute,
  AboutRoute,
]);

const router = createRouter({ routeTree });

// Type helper for TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
