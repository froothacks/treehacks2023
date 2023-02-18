import logo from './logo.svg';
import './App.css';
import { useQuery } from "./convex/_generated/react";
import { useMutation } from "./convex/_generated/react";

function App() {
  // const data = useQuery("listMessages");
  const sendMessage = useMutation("sendMessage");
  const sendHello = () => sendMessage("Hello!", "me");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={sendHello}>click me!</button>
      </header>
    </div>
  );
}

export default App;
