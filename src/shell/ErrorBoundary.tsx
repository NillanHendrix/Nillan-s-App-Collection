import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Ändert sich der Key (z. B. App-ID), wird der Fehlerzustand zurückgesetzt. */
  resetKey?: string
}

export class ErrorBoundary extends Component<Props, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App-Fehler:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error">
          <h2>Diese App ist abgestürzt</h2>
          <pre>{this.state.error.message}</pre>
          <button onClick={() => this.setState({ error: null })}>Erneut versuchen</button>
        </div>
      )
    }
    return this.props.children
  }
}
