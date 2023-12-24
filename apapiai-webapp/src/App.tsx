import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Welcome from './pages/Welcome'

export default function App() {
  return (
    <GoogleOAuthProvider clientId="705932432287-6ekvke50s3ifkbhvu5tg7mos1gas393n.apps.googleusercontent.com">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/" element={<Welcome />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
