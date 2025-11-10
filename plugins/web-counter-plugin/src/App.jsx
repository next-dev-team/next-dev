import React, { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'web-counter-plugin:count'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadCount() }, [])
  useEffect(() => { if (!loading) saveCount() }, [count, loading])

  const loadCount = async () => {
    try {
      setLoading(true)
      setError(null)
      if (window.pluginAPI && window.pluginAPI.storage && window.tronConnected) {
        const saved = await window.pluginAPI.storage.get(STORAGE_KEY)
        if (typeof saved === 'number') setCount(saved)
        else if (typeof saved === 'string') setCount(parseInt(saved, 10) || 0)
        else setCount(0)
      } else {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved != null) setCount(parseInt(saved, 10) || 0)
      }
    } catch (err) {
      setError('Failed to load count')
      console.error('Error loading count:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveCount = async () => {
    try {
      if (window.pluginAPI && window.pluginAPI.storage && window.tronConnected) {
        await window.pluginAPI.storage.set(STORAGE_KEY, count)
      } else {
        localStorage.setItem(STORAGE_KEY, String(count))
      }
    } catch (err) {
      setError('Failed to save count')
      console.error('Error saving count:', err)
    }
  }

  const inc = () => setCount((c) => c + 1)
  const dec = () => setCount((c) => c - 1)
  const reset = () => setCount(0)

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading counter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Web Counter Plugin</h1>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="counter-card">
        <div className="count-display">{count}</div>
        <div className="actions">
          <button onClick={dec} className="btn">−</button>
          <button onClick={inc} className="btn">+</button>
          <button onClick={reset} className="btn secondary">Reset</button>
        </div>
      </div>
    </div>
  )
}

export default App