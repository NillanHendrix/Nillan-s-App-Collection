import { useState } from 'react'

export default function CounterApp() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>Zähler</h1>
      <p>Stand: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>{' '}
      <button onClick={() => setCount(0)}>Zurücksetzen</button>
    </div>
  )
}
