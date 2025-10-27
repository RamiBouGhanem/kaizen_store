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
import Shop from "./pages/Shop";

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

const ShopRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/shop",
  component: Shop,
});


// Build the tree (remove any you don't need)
const routeTree = RootRoute.addChildren([
  HomeRoute,
  AboutRoute,
  ShopRoute
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



// COMING SOON PAGE
// import ComingSoon from "./pages/ComingSoon"; // <--- Import the new page

// function App() {
//   return (
//     <ComingSoon /> 
//   );
// }

// export default App;