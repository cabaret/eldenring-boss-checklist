import { fireEvent, render, screen, within } from '@testing-library/react'
import { mockLocalStorage } from '../../test/mockLocalStorage'
import BossChecklist from './BossChecklist'

const { getItemMock, setItemMock } = mockLocalStorage()

beforeEach(() => {
  getItemMock.mockReturnValue(JSON.stringify([1, 4]))
})

const mockData = [
  {
    id: 1,
    name: 'Boss 1',
    location: 'Belgium',
    description: 'Big boss',
  },
  {
    id: 1,
    name: 'Boss 2',
    location: 'UK',
    description: 'Hard boss',
  },
  {
    id: 3,
    name: 'Boss 3',
    location: 'Belgium',
    description: 'Easy boss',
  },
  {
    id: 4,
    name: 'Boss 4',
    location: 'UK',
    description: 'Medium boss',
  },
]

describe('<BossChecklist />', () => {
  test('it renders a title with the total killed bosses', () => {
    render(<BossChecklist bosses={mockData} />)

    expect(screen.getByText('Total: 2/4')).toBeInTheDocument()
  })

  test('it renders a title and kill count per location', () => {
    render(<BossChecklist bosses={mockData} />)

    const belgiumLocationTitle = screen.getAllByText('Belgium')[0]

    expect(within(belgiumLocationTitle).getByText('(1/2)')).toBeInTheDocument()

    const ukLocationTitle = screen.getAllByText('UK')[0]

    expect(within(ukLocationTitle).getByText('(2/2)')).toBeInTheDocument()
  })

  test('it renders the data for a boss', () => {
    render(<BossChecklist bosses={mockData} />)

    const [header, killedBossRow, bossRow] = screen.getAllByRole('row')

    expect(within(header).getAllByRole('columnheader')[0]).toHaveTextContent('Killed')
    expect(within(header).getAllByRole('columnheader')[1]).toHaveTextContent('Name')
    expect(within(header).getAllByRole('columnheader')[2]).toHaveTextContent('Location')
    expect(within(header).getAllByRole('columnheader')[3]).toHaveTextContent('Description')

    expect(within(within(killedBossRow).getAllByRole('cell')[0]).getByRole('checkbox')).toBeChecked()
    expect(within(killedBossRow).getAllByRole('cell')[1]).toHaveTextContent('Boss 1')
    expect(within(killedBossRow).getAllByRole('cell')[2]).toHaveTextContent('Belgium')
    expect(within(killedBossRow).getAllByRole('cell')[3]).toHaveTextContent('Big boss')

    expect(within(within(bossRow).getAllByRole('cell')[0]).getByRole('checkbox')).not.toBeChecked()
    expect(within(bossRow).getAllByRole('cell')[1]).toHaveTextContent('Boss 3')
    expect(within(bossRow).getAllByRole('cell')[2]).toHaveTextContent('Belgium')
    expect(within(bossRow).getAllByRole('cell')[3]).toHaveTextContent('Easy boss')
  })

  test('it saves the boss status to localStorage', () => {
    render(<BossChecklist bosses={mockData} />)

    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()

    fireEvent.click(screen.getAllByRole('checkbox')[0])

    expect(setItemMock).toHaveBeenCalledWith('eldenring.checklist.bosses', '[4]')
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked()

    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked()

    fireEvent.click(screen.getAllByRole('checkbox')[1])
    expect(setItemMock).toHaveBeenCalledWith('eldenring.checklist.bosses', '[4,3]')
    expect(screen.getAllByRole('checkbox')[1]).toBeChecked()
  })
})
