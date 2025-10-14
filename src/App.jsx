import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/Header2'
import Home from './pages/home/HomePage'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import RegisterPage from './pages/register/RegisterPage'
import LoginPage from './pages/login/LoginPage'
import UserPage from './pages/user/UserPage'
import Footer from './components/footer/Footer'


function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/me" element={<UserPage />} />
        </Routes>
      </main>
      <Footer />

    </div>
  )
}

export default App
