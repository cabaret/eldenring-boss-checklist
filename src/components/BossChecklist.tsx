import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { groupBy, prop } from 'ramda'
import { Boss } from '../data/bosses'

const BOSS_LIST_LOCAL_STORAGE_KEY = 'eldenring.checklist.bosses'
const LOCKOUT_LIST_LOCAL_STORAGE_KEY = 'eldenring.checklist.lockout'
const DESCRIPTIONS_LOCAL_STORAGE_KEY = 'eldenring.checklist.descriptions'

type LocationHeaderProps = {
  location: string
  killed: number
  lockedOut: number
  total: number
}

function LocationHeader({ killed, lockedOut, total, location }: LocationHeaderProps) {
  return (
    <h3 className="sticky top-0 bg-white text-2xl pl-6 pb-2 my-4 border-b-2 border-grey-500">
      {location}{' '}
      <span className="text-lg">
        ({killed}/{total})
      </span>{' '}
      {!!lockedOut && <span className="text-lg text-gray-300">(Locked out: {lockedOut})</span>}
    </h3>
  )
}

type LocationBossTableProps = {
  killed: Array<number>
  lockedOut: Array<number>
  bosses: Array<Boss>
  showDescription: boolean
  onBossSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBossLockOutSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function LocationBossTable({
  killed,
  lockedOut,
  bosses,
  onBossSelect,
  onBossLockOutSelect,
  showDescription,
}: LocationBossTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="w-20">Killed</th>
          <th className="w-28">Locked out</th>
          <th className="text-left w-3/12">Name</th>
          <th className="text-left w-2/12">Location</th>
          <th className={classNames('text-left', { invisible: !showDescription })}>Description</th>
        </tr>
      </thead>
      <tbody>
        {bosses.map(b => (
          <tr
            key={b.id}
            className={classNames({
              'text-gray-300': killed.includes(b.id) && !lockedOut.includes(b.id),
              'text-gray-100': lockedOut.includes(b.id),
            })}
          >
            <td className="text-center">
              {!lockedOut.includes(b.id) && (
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
              )}
            </td>
            <td className="text-center">
              {!killed.includes(b.id) && (
                <label htmlFor={b.id.toString()} className="block">
                  <input
                    type="checkbox"
                    value={b.id}
                    name={b.id.toString()}
                    checked={lockedOut.includes(b.id)}
                    id={b.id.toString()}
                    className=""
                    onChange={onBossLockOutSelect}
                  />
                </label>
              )}
            </td>
            <td>{b.name}</td>
            <td>{b.location}</td>
            <td className={classNames({ invisible: !showDescription })}>{b.description}</td>
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
  const [lockedOut, setLockedOut] = useState<Array<typeof bosses[number]['id']>>([])

  const [showDescription, setShowDescription] = useState(
    JSON.parse(window.localStorage.getItem(DESCRIPTIONS_LOCAL_STORAGE_KEY) || 'false'),
  )

  useEffect(() => {
    setLockedOut(JSON.parse(localStorage.getItem(LOCKOUT_LIST_LOCAL_STORAGE_KEY) || '[]'))
    setKilledBosses(JSON.parse(localStorage.getItem(BOSS_LIST_LOCAL_STORAGE_KEY) || '[]'))
  }, [])

  const onBossSelect = ({ target: { checked, value } }: React.ChangeEvent<HTMLInputElement>) => {
    const nextKilledBosses = checked
      ? [...killedBosses, parseInt(value)]
      : killedBosses.filter(id => parseInt(value) !== id)

    setKilledBosses(nextKilledBosses)
    localStorage.setItem(BOSS_LIST_LOCAL_STORAGE_KEY, JSON.stringify(nextKilledBosses))
  }

  const onBossLockOutSelect = ({ target: { checked, value } }: React.ChangeEvent<HTMLInputElement>) => {
    const nextLockedBosses = checked ? [...lockedOut, parseInt(value)] : lockedOut.filter(id => parseInt(value) !== id)

    setLockedOut(nextLockedBosses)
    localStorage.setItem(LOCKOUT_LIST_LOCAL_STORAGE_KEY, JSON.stringify(nextLockedBosses))
  }

  const getNumberOfKilledForLocation = (bossesForLocation: Array<Boss>, killedBosses: Array<number>) =>
    bossesForLocation.reduce((acc, boss) => (killedBosses.includes(boss.id) ? acc + 1 : acc), 0)

  const getNumberOfLockedForLocation = (bossesForLocation: Array<Boss>, lockedOut: Array<number>) =>
    bossesForLocation.reduce((acc, boss) => (lockedOut.includes(boss.id) ? acc + 1 : acc), 0)

  return (
    <>
      <h2 className="text-4xl pl-6">
        Total: {killedBosses.length}/{bosses.length}
      </h2>

      <label className="inline-flex my-4 pl-6 items-center">
        <span>show descriptions</span>{' '}
        <input
          type="checkbox"
          className="ml-2"
          checked={showDescription}
          onChange={e => {
            window.localStorage.setItem(DESCRIPTIONS_LOCAL_STORAGE_KEY, JSON.stringify(e.target.checked))
            setShowDescription(e.target.checked)
          }}
        />
      </label>

      {Object.entries(bossesByLocation).map(([location, bossesForLocation]) => (
        <div key={location}>
          <LocationHeader
            location={location}
            killed={getNumberOfKilledForLocation(bossesForLocation, killedBosses)}
            lockedOut={getNumberOfLockedForLocation(bossesForLocation, lockedOut)}
            total={bossesForLocation.length}
          />
          <LocationBossTable
            killed={killedBosses}
            lockedOut={lockedOut}
            bosses={bossesForLocation}
            onBossSelect={onBossSelect}
            onBossLockOutSelect={onBossLockOutSelect}
            showDescription={showDescription}
          />
        </div>
      ))}
    </>
  )
}

export default BossChecklist
