import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import News from './pages/News';
import LifeLogs from './pages/LifeLogs';
import Categories from './pages/Categories';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Navbar />
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<div><h2>文章列表頁面</h2></div>} />
              <Route path="/articles/:id" element={<div><h2>文章內容頁面</h2></div>} />
              <Route path="/news" element={<News />} />
              <Route path="/life-logs" element={<LifeLogs />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-dark text-white py-3">
          <div className="container text-center">
            <p className="mb-0">© 2025 Golang Blog. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
