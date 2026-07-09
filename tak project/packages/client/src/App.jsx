import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import GamePage from './pages/GamePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PuzzlesPage from './pages/PuzzlesPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import GroupsPage from './pages/GroupsPage.jsx';

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? 'bg-tak-board text-white' : 'text-gray-700 hover:bg-gray-100'
  }`;

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link to="/" className="text-xl font-bold text-tak-board mr-4">
            TakHub
          </Link>
          <NavLink to="/" className={navLinkClass} end>
            Accueil
          </NavLink>
          <NavLink to="/jouer" className={navLinkClass}>
            Jouer en local
          </NavLink>
          <NavLink to="/en-ligne" className={navLinkClass}>
            Jouer en ligne
          </NavLink>
          <NavLink to="/puzzles" className={navLinkClass}>
            Puzzles
          </NavLink>
          <NavLink to="/blog" className={navLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/groupes" className={navLinkClass}>
            Groupes
          </NavLink>
          <div className="flex-1" />
          <NavLink to="/profil" className={navLinkClass}>
            Profil
          </NavLink>
          <NavLink to="/connexion" className={navLinkClass}>
            Connexion
          </NavLink>
          <NavLink to="/inscription" className={navLinkClass}>
            Inscription
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="text-center text-sm text-gray-500 py-4 border-t">
        TakHub — Projet DEC Informatique, Programmation Web et Applications
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/jouer" element={<PlayPage />} />
          <Route path="/en-ligne" element={<LobbyPage />} />
          <Route path="/partie/:id" element={<GamePage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/puzzles" element={<PuzzlesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/groupes" element={<GroupsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
