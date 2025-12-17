import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Bookmarks } from './pages/Bookmarks';
import { CreateBookmark } from './pages/CreateBookmark';
import { EditBookmark } from './pages/EditBookmark';
import { Profile } from './pages/Profile';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import './App.css';

function AppContent() {
  const { token, fetchUser, user } = useAuthStore();
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const showNavbar = token && !isHomePage;

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      <main className={`main-content ${showNavbar ? 'with-navbar' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={token ? <Navigate to="/bookmarks" /> : <Login />} />
          <Route path="/signup" element={token ? <Navigate to="/bookmarks" /> : <Signup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/bookmarks/create" element={<CreateBookmark />} />
            <Route path="/bookmarks/edit/:id" element={<EditBookmark />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <ToastContainer />
      {!isHomePage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
