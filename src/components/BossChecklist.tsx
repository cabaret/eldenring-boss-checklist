import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { groupBy, prop } from 'ramda'
import { Boss } from '../data/bosses'

const LOCAL_STORAGE_KEY = 'eldenring.checklist.bosses'

type LocationHeaderProps = {
  location: string
  killed: number
  total: number
}

function LocationHeader({ killed, total, location }: LocationHeaderProps) {
  return (
    <h3 className="sticky top-0 bg-white text-2xl pl-6 pb-2 my-4 border-b-2 border-grey-500">
      {location}{' '}
      <span className="text-lg">
        ({killed}/{total})
      </span>
    </h3>
  )
}

type LocationBossTableProps = {
  killed: Array<number>
  bosses: Array<Boss>
  onBossSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function LocationBossTable({ killed, bosses, onBossSelect }: LocationBossTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="w-28">Killed</th>
          <th className="text-left w-3/12">Name</th>
          <th className="text-left w-2/12">Location</th>
          <th className="text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        {bosses.map(b => (
          <tr
            key={b.id}
            className={classNames({
              'text-gray-300': killed.includes(b.id),
            })}
          >
            <td className="text-center">
              <label htmlFor={b.id.toString()} className="block">
                <input
                  type="checkbox"
                  value={b.id}
                  name={b.id.toString()}
                  checked={killed.includes(b.id)}
                  id={b.id.toString()}
                  className=""
                  onChange={onBossSelect}
                />
              </label>
            </td>
            <td>{b.name}</td>
            <td>{b.location}</td>
            <td>{b.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type BossChecklistProps = {
  bosses: Array<Boss>
}

function BossChecklist({ bosses }: BossChecklistProps) {
  const bossesByLocation = groupBy(prop('location'), bosses)

  const [killedBosses, setKilledBosses] = useState<Array<typeof bosses[number]['id']>>([])

  useEffect(() => {
    setKilledBosses(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'))
  }, [])

  const onBossSelect = ({ target: { checked, value } }: React.ChangeEvent<HTMLInputElement>) => {
    const nextKilledBosses = checked
      ? [...killedBosses, parseInt(value)]
      : killedBosses.filter(id => parseInt(value) !== id)

    setKilledBosses(nextKilledBosses)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextKilledBosses))
  }

  const getNumberOfKilledForLocation = (bossesForLocation: Array<Boss>, killedBosses: Array<number>) =>
    bossesForLocation.reduce((acc, boss) => (killedBosses.includes(boss.id) ? acc + 1 : acc), 0)

  return (
    <>
      <h2 className="text-4xl pl-6">
        Total: {killedBosses.length}/{bosses.length}
      </h2>
      {Object.entries(bossesByLocation).map(([location, bossesForLocation]) => (
        <div key={location}>
          <LocationHeader
            location={location}
            killed={getNumberOfKilledForLocation(bossesForLocation, killedBosses)}
            total={bossesForLocation.length}
          />
          <LocationBossTable killed={killedBosses} bosses={bossesForLocation} onBossSelect={onBossSelect} />
        </div>
      ))}
    </>
  )
}

export default BossChecklist
