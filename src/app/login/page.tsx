'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Space_Grotesk, Inter } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

const fields = [
  { name: 'email', placeholder: 'Federal Email (.gov or .mil)', type: 'email', label: 'Email' },
  { name: 'password', placeholder: 'Secure Passphrase', type: 'password', label: 'Password' },
]

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0
  })
}

const validateField = (field, value) => {
  switch (field) {
    case 'email':
      return /^[^\s@]+@(?:[^\s@]+\.)?(?:gov|mil|mail\.mil)$/.test(value);
    case 'password':
      return value.length >= 12;
    default:
      return true;
  }
}

const P3NT4Logo = () => (
  <svg className="w-12 h-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 40 60 40 100C40 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M100 4C100 4 160 60 160 100C160 140 100 198 100 198" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 100H196" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [currentField, setCurrentField] = useState(0)
  const [direction, setDirection] = useState(0)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldValidity, setFieldValidity] = useState(
    Object.fromEntries(fields.map(field => [field.name, false]))
  )

  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldValidity(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const nextField = () => {
    if (fieldValidity[fields[currentField].name]) {
      if (currentField < fields.length - 1) {
        setCurrentField(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/login', formData)
      if (response.status === 200) {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('Access denied. Verify credentials and try again.')
    }
  }

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-[#e0e0e0] ${inter.className}`}>
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <Link href="/">
          <motion.div
            className="flex items-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <P3NT4Logo />
            <span className={`text-4xl font-light ml-4 tracking-wider ${spaceGrotesk.className}`}>P3NT4</span>
          </motion.div>
        </Link>
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className={`text-2xl font-light mb-8 text-center ${spaceGrotesk.className}`}>Secure Access Terminal</h2>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentField}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <label className="block text-sm font-light mb-2">{fields[currentField].label}</label>
                <div className="relative">
                  <input
                    type={fields[currentField].type === 'password' && showPassword ? 'text' : fields[currentField].type}
                    name={fields[currentField].name}
                    placeholder={fields[currentField].placeholder}
                    value={formData[fields[currentField].name]}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#1a1a1a] text-white border-b border-[#3a3a3a] focus:outline-none focus:border-[#e0e0e0] transition-colors duration-300"
                  />
                  {fields[currentField].type === 'password' && (
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-between items-center">
                {currentField > 0 && (
                  <button
                    onClick={() => setCurrentField(prev => prev - 1)}
                    className="text-sm text-[#a0a0a0] hover:text-white transition-colors duration-300"
                  >
                    Previous
                  </button>
                )}
                <motion.button
                  onClick={nextField}
                  disabled={!fieldValidity[fields[currentField].name]}
                  className="ml-auto px-6 py-2 border border-[#e0e0e0] text-[#e0e0e0] hover:bg-[#e0e0e0] hover:text-[#0a0a0a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentField === fields.length - 1 ? 'Authenticate' : 'Next'}
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.p
          className="mt-8 text-[#a0a0a0] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Need clearance? <Link href="/signup" className="text-[#e0e0e0] hover:underline">Initiate request</Link>
        </motion.p>
      </main>
      <footer className="absolute bottom-0 w-full text-center p-4 text-[#606060] text-xs">
        <p>P3NT4 &copy; 2024 | Authorized Federal Use Only | FOUO</p>
      </footer>
    </div>
  )
}