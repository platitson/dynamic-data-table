import "./App.css";
import { Table } from "./components/Table";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  useWebSocket();

  return (
    <>
      <h1 className="mb-4">Food & Beverages Table</h1>
      <Table />
    </>
  );
}

export default App;
