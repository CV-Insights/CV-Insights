import React, { useState } from 'react';

const STARTER_ORIGINAL =
  'Worked on the company website and helped make it faster.';
const STARTER_REWRITE =
  'Improved website performance by 35%, reducing page load times and supporting a smoother customer experience.';

const WRITING_STEPS = [
  ['01', 'Start with an action', 'Name what you did.'],
  ['02', 'Add useful context', 'Explain the project or problem.'],
  ['03', 'Show the result', 'Use a real number when you have one.'],
];

function PageHeading() {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">CAREER COACH</div>
        <h1>Improve a resume bullet</h1>
        <p>Make your contribution clear, specific, and easy to scan.</p>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`button ${variant}`} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function ResumeImprovementPage({ notify, navigate }) {
  const [original, setOriginal] = useState(STARTER_ORIGINAL);
  const [rewrite, setRewrite] = useState(STARTER_REWRITE);

  async function copyRewrite() {
    if (!navigator.clipboard?.writeText) {
      notify('Clipboard access is unavailable. Select and copy the rewrite manually.');
      return;
    }

    try {
      await navigator.clipboard.writeText(rewrite);
      notify('Example rewrite copied.');
    } catch (error) {
      notify('Could not copy the rewrite. Please select and copy it manually.');
    }
  }

  function resetExample() {
    setOriginal(STARTER_ORIGINAL);
    setRewrite(STARTER_REWRITE);
    notify('Example restored.');
  }

  return (
    <>
      <PageHeading />

      <section className="improvement-guide" aria-label="Writing steps">
        {WRITING_STEPS.map(([number, title, description]) => (
          <div className="improvement-guide-step" key={number}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <small>{description}</small>
            </div>
          </div>
        ))}
      </section>

      <div className="improvement-workspace">
        <section className="card improvement-panel original-panel">
          <div className="improvement-panel-heading">
            <div>
              <span className="improvement-step-label">YOUR STARTING POINT</span>
              <h2>Original bullet</h2>
            </div>
            <span className="improvement-status original-status">Before</span>
          </div>
          <label className="field-label">
            Edit the example sentence
            <textarea
              rows="7"
              value={original}
              onChange={(event) => setOriginal(event.target.value)}
            />
          </label>
          <p className="improvement-panel-hint">
            Keep the underlying work accurate. The rewrite should describe what you
            actually contributed.
          </p>
        </section>

        <section className="card improvement-panel rewrite-panel">
          <div className="improvement-panel-heading">
            <div>
              <span className="improvement-step-label">EXAMPLE REWRITE</span>
              <h2>Clearer, stronger wording</h2>
            </div>
            <span className="improvement-status rewrite-status">After</span>
          </div>
          <label className="field-label">
            Edit the rewrite before you use it
            <textarea
              rows="7"
              value={rewrite}
              onChange={(event) => setRewrite(event.target.value)}
            />
          </label>
          <p className="improvement-panel-hint">
            The 35% figure is an example. Keep it only if you can support it with your
            real results.
          </p>
        </section>
      </div>

      <section className="card improvement-explanation">
        <div>
          <span className="improvement-step-label">WHY THE REWRITE WORKS</span>
          <h2>It makes the impact easier to understand</h2>
        </div>
        <ul>
          <li><strong>Action:</strong> “Improved” states the contribution up front.</li>
          <li><strong>Context:</strong> Website performance and load time explain the work.</li>
          <li><strong>Evidence:</strong> A verified measure helps show the result.</li>
        </ul>
      </section>

      <div className="improvement-page-actions">
        <ActionButton variant="secondary" onClick={resetExample}>
          Reset example
        </ActionButton>
        <ActionButton variant="secondary" onClick={copyRewrite}>
          Copy rewrite
        </ActionButton>
        <ActionButton onClick={() => navigate('/builder')}>
          Open resume builder
        </ActionButton>
      </div>
    </>
  );
}
