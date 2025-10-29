import './App.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import AppRoutes from './routes/Routes';


function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />

    </div>
  )
}

export default App
