import { Route, Routes } from 'react-router-dom';
import Singin from './Page/Singin';
import SignUp from './Page/Singout';
import ForgotPassword from './Page/ForgotPassword';
import Dashboard from './Page/Dashboard';

function App() {
  return (
 <Routes>
      <Route path="/" element={<Singin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/reset-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
  </Routes>

  )
}

export default App
