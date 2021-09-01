import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import DnDFighters from './components/DnDFighters';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h2>DnD Fighters</h2>
        <DnDFighters />
      </div>
    </div>
  );
}

export default App;
