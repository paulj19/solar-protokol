import React, {ReactElement, useState} from "react";
import {ERROR_TEXT} from "@/utils/CommonVars";
import ErrorScreen from "./ErrorScreen";

// export default function ErrorBoundary({children}): ReactElement {
//     const [hasError, setHasError] = useState<boolean>(false)

//     function getDerivedStateFromError(error) {
//       // Update state so the next render will show the fallback UI.
//       setHasError(true)
//     }

//     function componentDidCatch(error, errorInfo) {
//     // You can also log the error to an error reporting service
//       console.error("Error screen")
//     }

//     return (
//         hasError ? <div className="flex m-auto text-lg text-gray-300">{ERROR_TEXT}</div> : <>{children}</>
//     )
// }
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ErrorScreen/>;
    }

    return this.props.children; 
  }
}
