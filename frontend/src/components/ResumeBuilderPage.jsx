import React, { useEffect, useRef, useState } from 'react';

const RESUME_STORAGE_KEY = 'cv-insights-resume-builder';
const TEMPLATE_STORAGE_KEY = 'cv-insights-selected-template';

const BUILDER_TABS = [
  'Personal',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Projects',
];

const TEMPLATE_STYLES = {
  'Modern Minimal': 'modern',
  Professional: 'professional',
  'Creative Edge': 'creative',
  'Executive Classic': 'executive',
  'Student Friendly': 'student',
  'Two Column': 'columns',
};

function createBlankResume(user) {
  return {
    name: user?.name || '',
    title: '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    isExample: false,
  };
}

function createExampleResume(user) {
  return {
    name: user?.name || 'Jordan Lee',
    title: 'Product Designer | UX Researcher',
    email: user?.email || 'jordan.lee@example.com',
    phone: '+1 415 555 0148',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/jordanlee',
    summary:
      'Product designer with 6 years of experience turning user research into clear, accessible digital products. Known for simplifying complex workflows and working closely with product and engineering teams.',
    experience: [
      'Senior Product Designer | Northstar Labs | 2022–Present',
      '- Led a redesign of the onboarding journey used by 45,000 customers.',
      '- Improved first-week activation by 28% through usability testing and iterative prototyping.',
      '- Built a shared component library with engineering, reducing design handoff time by 30%.',
      '',
      'Product Designer | Brightside Digital | 2019–2022',
      '- Designed responsive web experiences for four early-stage product teams.',
      '- Ran 25 customer interviews and translated findings into a prioritized product roadmap.',
    ].join('\n'),
    education:
      'BFA, Interaction Design | California College of the Arts | 2019',
    skills:
      'Product strategy | Figma | Prototyping | UX research | Design systems | Accessibility | Workshop facilitation',
    projects: [
      'SELF-SERVICE ONBOARDING | Product design lead',
      '- Created a guided setup flow that helped new users reach their first project faster.',
      'DESIGN SYSTEM STARTER KIT | Contributor',
      '- Documented accessible components and usage patterns for a team of 12 designers and engineers.',
    ].join('\n'),
    isExample: true,
  };
}

function readSavedResume(user) {
  const savedResume = window.localStorage.getItem(RESUME_STORAGE_KEY);

  if (!savedResume) {
    return createExampleResume(user);
  }

  try {
    return {
      ...createBlankResume(user),
      ...JSON.parse(savedResume),
    };
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    window.localStorage.removeItem(RESUME_STORAGE_KEY);
    return createExampleResume(user);
  }
}

function getTemplateName() {
  const savedTemplate = window.localStorage.getItem(TEMPLATE_STORAGE_KEY);

  if (!savedTemplate) {
    return 'Modern Minimal';
  }

  try {
    const templateName = JSON.parse(savedTemplate);
    if (typeof templateName === 'string' && TEMPLATE_STYLES[templateName]) {
      return templateName;
    }
  } catch (error) {
    // Support template names saved as plain text by older versions of the app.
    if (TEMPLATE_STYLES[savedTemplate]) {
      return savedTemplate;
    }
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
  }

  return 'Modern Minimal';
}

function getTemplateClass(templateName) {
  return TEMPLATE_STYLES[templateName] || 'modern';
}

function getSectionTitle(field) {
  if (field === 'summary') {
    return 'Professional Summary';
  }

  return field.charAt(0).toUpperCase() + field.slice(1);
}

