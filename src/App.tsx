import BossChecklist from './components/BossChecklist'
import bosses from './data/bosses'

function App() {
  return (
    <div className="p-4">
      <BossChecklist bosses={bosses} />
    </div>
  )
}

export default App
