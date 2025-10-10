import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/Header'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Contact from './pages/contact/Contact'
import RegisterPage from './pages/register/RegisterPage'
import LoginPage from './pages/login/LoginPage'


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
        </Routes>
      </main>
      

    </div>
  )
}

export default App
