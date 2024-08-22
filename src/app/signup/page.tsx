'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import { Space_Grotesk, Inter } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })
const inter = Inter({ subsets: ['latin'] })

interface Agency {
  id: number
  name: string
  acronym: string | null
}

const fields = [
  { name: 'email', placeholder: 'Federal Email (.gov or .mil)', type: 'email', label: 'Email' },
  { name: 'password', placeholder: 'Secure Passphrase', type: 'password', label: 'Password' },
  { name: 'firstName', placeholder: 'First Name', type: 'text', label: 'First Name' },
  { name: 'lastName', placeholder: 'Last Name', type: 'text', label: 'Last Name' },
  { name: 'position', placeholder: 'Position', type: 'text', label: 'Position' },
  { name: 'agency', placeholder: 'Search for your agency', type: 'agency', label: 'Agency' },
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
    case 'firstName':
    case 'lastName':
    case 'position':
      return value.trim().length > 0;
    case 'agency':
      return value.trim().length > 0;
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

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    position: '',
    agencyId: '',
  })
  const [currentField, setCurrentField] = useState(0)
  const [direction, setDirection] = useState(0)
  const [agencies, setAgencies] = useState([])
  const [filteredAgencies, setFilteredAgencies] = useState([])
  const [agencySearch, setAgencySearch] = useState('')
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldValidity, setFieldValidity] = useState(
    Object.fromEntries(fields.map(field => [field.name, false]))
  )

  const router = useRouter()

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/agencies')
        setAgencies(response.data)
      } catch (error) {
        console.error('Error fetching agencies:', error)
        setError('Failed to load agencies. Please try again later.')
      }
    }
    fetchAgencies()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldValidity(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }))
  }

  const handleAgencySearch = (value) => {
    setAgencySearch(value)
    if (value.trim() === '') {
      setFilteredAgencies([])
      setShowAgencyDropdown(false)
    } else {
      const filtered = agencies.filter(agency =>
        agency.name.toLowerCase().includes(value.toLowerCase()) ||
        (agency.acronym && agency.acronym.toLowerCase().includes(value.toLowerCase()))
      )
      setFilteredAgencies(filtered)
      setShowAgencyDropdown(filtered.length > 0)
    }
    setFieldValidity(prev => ({ ...prev, agency: false }))
  }

  const handleAgencySelect = (agency) => {
    setFormData(prev => ({ ...prev, agencyId: agency.id.toString() }))
    setAgencySearch(agency.name)
    setShowAgencyDropdown(false)
    setFieldValidity(prev => ({ ...prev, agency: true }))
  }

  const nextField = () => {
    if (fieldValidity[fields[currentField].name]) {
      if (currentField < fields.length - 1) {
        setDirection(1)
        setCurrentField(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const prevField = () => {
    if (currentField > 0) {
      setDirection(-1)
      setCurrentField(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/signup', formData)
      if (response.status === 201) {
        router.push('/login')
      }
    } catch (error) {
      setError('Failed to create account. Please try again.')
    }
  }

  const renderField = () => {
    const field = fields[currentField]
    if (field.type === 'agency') {
      return (
        <div className="relative">
          <input
            type="text"
            placeholder={field.placeholder}
            value={agencySearch}
            onChange={(e) => handleAgencySearch(e.target.value)}
            className={`w-full p-3 bg-[#1A1A1A] text-white border-b ${
              fieldValidity [field.name] ? 'border-green-500' : 'border-[#3A3A3A]'
            } focus:outline-none focus:border-[#e0e0e0] transition-colors duration-300`}
          />
          {showAgencyDropdown && filteredAgencies.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-[#1A1A1A] border border-[#3A3A3A] shadow-lg">
              {filteredAgencies.map(agency => (
                <li
                  key={agency.id}
                  onClick={() => handleAgencySelect(agency)}
                  className="p-2 hover:bg-[#3A3A3A] cursor-pointer text-white"
                >
                  {agency.name} {agency.acronym && `(${agency.acronym})`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }
    return (
      <div className="relative">
        <input
          type={field.type === 'password' && showPassword ? 'text' : field.type}
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          className={`w-full p-3 bg-[#1A1A1A] text-white border-b ${
            fieldValidity[field.name] ? 'border-green-500' : 'border-[#3A3A3A]'
          } focus:outline-none focus:border-[#e0e0e0] transition-colors duration-300`}
        />
        {field.type === 'password' && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white flex flex-col ${inter.className}`}>
      <main className="flex-grow flex items-center justify-center p-8">
  <div className="w-full max-w-md">
    <Link href="/">
      <motion.div
        className="flex items-center justify-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <P3NT4Logo />
        <span className={`text-4xl font-light ml-4 tracking-wider ${spaceGrotesk.className}`}>P3NT4</span>
      </motion.div>
    </Link>
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className={`text-2xl font-light mb-8 text-center ${spaceGrotesk.className}`}>
        Initiate Clearance
      </h2>
      <div className="space-y-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentField}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-light mb-2">{fields[currentField].label}</label>
            {renderField()}
          </motion.div>
        </AnimatePresence>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between mt-8">
  <motion.button
    onClick={prevField}
    disabled={currentField === 0}
    className="text-sm text-[#A0A0A0] hover:text-white transition-colors duration-300"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Previous
  </motion.button>
  <motion.button
    onClick={nextField}
    disabled={!fieldValidity[fields[currentField].name]}
    className="px-6 py-2 border border-[#e0e0e0] text-[#e0e0e0] hover:bg-[#e0e0e0] hover:text-[#0a0a0a] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {currentField === fields.length - 1 ? 'Submit' : 'Next'}
  </motion.button>
</div>
      </div>
    </motion.div>
    <motion.p
      className="mt-6 text-[#E0E0E0] text-center text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      Already cleared? <Link href="/login" className="text-[#A0A0A0] hover:text-white transition-colors">Access Terminal</Link>
    </motion.p>
  </div>
</main>
      <footer className="text-center p-4 text-[#606060] text-xs">
        <p>P3NT4 &copy; 2024 | Authorized Federal Use Only | FOUO</p>
      </footer>
    </div>
  )
}