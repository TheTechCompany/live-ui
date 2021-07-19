import { Box } from "grommet";
import { isEqual } from "lodash";
import { Component } from "react";

export interface LiveComponentErrorBoundaryProps {
    fallback?: any;
    onError?: any;
    children?: (eror: boolean) => any;
}

export class LiveComponentErrorBoundary extends Component<LiveComponentErrorBoundaryProps, any> {
    state = { error: false, errorMessage: '' };
  
    static getDerivedStateFromError(error: any) {
      // Update state to render the fallback UI
      return { error: true, errorMessage: error.toString() };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // Log error to an error reporting service like Sentry
      console.log("=> Live Component error", { error, errorInfo });
    }

    componentDidUpdate(newProps: any, newState: any){
        if(!isEqual(newProps.children, this.props.children)){
            this.setState({error: false})
        }

        if(this.state.error != newState.error){
            this.props.onError(this.state.error)
        }
    }
  
    render() {
      const { error, errorMessage } = this.state;
      const { children } = this.props;
      const Component = this.props.fallback || <div>No renderable component</div>;
  
      return children ? children?.(error)  : <div>No component</div>
      return error ? <Component /> : children;
    }
  }