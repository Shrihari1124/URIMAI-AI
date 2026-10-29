import Eligibility from './components/Eligibility'
import NeedMatcher from './components/NeedMatcher'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, LogIn, UserPlus } from 'lucide-react'


import './App.css'


const schemeData = [
  {
    id: 1,
    government: 'TVK',
    title: '200 Units of Free Electricity',
    description:
      'Electricity assistance for eligible domestic consumers.',
    category: 'Utilities',
    status: 'Pending verification',
  },
  {
    id: 2,
    government: 'TVK',
    title: 'Thaaimaaman Thanga Mothira Thittam',
    description:
      'Gold ring assistance for eligible newborns.',
    category: 'Family Welfare',
    status: 'Pending verification',
  },
  {
    id: 3,
    government: 'TVK',
    title: 'Vetri Laptop Scheme',
    description:
      'Laptop assistance for eligible college students.',
    category: 'Education',
    status: 'Pending verification',
  },
  {
    id: 4,
    government: 'TVK',
    title: 'Super Clean, Super Campus',
    description:
      'A school cleanliness and campus improvement initiative.',
    category: 'Education',
    status: 'Pending verification',
  },
  {
    id: 5,
    government: 'TVK',
    title: 'NalamAI Outpatient Booking Chatbot',
    description:
      'Digital assistance for booking government hospital outpatient appointments.',
    category: 'Healthcare',
    status: 'Pending verification',
  },
  {
    id: 6,
    government: 'DMK',
    title: 'Kalaignar Magalir Urimai Thogai',
    description:
      'Monthly financial assistance for eligible women heads of families.',
    category: 'Financial Assistance',
    status: 'Implemented',
  },
  {
    id: 7,
    government: 'DMK',
    title: 'Vidiyal Payana Thittam',
    description:
      'Free travel for women on eligible ordinary-fare city buses.',
    category: 'Transport',
    status: 'Implemented',
  },
  {
    id: 8,
    government: 'DMK',
    title: 'Chief Minister’s Breakfast Scheme',
    description:
      'Breakfast provision for eligible government primary-school pupils.',
    category: 'Education',
    status: 'Implemented',
  },
  {
    id: 9,
    government: 'DMK',
    title: 'Pudhumai Penn',
    description:
      'Higher-education financial assistance for eligible girl students.',
    category: 'Education',
    status: 'Implemented',
  },
  {
    id: 10,
    government: 'DMK',
    title: 'Makkalai Thedi Maruthuvam',
    description:
      'Healthcare services delivered closer to people’s homes.',
    category: 'Healthcare',
    status: 'Implemented',
  },
]

