'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  /** Optional custom fallback. Defaults to a generic retry card. */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

/**
 * React class-based error boundary.
 * Catches render errors in children and shows a friendly fallback.
 * Must be a class component — hooks cannot catch render errors.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { hasError: true, message }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // Log to console in development; wire to Sentry/similar in production
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-center space-y-3">
          <p className="text-2xl">⚠️</p>
          <p className="text-white font-semibold text-sm">Something went wrong</p>
          <p className="text-zinc-500 text-xs leading-relaxed">{this.state.message}</p>
          <button
            onClick={this.handleRetry}
            className="mt-1 text-purple-400 text-sm underline underline-offset-2 hover:text-purple-300"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
