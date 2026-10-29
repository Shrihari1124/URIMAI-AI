
import { useState } from 'react'
import {
  Search,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ListChecks,
  MessageSquare,
} from 'lucide-react'
import './NeedMatcher.css'

const schemes = [
  {
    id: 1,
    name: '200 Units of Free Electricity',
    government: 'TVK',
    verified: false,
    keywords: ['electricity', 'electric bill', 'power bill', 'free electricity', 'current bill'],
    questions: [
      { key: 'connection', text: 'Is this a domestic electricity connection?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'state', text: 'Is the connection located in Tamil Nadu?', options: ['Yes', 'No'] },
      { key: 'units', text: 'What electricity consumption is shown on your latest bill?', type: 'text', placeholder: 'Enter units shown on your bill' },
      { key: 'account', text: 'Is the connection in your name or your household’s name?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 2,
    name: 'Thaaimaaman Thanga Mothira Thittam',
    government: 'TVK',
    verified: false,
    keywords: ['newborn', 'baby', 'birth', 'gold ring', 'new baby'],
    questions: [
      { key: 'born', text: 'Has the baby been born?', options: ['Yes', 'No'] },
      { key: 'dob', text: 'What is the baby’s date of birth?', type: 'text', placeholder: 'Enter date of birth or Not applicable' },
      { key: 'registered', text: 'Is the birth registered in Tamil Nadu?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'documents', text: 'Do you have the required birth and family documents?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 3,
    name: 'Vetri Laptop Scheme',
    government: 'TVK',
    verified: false,
    keywords: ['laptop', 'college', 'student', 'computer', 'education', 'study'],
    questions: [
      { key: 'student', text: 'Are you currently studying in college?', options: ['Yes', 'No'] },
      { key: 'course', text: 'Which course and year are you studying?', type: 'text', placeholder: 'Example: B.Tech CSE, 2nd year' },
      { key: 'institution', text: 'Does your institution qualify under the scheme?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'received', text: 'Have you already received a laptop under this scheme?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 4,
    name: 'Super Clean, Super Campus',
    government: 'TVK',
    verified: false,
    keywords: ['clean school', 'campus', 'school cleanliness', 'waste at school'],
    questions: [
      { key: 'role', text: 'What is your connection to the school?', options: ['Student', 'Parent', 'Teacher', 'School staff', 'Other'] },
      { key: 'school', text: 'Which school is involved?', type: 'text', placeholder: 'Enter school name' },
      { key: 'state', text: 'Is the school in Tamil Nadu?', options: ['Yes', 'No'] },
      { key: 'issue', text: 'What cleanliness or campus improvement issue needs attention?', type: 'text', placeholder: 'Describe the issue' },
    ],
  },
  {
    id: 5,
    name: 'NalamAI Outpatient Booking Chatbot',
    government: 'TVK',
    verified: false,
    keywords: ['hospital', 'doctor', 'outpatient', 'appointment', 'medical booking'],
    questions: [
      { key: 'appointment', text: 'Do you need an outpatient appointment?', options: ['Yes', 'No'] },
      { key: 'hospital', text: 'Which government hospital would you like to visit?', type: 'text', placeholder: 'Enter hospital name or locality' },
      { key: 'department', text: 'Which department do you need?', type: 'text', placeholder: 'Example: General medicine' },
      { key: 'existing', text: 'Do you already have a referral or appointment?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 6,
    name: 'Kalaignar Magalir Urimai Thogai',
    government: 'DMK',
    verified: false,
    keywords: ['money', 'financial', 'income', 'family', 'woman', 'women', 'monthly assistance', 'financial help'],
    questions: [
      { key: 'womanHead', text: 'Are you applying as a woman head of household?', options: ['Yes', 'No'] },
      { key: 'age', text: 'Do you meet the scheme’s applicable age requirement?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'household', text: 'Does your household satisfy the applicable income, asset and exclusion conditions?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'existing', text: 'What is your current application status?', options: ['Not applied', 'Already applied', 'Receiving assistance', 'Not sure'] },
    ],
  },
  {
    id: 7,
    name: 'Vidiyal Payana Thittam',
    government: 'DMK',
    verified: false,
    keywords: ['bus', 'travel', 'transport', 'free travel', 'journey'],
    questions: [
      { key: 'traveller', text: 'Are you travelling on a covered bus service?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'service', text: 'Is the bus an eligible ordinary-fare service?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'route', text: 'Which route are you using?', type: 'text', placeholder: 'Enter your route or bus number' },
      { key: 'conditions', text: 'Does your journey meet the applicable travel conditions?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 8,
    name: 'Chief Minister’s Breakfast Scheme',
    government: 'DMK',
    verified: false,
    keywords: ['breakfast', 'school food', 'school meal', 'child', 'primary school'],
    questions: [
      { key: 'school', text: 'Is the child enrolled in a government primary school?', options: ['Yes', 'No'] },
      { key: 'class', text: 'Which class does the child attend?', type: 'text', placeholder: 'Enter class or standard' },
      { key: 'participating', text: 'Does the school participate in the scheme?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'provided', text: 'Is breakfast being provided at that school?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 9,
    name: 'Pudhumai Penn',
    government: 'DMK',
    verified: false,
    keywords: ['pudhumai penn', 'girl student', 'higher education', 'college assistance', 'scholarship', 'education assistance'],
    questions: [
      { key: 'enrolled', text: 'Are you currently enrolled in higher education?', options: ['Yes', 'No'] },
      { key: 'course', text: 'Which course and year are you studying?', type: 'text', placeholder: 'Enter course and year' },
      { key: 'schooling', text: 'Does your previous schooling meet the scheme’s qualifying conditions?', options: ['Yes', 'No', 'Not sure'] },
      { key: 'programme', text: 'Is your course a qualifying higher-education programme?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  {
    id: 10,
    name: 'Makkalai Thedi Maruthuvam',
    government: 'DMK',
    verified: false,
    keywords: ['healthcare near me', 'home healthcare', 'medical screening', 'chronic condition', 'health follow up', 'healthcare at home'],
    questions: [
      { key: 'need', text: 'Do you need healthcare services close to home?', options: ['Yes', 'No'] },
      { key: 'service', text: 'What kind of service do you need?', options: ['Screening', 'Follow-up', 'Treatment support', 'Other'] },
      { key: 'locality', text: 'Which locality do you live in?', type: 'text', placeholder: 'Enter locality, not your full address' },
      { key: 'available', text: 'Have you been informed that the relevant service is available in your area?', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
]

export default function NeedMatcher({ onBack, onAssessmentSaved }) {
  const [mode, setMode] = useState('describe')
  const [need, setNeed] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [matches, setMatches] = useState([])
  const [answers, setAnswers] = useState({})
  const [step, setStep] = useState(0)
  const [stage, setStage] = useState('need')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  const startQuestions = (found) => {
    if (!found.length) {
      setMessage('No confident match was found. Try different words or select a scheme directly.')
      return
    }

    setMatches(found)
    setSelectedId(String(found[0].id))
    setAnswers({})
    setStep(0)
    setMessage('')
    setStage('questions')
  }

  const findMatches = () => {
    const normalizedNeed = need.trim().toLowerCase()

    if (!normalizedNeed) {
      setMessage('Please describe your need first.')
      return
    }

    const found = schemes
      .map((scheme) => {
        const score = scheme.keywords.reduce((total, keyword) => {
          return total + (normalizedNeed.includes(keyword.toLowerCase()) ? 1 : 0)
        }, 0)

        return { ...scheme, score }
      })
      .filter((scheme) => scheme.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    startQuestions(found)
  }

  const selectScheme = () => {
    const scheme = schemes.find((item) => String(item.id) === selectedId)

    if (!scheme) {
      setMessage('Please select a scheme.')
      return
    }

    if (!need.trim()) {
      setNeed(`I want to check my eligibility for ${scheme.name}.`)
    }

    startQuestions([scheme])
  }

  const allQuestions = matches.flatMap((scheme) =>
    scheme.questions.map((question) => ({
      ...question,
      schemeId: scheme.id,
      schemeName: scheme.name,
    }))
  )

  const currentQuestion = allQuestions[step]
  const answerKey = currentQuestion
    ? `${currentQuestion.schemeId}-${currentQuestion.key}`
    : ''

  const currentAnswer = answers[answerKey] || ''

  const saveAssessment = async () => {
    if (allQuestions.some((question) => {
      const value = answers[`${question.schemeId}-${question.key}`]
      return value === undefined || String(value).trim() === ''
    })) {
      setMessage('Please answer every question before submitting.')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const token = localStorage.getItem('token')
      const userNeed = need.trim() || `Eligibility check for ${matches.map((item) => item.name).join(', ')}`

      const response = await fetch('http://localhost:5000/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userNeed,
          matchedProjects: matches.map(({ id, name, government, verified }) => ({
            id,
            name,
            government,
            criteriaVerified: verified,
          })),
          answers,
          result: 'Needs official verification',
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          data.message || `Assessment save failed (HTTP ${response.status}). The backend route may not be configured.`
        )
      }

      setStage('result')
      setMessage('Your assessment was saved successfully.')
      onAssessmentSaved?.(data)
    } catch (error) {
      setMessage(`${error.message} Your answers are still on this page; please try again later.`)
    } finally {
      setSaving(false)
    }
  }

  const resetAssessment = () => {
    setNeed('')
    setSelectedId('')
    setMatches([])
    setAnswers({})
    setStep(0)
    setStage('need')
    setMessage('')
  }

  return (
    <main className="need-matcher">
      <button
        className="need-back"
        type="button"
        onClick={() => {
          if (stage === 'questions' || stage === 'result') {
            setStage('need')
            setMessage('')
          } else {
            onBack?.()
          }
        }}
      >
        <ArrowLeft size={17} /> Back
      </button>

      <p className="need-eyebrow">URIMAI AI · PERSONALIZED ASSISTANCE</p>
      <h1>How can we help you?</h1>
      <p className="need-intro">
        Describe your need or select a scheme. We’ll ask relevant questions
        to help you review a possible match.
      </p>

      {stage === 'need' && (
        <section className="need-panel">
          <div className="need-mode-switch">
            <button
              type="button"
              className={`need-option ${mode === 'describe' ? 'selected' : ''}`}
              onClick={() => {
                setMode('describe')
                setMessage('')
              }}
            >
              <MessageSquare size={17} /> Describe your need
            </button>
            <button
              type="button"
              className={`need-option ${mode === 'select' ? 'selected' : ''}`}
              onClick={() => {
                setMode('select')
                setMessage('')
              }}
            >
              <ListChecks size={17} /> Select a scheme
            </button>
          </div>

          {mode === 'describe' ? (
            <>
              <label htmlFor="user-need">What do you need help with?</label>
              <textarea
                id="user-need"
                value={need}
                onChange={(event) => setNeed(event.target.value)}
                placeholder="Example: I am a college student and need a laptop for my studies..."
                rows={5}
              />
              <button className="need-primary" type="button" onClick={findMatches}>
                Find relevant schemes <Search size={17} />
              </button>
            </>
          ) : (
            <>
              <label htmlFor="scheme-select">Choose a scheme</label>
              <select
                id="scheme-select"
                className="need-select"
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                <option value="">Select a scheme...</option>
                {schemes.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </option>
                ))}
              </select>

              <label htmlFor="scheme-need">Describe your situation (optional)</label>
              <textarea
                id="scheme-need"
                value={need}
                onChange={(event) => setNeed(event.target.value)}
                placeholder="Add any details relevant to your application..."
                rows={3}
              />

              <button className="need-primary" type="button" onClick={selectScheme}>
                Check this scheme <ArrowRight size={17} />
              </button>
            </>
          )}
        </section>
      )}

      {stage === 'questions' && currentQuestion && (
        <section className="need-panel">
          <p className="need-progress">
            Question {step + 1} of {allQuestions.length}
          </p>
          <h2>{currentQuestion.text}</h2>
          <p className="need-scheme">Related scheme: {currentQuestion.schemeName}</p>

          {currentQuestion.options ? (
            <div className="need-options">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`need-option ${currentAnswer === option ? 'selected' : ''}`}
                  onClick={() => setAnswers((previous) => ({
                    ...previous,
                    [answerKey]: option,
                  }))}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <>
              <label htmlFor="question-answer">Your answer</label>
              <input
                id="question-answer"
                className="need-text-answer"
                type="text"
                value={currentAnswer}
                onChange={(event) => setAnswers((previous) => ({
                  ...previous,
                  [answerKey]: event.target.value,
                }))}
                placeholder={currentQuestion.placeholder || 'Type your answer'}
              />
            </>
          )}

          {!matches.every((scheme) => scheme.verified) && (
            <p className="need-message">
              Official criteria for one or more selected schemes have not yet been verified.
              Your answers will not be treated as an official eligibility decision.
            </p>
          )}

          <div className="need-navigation">
            <button
              className="need-secondary"
              type="button"
              disabled={step === 0}
              onClick={() => setStep((value) => value - 1)}
            >
              Previous
            </button>

            {step < allQuestions.length - 1 ? (
              <button
                className="need-primary"
                type="button"
                disabled={!String(currentAnswer).trim()}
                onClick={() => setStep((value) => value + 1)}
              >
                Next <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="need-primary"
                type="button"
                disabled={!String(currentAnswer).trim() || saving}
                onClick={saveAssessment}
              >
                {saving ? 'Saving...' : 'Submit assessment'} <CheckCircle2 size={17} />
              </button>
            )}
          </div>
        </section>
      )}

      {stage === 'result' && (
        <section className="need-panel">
          <CheckCircle2 size={35} />
          <h2>Assessment recorded</h2>
          <p>
            Your answers have been saved for preliminary review. This is not an
            official approval or guarantee of benefits.
          </p>
          <h3>Potential matches</h3>
          {matches.map((scheme) => (
            <div key={scheme.id}>
              <p>{scheme.name}</p>
              <p className="need-message">
                {scheme.verified
                  ? 'Criteria verified'
                  : 'Official criteria need verification'}
              </p>
            </div>
          ))}
          <button className="need-primary" type="button" onClick={resetAssessment}>
            Check another need
          </button>
        </section>
      )}

      {message && <p className="need-message" role="status">{message}</p>}
    </main>
  )
}
