import { Outlet } from "react-router-dom";
import { useLoading } from "./components/Loading/Loading";
import LazyLoading from "./components/Loading/LazyLoading";

function App() {
  const { isLoading } = useLoading();
  console.log(isLoading);
  return (
    <>
      {isLoading && <LazyLoading />}
      <Outlet />
    </>
  );
}

export default App;
