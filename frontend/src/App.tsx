import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './components/Home';
import News from './pages/News';
import LifeLogs from './pages/LifeLogs';
import Categories from './pages/Categories';
import LoanCalculator from './pages/tools/LoanCalculator';
import Base64 from './pages/tools/Base64';
import UnitConverter from './pages/tools/UnitConverter';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import ArticlesList from './pages/ArticlesList';
import ArticleEdit from './pages/ArticleEdit';
import ArticleDetail from './pages/ArticleDetail';
import TagsList from './pages/admin/TagsList';
import TagEdit from './pages/admin/TagEdit';
import CategoriesList from './pages/admin/CategoriesList';
import CategoryEdit from './pages/admin/CategoryEdit';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Navbar />
        <main className="flex-grow-1">
          <div className="container py-4">
            <Routes>
              {/* 公開路由 */}
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<News />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* 工具頁面路由 - 公開 */}
              <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
              <Route path="/tools/base64" element={<Base64 />} />
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/currency" element={<div><h2>匯率換算工具</h2></div>} />
              <Route path="/tools/gas-price" element={<div><h2>油價資訊工具</h2></div>} />
              
              {/* 需要普通用戶權限的路由 */}
              <Route path="/articles" element={
                <ProtectedRoute>
                  <ArticlesList />
                </ProtectedRoute>
              } />
              <Route path="/articles/:id" element={
                <ProtectedRoute>
                  <ArticleDetail />
                </ProtectedRoute>
              } />
              <Route path="/life-logs" element={
                <ProtectedRoute>
                  <LifeLogs />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              
              {/* 需要編輯者或管理員權限的路由 */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'editor']} />}>
                <Route path="/admin/*" element={<div><h2>Admin Dashboard</h2></div>} />
                <Route path="/admin/categories" element={<CategoriesList />} />
                <Route path="/admin/articles" element={<ArticlesList />} />
                <Route path="/admin/articles/new" element={<ArticleEdit />} />
                <Route path="/admin/articles/edit/:id" element={<ArticleEdit />} />
                <Route path="/admin/tags" element={<TagsList />} />
                <Route path="/admin/tags/new" element={<TagEdit />} />
                <Route path="/admin/tags/edit/:id" element={<TagEdit />} />
                <Route path="/admin/categories/new" element={<CategoryEdit />} />
                <Route path="/admin/categories/edit/:id" element={<CategoryEdit />} />
              </Route>
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
