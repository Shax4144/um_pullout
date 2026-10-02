import { lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { SelectedRowProvider } from "./context/SelectedRowProvider"

const Landing = lazy(() => import("./Landing"))

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedRowProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </Router>
      </SelectedRowProvider>
    </QueryClientProvider>
  )
}

export default App
