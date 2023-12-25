import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google"

import Welcome from "./pages/Welcome"

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId="705932432287-6ekvke50s3ifkbhvu5tg7mos1gas393n.apps.googleusercontent.com">
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="*" element={<Welcome />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
