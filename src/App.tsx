import { BrowserRouter as Router } from 'react-router-dom';
import Container from './components/Container';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AuthProvider } from './context/AuthContext.tsx';
import Header from './components/Header';
import Footer from './components/Footer';

function AppContent() {
  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header />
      <div className="flex-grow">
        <Container>
          <AnimatedRoutes />
        </Container>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;