function ResumeSection({ field, value }) {
  if (!value.trim()) {
    return null;
  }

  if (field === 'skills') {
    const skills = value
      .split(/[|,•]/)
      .map((skill) => skill.trim())
      .filter(Boolean);

    return (
      <section className="paper-section" key={field}>
        <h2>{getSectionTitle(field)}</h2>
        <div className="paper-skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
    );
  }

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className={`paper-section paper-section-${field}`} key={field}>
      <h2>{getSectionTitle(field)}</h2>
      <div className="paper-section-content">
        {lines.map((line, index) => {
          const isBullet = /^[-*•]\s*/.test(line);
          const content = line.replace(/^[-*•]\s*/, '');

          if (field === 'summary') {
            return <p key={`${field}-${index}`}>{content}</p>;
          }

          if (isBullet) {
            return (
              <p className="paper-bullet" key={`${field}-${index}`}>
                <span aria-hidden="true">•</span>
                {content}
              </p>
            );
          }

          return (
            <h3 className="paper-entry-title" key={`${field}-${index}`}>
              {content}
            </h3>
          );
        })}
      </div>
    </section>
  );
}

function ResumeSections({ resume, fields }) {
  return fields.map((field) => (
    <ResumeSection field={field} value={resume[field] || ''} key={field} />
  ));
}

function ResumePaper({ resume, templateName }) {
  const allSections = ['summary', 'experience', 'education', 'skills', 'projects'];
  const studentSections = ['summary', 'education', 'projects', 'experience', 'skills'];
  const isStudentTemplate = templateName === 'Student Friendly';
  const isTwoColumnTemplate = templateName === 'Two Column';
  const regularSections = isStudentTemplate ? studentSections : allSections;

  return (
    <article className={`resume-paper ${getTemplateClass(templateName)}`}>
      <header className="paper-header">
        <h1 className="paper-name">{resume.name || 'Your Name'}</h1>
        {resume.title && <p className="paper-title">{resume.title}</p>}
        <p className="paper-contact">
          {[resume.email, resume.phone, resume.location, resume.linkedin]
            .filter(Boolean)
            .join('  |  ')}
        </p>
      </header>

      {isTwoColumnTemplate ? (
        <div className="paper-body paper-body-columns">
          <main className="paper-main-column">
            <ResumeSections
              resume={resume}
              fields={['summary', 'experience', 'projects']}
            />
          </main>
          <aside className="paper-side-column">
            <ResumeSections resume={resume} fields={['skills', 'education']} />
          </aside>
        </div>
      ) : (
        <div className="paper-body">
          <ResumeSections resume={resume} fields={regularSections} />
        </div>
      )}
    </article>
  );
}

