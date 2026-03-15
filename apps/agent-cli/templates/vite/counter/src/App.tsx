import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>{{PROJECT_NAME}}</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
      </div>
      <p className="read-the-docs">
        Powered by Vite + React + TypeScript
      </p>
    </div>
  )
}

export default App
