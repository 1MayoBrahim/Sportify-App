import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> Welcome to Sportify</h1>
        <p>A Social Platform for Sports Enthusiasts</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Build with React
        </a>
      </header>
    </div>
  );
}

export default App;
