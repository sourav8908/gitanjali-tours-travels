import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { hasDemoEdits, resetAllDemoEdits } from './content/store'

/** If demo edits from the admin ever break the page, offer to reset them instead of showing a blank screen. */
class DemoSafetyNet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Page failed to render', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div style={{ padding: 32, fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1>Something went wrong showing this page.</h1>
        {hasDemoEdits && (
          <>
            <p>It may be caused by demo edits saved in this browser.</p>
            <button
              onClick={() => { resetAllDemoEdits(); window.location.reload() }}
              style={{ padding: '10px 16px', marginTop: 12, cursor: 'pointer' }}
            >
              Reset demo edits and reload
            </button>
          </>
        )}
      </div>
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoSafetyNet>
      <App />
    </DemoSafetyNet>
  </StrictMode>,
)
