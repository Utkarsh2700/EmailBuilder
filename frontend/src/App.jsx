import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Routes from "./routes/Routes.jsx";
import BuilderPage from "./pages/BuilderPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Routes />}>
      <Route path="/" element={<BuilderPage />} />
    </Route>,
  ])
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
