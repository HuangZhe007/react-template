import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.less';
import Modals from 'modals';
import { routes } from 'routes';
function App() {
  return (
    <>
      <Modals />
      <BrowserRouter>
        <Routes>
          {routes.map((route) => {
            return <Route key={route.path} path={route.path} element={<route.element />} />;
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
