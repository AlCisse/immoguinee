import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages publiques
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import About from './pages/About'
import Contact from './pages/Contact'

// Pages protégées
import Dashboard from './pages/Dashboard'
import MyProperties from './pages/MyProperties'
import AddProperty from './pages/AddProperty'
import EditProperty from './pages/EditProperty'
import Favorites from './pages/Favorites'
import Messages from './pages/Messages'
import Conversation from './pages/Conversation'
import Profile from './pages/Profile'
import Contracts from './pages/Contracts'
import ContractDetail from './pages/ContractDetail'
import Transactions from './pages/Transactions'

// Pages Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProperties from './pages/admin/AdminProperties'

// Page 404
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Routes publiques */}
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-properties" element={<MyProperties />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Conversation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        {/* Routes Admin */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/properties" element={<AdminProperties />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
