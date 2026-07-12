import { Component, ErrorInfo, ReactNode } from "react";

type RenderBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type RenderBoundaryState = { failed: boolean };

class RenderBoundary extends Component<RenderBoundaryProps, RenderBoundaryState> {
  state: RenderBoundaryState = { failed: false };

  static getDerivedStateFromError(): RenderBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep diagnostics available in DevTools while preserving a useful page.
    console.error("WebGL enhancement failed; rendering the static fallback.", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default RenderBoundary;