export default function App() {
  const videoRef = useRef(null)
  const [screen, setScreen] = useState('intro')
  const [schemeSearch, setSchemeSearch] = useState('')
const [schemeGovernment, setSchemeGovernment] = useState('All')
const [selectedScheme, setSelectedScheme] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const handleEligibilityResult = (result) => {
  setSelectedScheme(result)
  setScreen('eligibility-result')
}
  useEffect(() => {
  const handlePopState = (event) => {
    if (event.state?.screen) {
      setScreen(event.state.screen)
    } else {
      setScreen('explore')
    }

    setFormMessage('')
  }

  window.addEventListener('popstate', handlePopState)

  return () => {
    window.removeEventListener('popstate', handlePopState)
  }
}, [])
useEffect(() => {
  if (!window.history.state?.screen) {
    window.history.replaceState(
      { screen: 'intro' },
      '',
      window.location.pathname
    )
  }
}, [])

  const skipIntro = () => setScreen('welcome')


const goToScreen = (nextScreen) => {
  setFormMessage('')
  window.history.pushState({ screen: nextScreen }, '', window.location.pathname)
  setScreen(nextScreen)
}

 
  const handleLogin = async (event) => {
    event.preventDefault()
    setFormMessage('Signing in...')

    const form = event.currentTarget
    const email = form.elements.email.value.trim()
    const password = form.elements.password.value

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setFormMessage(data.message || 'Login failed. Please try again.')
        return
      }
     setCurrentUser(data.user)
     console.log('Login token received:', !!data.token)
console.log('Logged-in user:', data.user)
localStorage.setItem('token', data.token)
setFormMessage(`Welcome back, ${data.user.name}!`)
      setTimeout(() => {
        setScreen('explore')
      }, 800)
    } catch {
      setFormMessage(
        'Unable to connect to the server. Make sure the backend is running.'
      )
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const name = form.elements.fullName.value.trim()
    const email = form.elements.email.value.trim()
    const password = form.elements.password.value
    const confirmPassword = form.elements.confirmPassword.value

    if (password !== confirmPassword) {
      setFormMessage('Your passwords do not match. Please try again.')
      return
    }

    setFormMessage('Creating your account...')

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setFormMessage(
          data.message || 'Registration failed. Please try again.'
        )
        return
      }

      setFormMessage(
        'Account created successfully! You can now log in.'
      )
    } catch {
      setFormMessage(
        'Unable to connect to the server. Make sure the backend is running.'
      )
    }
  }


  return (
    <main className="urimai-app">
      <AnimatePresence mode="wait">
        {/* INTRO VIDEO */}
        {screen === 'intro' && (
          <motion.section
            key="intro"
            className="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <video
              ref={videoRef}
              className="intro-video"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setScreen('welcome')}
              onError={() => setScreen('welcome')}
            >
              <source
                src="/videos/urimai-hero.mp4"
                type="video/mp4"
              />
              Your browser does not support video playback.
            </video>

            <button
              className="skip-intro"
              onClick={skipIntro}
              type="button"
            >
              Skip intro <ArrowRight size={16} />
            </button>
          </motion.section>
        )}

        {/* WELCOME SCREEN */}
        {screen === 'welcome' && (
          <motion.section
            key="welcome"
            className="welcome-screen"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="welcome-content">
              <span className="welcome-brand">
                URIMAI <span>AI</span>
              </span>

              <p className="welcome-tamil" lang="ta">
                உங்கள் உரிமை, உங்கள் கையில்!
              </p>

              <h1>
                Your rights.
                <br />
                <span>Your opportunities.</span>
              </h1>

              <p className="welcome-description">
                Discover government schemes, understand eligibility,
                and find the official resources you need.
              </p>

              <div className="welcome-actions">
                <button
                  className="welcome-primary"
                  onClick={() => goToScreen('explore')}
                  type="button"
                >
                  Let's get started <ArrowRight size={18} />
                </button>

                <button
                  className="welcome-secondary"
                  onClick={() => goToScreen('auth')}
                  type="button"
                >
                  <LogIn size={18} /> Login / Register
                </button>
              </div>

              <p className="welcome-note">
                An independent citizen-services platform
              </p>
            </div>
          </motion.section>
        )}

        {/* LOGIN SCREEN */}
        {screen === 'auth' && (
          <motion.section
            key="auth"
            className="auth-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <button
              className="auth-back"
              onClick={() => goToScreen('welcome')}
              type="button"
            >
              ← Back to welcome
            </button>

            <div className="auth-layout">
              <div className="auth-brand-panel">
                <span className="welcome-brand">
                  URIMAI <span>AI</span>
                </span>

                <p className="welcome-tamil" lang="ta">
                  உங்கள் உரிமை, உங்கள் கையில்!
                </p>

                <h1>
                  Your rights.
                  <br />
                  Your opportunities.
                </h1>

                <p>
                  Discover support, understand your options,
                  and take your next step with confidence.
                </p>
              </div>

              <div className="auth-card">
                <h2>Welcome back</h2>
                <p className="auth-subtitle">
                  Sign in to continue to URIMAI AI.
                </p>

                <form className="auth-form" onSubmit={handleLogin}>
                  <label htmlFor="login-email">Email address</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    minLength={8}
                    required
                  />

                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide password' : 'Show password'}
                  </button>

                  <button className="auth-submit" type="submit">
                    Login <ArrowRight size={18} />
                  </button>
                </form>

                {formMessage && (
                  <p className="auth-message" role="status">
                    {formMessage}
                  </p>
                )}

                <div className="auth-register-prompt">
                  <span>New to URIMAI AI?</span>
                  <button
                    type="button"
                    onClick={() => goToScreen('register')}
                  >
                    Create an account
                  </button>
                </div>

                <p className="auth-legal">
                  An independent citizen-services platform.
                  Not affiliated with any government body.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* REGISTER SCREEN */}
        {screen === 'register' && (
          <motion.section
            key="register"
            className="auth-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <button
              className="auth-back"
              onClick={() => goToScreen('auth')}
              type="button"
            >
              ← Back to login
            </button>

            <div className="auth-layout">
              <div className="auth-brand-panel">
                <span className="welcome-brand">
                  URIMAI <span>AI</span>
                </span>

                <p className="welcome-tamil" lang="ta">
                  உங்கள் உரிமை, உங்கள் கையில்!
                </p>

                <h1>
                  A better way
                  <br />
                  to find support.
                </h1>

                <p>
                  Create your account to start exploring relevant
                  government schemes and resources.
                </p>
              </div>

              <div className="auth-card">
                <h2>Create account</h2>
                <p className="auth-subtitle">
                  Join URIMAI AI to get started.
                </p>

                <form className="auth-form" onSubmit={handleRegister}>
                  <label htmlFor="register-name">Full name</label>
                  <input
                    id="register-name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                  <label htmlFor="register-email">Email address</label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <label htmlFor="confirm-password">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide password' : 'Show password'}
                  </button>

                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword
                      ? 'Hide confirmation'
                      : 'Show confirmation'}
                  </button>

                  <button className="auth-submit" type="submit">
                    Create account <UserPlus size={18} />
                  </button>
                </form>

                {formMessage && (
                  <p className="auth-message" role="status">
                    {formMessage}
                  </p>
                )}

                <div className="auth-register-prompt">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => goToScreen('auth')}
                  >
                    Login
                  </button>
                </div>

                <p className="auth-legal">
                  An independent citizen-services platform.
                  Not affiliated with any government body.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* EXPLORE SCREEN */}
        {screen === 'explore' && (
          <motion.section
            key="explore"
            className="welcome-screen"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="welcome-content">
              <span className="welcome-brand">
                URIMAI <span>AI</span>
              </span>

              <p className="welcome-tamil" lang="ta">
                உங்கள் உரிமை, உங்கள் கையில்!
              </p>

              <h1>
                Welcome back,
                <br />
                <span>{currentUser?.name || 'there'}!</span>
              </h1>

              <p className="welcome-description">
                Discover government schemes, check your eligibility,
                and find official application resources.
              </p>

              <div className="welcome-actions">
                <button
                  className="welcome-primary"
                  type="button"
                  onClick={() => goToScreen('schemes')}
                >
                  Explore schemes <ArrowRight size={18} />
                </button>

                <button
                  className="welcome-secondary"
                  type="button"
                 onClick={() => goToScreen('need-matcher')}
                >
                  Check eligibility
                </button>
              </div>

              <div className="dashboard-links">
                <button
                  type="button"
                  onClick={() => goToScreen('saved')}
                >
                  Saved schemes
                </button>

                <button
                  type="button"
                  onClick={() => goToScreen('assistant')}
                >
                  Ask URIMAI AI
                </button>
              </div>

              <p className="welcome-note">
                An independent citizen-services platform. Not affiliated
                with any government body.
              </p>
            </div>

          </motion.section>
        )}

        {screen === 'schemes' && (
          <motion.section
            key="schemes"
            className="welcome-screen"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="catalogue-content">
              <span className="welcome-brand">
                URIMAI <span>AI</span>
              </span>

              <p className="welcome-tamil" lang="ta">
                உங்கள் உரிமை, உங்கள் கையில்!
              </p>

              <h1>Project <span>Catalogue</span></h1>

              <p className="welcome-description">
                Explore initiatives from the TVK and DMK administrations.
              </p>

              <input
                className="scheme-search"
                type="search"
                placeholder="Search projects..."
                value={schemeSearch}
                onChange={(event) => setSchemeSearch(event.target.value)}
              />

              <div className="scheme-filters">
                {['All', 'TVK', 'DMK'].map((government) => (
                  <button
                    key={government}
                    type="button"
                    className={
                      schemeGovernment === government ? 'active' : ''
                    }
                    onClick={() => setSchemeGovernment(government)}
                  >
                    {government}
                  </button>
                ))}
              </div>

              <div className="scheme-grid">
                {schemeData
                  .filter((scheme) =>
                    schemeGovernment === 'All' ||
                    scheme.government === schemeGovernment
                  )
                  .filter((scheme) =>
                    `${scheme.title} ${scheme.description} ${scheme.category}`
                      .toLowerCase()
                      .includes(schemeSearch.toLowerCase())
                  )
                  .map((scheme) => (
                    <article className="scheme-card" key={scheme.id}>
                      <div className="scheme-card-top">
                        <span className="scheme-government">
                          {scheme.government}
                        </span>
                        <span className="scheme-category">
                          {scheme.category}
                        </span>
                      </div>

                      <h2>{scheme.title}</h2>
                      <p>{scheme.description}</p>

                      <p className="scheme-status">
                        Status: {scheme.status}
                      </p>

                      <button
                        className="welcome-primary"
                        type="button"
                        onClick={() => {
                          setSelectedScheme(scheme)
                          goToScreen('scheme-details')
                        }}
                      >
                        View details <ArrowRight size={16} />
                      </button>
                      
<button
  className="welcome-secondary"
  type="button"
  onClick={() => {
    setSelectedScheme(scheme)
    setScreen('eligibility')
  }}
>
  Check eligibility
</button>

                    </article>
                  ))}
              </div>

              <button
                className="welcome-secondary catalogue-back"
                type="button"
                onClick={() => goToScreen('explore')}
              >
                Back to dashboard
              </button>

              <p className="welcome-note">
                Independent citizen-services platform. Project status and
                eligibility should be verified against official sources.
              </p>
            </div>
          </motion.section>
        )}
        
        {screen === 'eligibility' && (
          <Eligibility
  project={selectedScheme}
  onBack={() => goToScreen('schemes')}
  onEligible={handleEligibilityResult}
  
/>
        )}
        {screen === 'need-matcher' && (
  <NeedMatcher
    onBack={() => goToScreen('explore')}
    onAssessmentSaved={() => {
      console.log('Assessment saved')
    }}
  />
)}

        {screen === 'eligibility' && (
  <Eligibility
    project={selectedScheme}
    onBack={() => goToScreen('schemes')}
    onEligible={handleEligibilityResult}
  />
)}

{screen === 'need-matcher' && (
  <NeedMatcher
    onBack={() => goToScreen('explore')}
    onAssessmentSaved={() => {
      console.log('Assessment saved')
    }}
  />
)}

        {screen === 'eligibility-result' && (
          <motion.section
            key="eligibility-result"
            className="welcome-screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="welcome-content">
              <span className="welcome-brand">
                URIMAI <span>AI</span>
              </span>

              <h1>Eligibility <span>review</span></h1>

              <p className="welcome-description">
                Your answers have been recorded for a preliminary review.
                Your eligibility still needs to be checked against the
                official rules for the selected project.
              </p>

              <div className="welcome-actions">
                <button
                  className="welcome-primary"
                  type="button"
                  onClick={() => goToScreen('register')}
                >
                  Register your interest <ArrowRight size={18} />
                </button>

                <button
                  className="welcome-secondary"
                  type="button"
                  onClick={() => goToScreen('schemes')}
                >
                  Browse projects
                </button>
              </div>

              <p className="welcome-note">
                Registering your interest on URIMAI AI does not submit
                an official government application.
              </p>
            </div>
          </motion.section>
        )}

      </AnimatePresence>

    </main>
  )
}
