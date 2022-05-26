import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement)
root.render(
  <React.StrictMode>
    <a href="https://cupofcode.be" className="fixed bottom-0 right-0 z-20 bg-black">
      <img src="https://cupofcode.be/favicon-32x32.png" alt="" />
    </a>
    <App />
  </React.StrictMode>,
)