function PageHeading({ title, subtitle, actions }) {
  return (
    <div className="page-heading resume-page-heading">
      <div>
        <div className="eyebrow">RESUME TOOLS</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="resume-page-actions">{actions}</div>
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

export default function ResumeBuilderPage({ notify, user }) {
  const [resume, setResume] = useState(() => readSavedResume(user));
  const [activeTab, setActiveTab] = useState('Personal');
  const [isSaved, setIsSaved] = useState(true);
  const previewRef = useRef(null);
  const templateName = getTemplateName();

  useEffect(() => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  function updateResumeField(field, value) {
    setResume((current) => ({
      ...current,
      [field]: value,
      isExample: false,
    }));
    setIsSaved(false);
  }

  function loadExample() {
    setResume(createExampleResume(user));
    setIsSaved(false);
    notify('Sample resume loaded. Replace its example details with your own.');
  }

  function startBlankResume() {
    setResume(createBlankResume(user));
    setIsSaved(false);
    notify('Blank resume started.');
  }

  function saveResume() {
    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
      setIsSaved(true);
      notify('Resume draft saved in this browser.');
    } catch (error) {
      notify('Could not save this draft in your browser.');
    }
  }

  function printResume() {
    const hasResumeContent = [
      resume.name,
      resume.title,
      resume.summary,
      resume.experience,
      resume.education,
      resume.skills,
      resume.projects,
    ].some((value) => value.trim());

    if (!hasResumeContent) {
      notify('Add some resume details before printing.');
      return;
    }

    window.print();
  }

  function updateSectionFromTab(value) {
    updateResumeField(activeTab.toLowerCase(), value);
  }

  function showPreview() {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const personalFields = [
    ['name', 'Full name'],
    ['title', 'Professional title'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['location', 'Location'],
    ['linkedin', 'LinkedIn'],
  ];

  return (
    <>
      <PageHeading
        title="Resume builder"
        subtitle="Edit a polished, printable resume. Your draft is saved in this browser."
        actions={
          <>
            <span className={`save-state ${isSaved ? 'saved' : ''}`}>
              {isSaved ? 'Saved in this browser' : 'Unsaved changes'}
            </span>
            <ActionButton variant="secondary" onClick={showPreview}>
              Preview
            </ActionButton>
            <ActionButton onClick={printResume}>Print resume / save PDF</ActionButton>
          </>
        }
      />

      {resume.isExample && (
        <div className="resume-example-notice">
          <div>
            <strong>Example resume</strong>
            <span>Replace the sample content with your own details before using it.</span>
          </div>
          <div className="resume-example-actions">
            <ActionButton variant="secondary" onClick={loadExample}>
              Reload example
            </ActionButton>
            <ActionButton variant="secondary" onClick={startBlankResume}>
              Start blank
            </ActionButton>
          </div>
        </div>
      )}

      <div className="builder-tabs" role="tablist" aria-label="Resume sections">
        {BUILDER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {!resume.isExample && (
        <div className="builder-example-link">
          <span>Want to see how a completed resume can look?</span>
          <button type="button" onClick={loadExample}>Load sample resume</button>
        </div>
      )}

      <div className="builder-layout resume-builder-layout">
        <section className="card builder-form">
          <div className="section-title">
            <div>
              <h2>{activeTab} information</h2>
              <p>Update a section and review the live resume preview.</p>
            </div>
          </div>

          {activeTab === 'Personal' ? (
            <div className="builder-fields">
              {personalFields.map(([field, label]) => (
                <label className="field-label" key={field}>
                  {label}
                  <input
                    value={resume[field]}
                    onChange={(event) => updateResumeField(field, event.target.value)}
                    placeholder={`Add your ${label.toLowerCase()}`}
                  />
                </label>
              ))}
            </div>
          ) : (
            <label className="field-label builder-section-editor">
              {activeTab} details
              <textarea
                rows="12"
                value={resume[activeTab.toLowerCase()] || ''}
                onChange={(event) => updateSectionFromTab(event.target.value)}
                placeholder={
                  activeTab === 'Summary'
                    ? 'Write 2–3 sentences about your strengths and experience.'
                    : `Add ${activeTab.toLowerCase()} details. Put each item on a separate line.`
                }
              />
              <small>
                For experience and projects, put the role or project title on one line,
                then start each result with a hyphen.
              </small>
            </label>
          )}

          <div className="builder-footer resume-builder-footer">
            <ActionButton
              variant="secondary"
              onClick={() => {
                const currentIndex = BUILDER_TABS.indexOf(activeTab);
                setActiveTab(BUILDER_TABS[Math.max(0, currentIndex - 1)]);
              }}
            >
              Back
            </ActionButton>
            <ActionButton
              variant="secondary"
              onClick={() => {
                const currentIndex = BUILDER_TABS.indexOf(activeTab);
                setActiveTab(
                  BUILDER_TABS[Math.min(BUILDER_TABS.length - 1, currentIndex + 1)]
                );
              }}
            >
              Next section
            </ActionButton>
            <ActionButton onClick={saveResume}>Save draft</ActionButton>
          </div>
        </section>

        <section className="card resume-live-preview" ref={previewRef}>
          <div className="preview-toolbar">
            <span>LIVE PREVIEW</span>
            <span>{templateName}</span>
          </div>
          <ResumePaper resume={resume} templateName={templateName} />
          <p className="resume-print-hint">
            Print opens your browser dialog. Choose “Save as PDF” to download a PDF.
          </p>
        </section>
      </div>
    </>
  );
}
