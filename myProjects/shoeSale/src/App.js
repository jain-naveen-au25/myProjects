import "./styles.css";
import Source from "./Source"
import Filters from "./Filter"
export default function App() {
  return (
    <div className="App">
      <h1>Get Your Pair</h1>
      <Source/>
      <Filters/>
    </div>
  );
}
