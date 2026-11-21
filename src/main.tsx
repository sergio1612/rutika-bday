import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BirthdayGate } from './components/BirthdayGate.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BirthdayGate />
  </StrictMode>,
)
