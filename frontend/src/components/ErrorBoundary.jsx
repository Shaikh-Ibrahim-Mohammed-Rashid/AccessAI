import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected UI issue" };
  }

  componentDidCatch(error, info) {
    console.error("AccessAI UI Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-2xl rounded-2xl border border-red-400/40 bg-slate-900 p-6 text-slate-100">
          <h2 className="font-display text-2xl text-red-300">Interface Recovered</h2>
          <p className="mt-2 text-sm text-slate-300">
            AccessAI caught a rendering error and prevented a blank screen.
          </p>
          <p className="mt-2 rounded-lg bg-red-400/10 p-2 text-xs text-red-200">{this.state.message}</p>
          <button
            className="mt-4 rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-900"
            onClick={() => window.location.reload()}
          >
            Reload Safely
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
