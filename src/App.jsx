import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SmoothScroll from './components/providers/SmoothScroll';
import InitialLoadGate from './components/providers/InitialLoadGate';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter
        basename={import.meta.env.BASE_URL}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <InitialLoadGate>
          <SmoothScroll>
            <AppRoutes />
          </SmoothScroll>
        </InitialLoadGate>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App
