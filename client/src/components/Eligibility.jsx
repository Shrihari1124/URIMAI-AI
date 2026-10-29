
import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import './Eligibility.css'

export default function Eligibility({
  project,
  onBack,
  onEligible,
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({
    age: '',
    residence: '',
    income: '',
  })

  
const questionSets = {
  'Kalaignar Magalir Urimai Thogai': [
    {
      key: 'age',
      title: 'Are you 21 years of age or older?',
      options: ['Yes', 'No', 'Not sure'],
    },
    {
      key: 'familyHead',
      title: 'Are you the woman head of your family?',
      options: ['Yes', 'No', 'Not sure'],
    },
    {
      key: 'incomeRules',
      title: 'Do you meet the scheme’s household income and other conditions?',
      options: ['Yes', 'No', 'Not sure'],
    },
  ],
  'Pudhumai Penn': [
    {
      key: 'education',
      title: 'Are you pursuing higher education?',
      options: ['Yes', 'No', 'Not sure'],
    },
    {
      key: 'schoolBackground',
      title: 'Did you study in a qualifying government school?',
      options: ['Yes', 'No', 'Not sure'],
    },
    {
      key: 'schemeRules',
      title: 'Do you meet the scheme’s other official conditions?',
      options: ['Yes', 'No', 'Not sure'],
    },
  ],
  default: [
    {
      key: 'age',
      title: 'What is your age group?',
      options: ['Under 18', '18–25', '26–40', '41–59', '60 or above'],
    },
    {
      key: 'residence',
      title: 'Are you a resident of Tamil Nadu?',
      options: ['Yes', 'No', 'Not sure'],
    },
    {
      key: 'rules',
      title: 'Do you meet the official conditions for this project?',
      options: ['Yes', 'No', 'Not sure'],
    },
  ],
}

const questions =
  questionSets[project?.title] || questionSets.default


  const currentQuestion = questions[step]
  const selectedAnswer = answers[currentQuestion.key]

  const chooseAnswer = (value) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.key]: value,
    }))
  }

  const finish = () => {
    onEligible({
      answers,
      result: 'Needs verification',
    })
  }

  return (
    <main className="eligibility-page">
      <button className="eligibility-back" onClick={onBack}>
        <ArrowLeft size={18} /> Back
      </button>

      <p className="eligibility-eyebrow">
  URIMAI AI · {project?.government || 'PROJECT'} ELIGIBILITY
</p>

      <h1>
  Check your <span>eligibility.</span>
</h1>

{project && (
  <p className="eligibility-description">
    Project: <strong>{project.title}</strong>
  </p>
)}

      <p className="eligibility-description">
        Answer a few questions to help us assess your potential eligibility.
      </p>

      <div className="eligibility-progress">
        <div style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <p className="eligibility-step">
        Question {step + 1} of {questions.length}
      </p>

      <section className="eligibility-card">
        <h2>{currentQuestion.title}</h2>

        <div className="eligibility-options">
          {currentQuestion.options.map((option) => (
            <button
              type="button"
              key={option}
              className={`eligibility-option ${
                selectedAnswer === option ? 'selected' : ''
              }`}
              onClick={() => chooseAnswer(option)}
            >
              {option}
              {selectedAnswer === option && <CheckCircle2 size={18} />}
            </button>
          ))}
        </div>

        <div className="eligibility-actions">
          <button
            type="button"
            className="eligibility-secondary"
            disabled={step === 0}
            onClick={() => setStep((previous) => previous - 1)}
          >
            Previous
          </button>

          {step < questions.length - 1 ? (
            <button
              type="button"
              className="eligibility-primary"
              disabled={!selectedAnswer}
              onClick={() => setStep((previous) => previous + 1)}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              className="eligibility-primary"
              disabled={!selectedAnswer}
              onClick={finish}
            >
              Check result <ArrowRight size={18} />
            </button>
          )}
        </div>
      </section>

      <p className="eligibility-disclaimer">
        This preliminary questionnaire does not confirm eligibility.
        Final eligibility depends on the project's verified official rules.
      </p>
    </main>
  )
}
