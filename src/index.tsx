import React from 'react'
import ReactDOM from 'react-dom/client'
import GH from './assets/gh.png'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement)
root.render(
  <React.StrictMode>
    <a
      href="https://github.com/cabaret/eldenring-boss-checklist"
      className="fixed top-0 right-8 z-20 border border-black flex h-8 w-8 justify-center items-center bg-[#1c1c1c] mr-px"
    >
      <img src={GH} className="w-6 h-6 flex justify-center align-center" alt="Github" />
    </a>
    <a href="https://cupofcode.be" className="fixed top-0 right-0 z-20 h-8 w-8 bg-[#1c1c1c]">
      <img src="https://cupofcode.be/favicon-32x32.png" alt="" />
    </a>
    <App />
  </React.StrictMode>,
)
