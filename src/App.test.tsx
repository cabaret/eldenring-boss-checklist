import { render, screen } from '@testing-library/react'
import App from './App'
import BossChecklist from './components/BossChecklist'
import bosses from './data/bosses'

jest.mock('./components/BossChecklist.tsx')

const BossChecklistMock = BossChecklist as jest.Mock

beforeEach(() => {
  BossChecklistMock.mockImplementation(() => <div data-testid="boss-checklist" />)
})

describe('<App />', () => {
  test('it renders the boss checklist component', () => {
    render(<App />)

    expect(screen.getByTestId('boss-checklist')).toBeInTheDocument()
    expect(BossChecklistMock).toHaveBeenCalledWith({ bosses }, {})
  })
})
