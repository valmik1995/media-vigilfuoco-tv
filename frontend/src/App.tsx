import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainLayout from './layouts/MainLayout';

// Import delle Pagine
import PhotoPage from './pages/PhotoPage';
import PhotoGallery from './components/photos/PhotoGallery';
import VideoPage from './pages/VideoPage';
import Dashboard from './pages/DashboardPage';
import GalleriaPage from './pages/GalleriaPage';
import StoriaPage from './pages/StoriaPage';
import StoriaDetail from './pages/StoriaDetail';
import VistiPage from "./pages/VistiPage";
import VistiDetail from "./pages/VistiDetail";

// Inizializzazione del Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // I dati rimangono "fresh" per 5 minuti
      gcTime: 1000 * 60 * 30,    // La cache viene ripulita dopo 30 minuti di inattività
      retry: 1,                 // Ritenta una volta sola in caso di errore di rete
      refetchOnWindowFocus: false, // Evita di ricaricare i dati ogni volta che cambi scheda
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* GRUPPO 1: Pagine con Sidebar Standard (3/12) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/photos" element={<PhotoPage />} />
            <Route path="/videos" element={<VideoPage />} />
            <Route path="/archivio" element={<PhotoGallery />} />
          </Route>

          {/* GRUPPO 2: Pagine SENZA Sidebar (Full Width) */}
          {/* Spostiamo Storia fuori dal primo MainLayout per evitare il raddoppio */}
          <Route element={<MainLayout sidebar={null} />}>
            <Route path="/galleria" element={<GalleriaPage />} />
            <Route path="/visti-in-tv/:slug" element={<VistiDetail />} />
            <Route path="/visti-in-tv" element={<VistiPage />} />
            <Route path="/storia" element={<StoriaPage />} />
            <Route path="/storia/:slug" element={<StoriaDetail />} />
          </Route>

          {/* 404: Fuori o dentro il layout a seconda se vuoi vedere la Navbar */}
          <Route element={<MainLayout sidebar={null} />}>
            <Route
              path="*"
              element={
                <div className="text-center py-20 uppercase font-black">
                  <h1 className="text-4xl text-vvf-red">404</h1>
                  <p className="text-slate-500">Pagina non trovata</p>
                </div>
              }
            />
          </Route>
        </Routes>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;