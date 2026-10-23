import React, { useEffect, useRef, useState } from 'react';

const pages = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦', path: '/app/dashboard' },
  { id: 'upload', label: 'Resume Analysis', icon: '▤', path: '/app/upload' },
  { id: 'job-match', label: 'Job Match', icon: '⌕', path: '/app/job-match' },
  { id: 'builder', label: 'Resume Builder', icon: '▧', path: '/app/builder' },
  { id: 'templates', label: 'Templates', icon: '▣', path: '/app/templates' },
  { id: 'interview', label: 'Interview Prep', icon: '◉', path: '/app/interview' },
  { id: 'history', label: 'History', icon: '◷', path: '/app/history' },
  { id: 'suggestions', label: 'AI Suggestions', icon: '✣', path: '/app/suggestions' },
  { id: 'ats-check', label: 'ATS Compatibility', icon: '✓', path: '/app/ats-check' },
  { id: 'improve', label: 'Resume Improvement', icon: '✎', path: '/app/improve' },
  { id: 'skills', label: 'Skill Gap Analyzer', icon: '◈', path: '/app/skills' },
  { id: 'jobs', label: 'Job Recommendations', icon: '⌕', path: '/app/jobs' },
  { id: 'applications', label: 'Application Tracker', icon: '▤', path: '/app/applications' },
  { id: 'mock-interview', label: 'Mock Interview', icon: '◉', path: '/app/mock-interview' },
  { id: 'assistant', label: 'AI Career Assistant', icon: '✦', path: '/app/assistant' },
  { id: 'profile', label: 'Profile', icon: '♙', path: '/app/profile' },
  { id: 'settings', label: 'Settings', icon: '⚙', path: '/app/settings' },
];

const initialPath = () => window.location.pathname.replace(/\/$/, '') || '/';
const routeFor = (path) => {
  path = path.replace(/^\/app/, '');
  const routes = {
    '/': 'splash',
    '/splash': 'splash',
    '/home': 'home',
    '/landing': 'home',
    '/intro': 'intro',
    '/login': 'login',
    '/signup': 'signup',
    '/dashboard': 'dashboard',
    '/upload': 'upload',
    '/upload-resume': 'upload',
    '/analysis': 'analysis',
    '/resume-analysis': 'analysis',
    '/ats-check': 'ats-check',
    '/ats-compatibility': 'ats-check',
    '/improve': 'improve',
    '/resume-improvement': 'improve',
    '/job-match': 'job-match',
    '/job-description': 'job-match',
    '/suggestions': 'suggestions',
    '/ai-suggestions': 'suggestions',
    '/templates': 'templates',
    '/builder': 'builder',
    '/interview': 'interview',
    '/interview-prep': 'interview',
    '/history': 'history',
    '/analytics': 'history',
    '/skills': 'skills',
    '/skill-gap': 'skills',
    '/jobs': 'jobs',
    '/job-recommendations': 'jobs',
    '/applications': 'applications',
    '/application-tracker': 'applications',
    '/mock-interview': 'mock-interview',
    '/assistant': 'assistant',
    '/career-assistant': 'assistant',
    '/chat': 'assistant',
    '/profile': 'profile',
    '/profile-setup': 'profile-setup',
    '/settings': 'settings',
  };
  return routes[path] || 'dashboard';
};

function App() {
  const [path, setPath] = useState(initialPath);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handlePopState = () => setPath(initialPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const navigate = (nextPath) => {
    if (!nextPath) return;
    const destination = nextPath.startsWith('/app') ? nextPath : `/app${nextPath === '/' ? '' : nextPath}`;
    window.history.pushState({}, '', destination);
    setPath(destination);
    window.scrollTo(0, 0);
  };
  const page = routeFor(path);
  const isAuth = ['splash', 'intro', 'login', 'signup'].includes(page);
  const activePage = page === 'analysis' ? 'upload' : page;

  if (isAuth) {
    return (
      <>
        <AuthPage page={page} navigate={navigate} notify={setNotice} />
        {notice && <div className="toast">{notice}</div>}
      </>
    );
  }

  if (page === 'home') {
    return (
      <>
        <LandingPage navigate={navigate} />
        {notice && <div className="toast">{notice}</div>}
      </>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/app/dashboard" onClick={(event) => { event.preventDefault(); navigate('/dashboard'); }}>
          <span className="brand-mark">CV</span>
          <span className="brand-copy"><b>CV INSIGHTS</b><small>Your AI career copilot</small></span>
        </a>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-caption">WORKSPACE</span>
          {pages.slice(0, 15).map((item) => (
            <a key={item.id} className={`nav-link ${activePage === item.id ? 'active' : ''}`} href={item.path}
              onClick={(event) => { event.preventDefault(); navigate(item.path); }}>
              <span className="nav-icon">{item.icon}</span>{item.label}
              {item.id === 'suggestions' && <span className="nav-new">NEW</span>}
            </a>
          ))}
          <span className="nav-caption nav-caption-account">ACCOUNT</span>
          {pages.slice(15).map((item) => (
            <a key={item.id} className={`nav-link ${activePage === item.id || (page === 'profile-setup' && item.id === 'profile') ? 'active' : ''}`} href={item.path}
              onClick={(event) => { event.preventDefault(); navigate(item.path); }}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-spark">✦</span>
            <b>Unlock your potential</b>
            <span>Get unlimited AI insights and more.</span>
            <button className="upgrade-button" onClick={() => setNotice('Your Pro plan options are coming soon.')}>Upgrade to Pro <span>↗</span></button>
          </div>
          <button className="sidebar-user" onClick={() => navigate('/profile')}>
            <span className="avatar avatar-small">AJ</span>
            <span><b>Alex Johnson</b><small>Free plan</small></span>
            <span className="user-menu">•••</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <label className="global-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search resumes, jobs, templates..." /><kbd>⌘ K</kbd></label>
            <button className="icon-button" aria-label="Notifications" onClick={() => setNotice('You’re all caught up!')}>♧<i /></button>
            <button className="top-user" onClick={() => navigate('/profile')}><span className="avatar avatar-small">AJ</span><span>Alex</span><span className="chevron">⌄</span></button>
          </div>
        </header>
        <div className="page-content">
          {page === 'dashboard' && <Dashboard navigate={navigate} notify={setNotice} />}
          {page === 'upload' && <Upload navigate={navigate} notify={setNotice} />}
          {page === 'analysis' && <Analysis navigate={navigate} notify={setNotice} />}
          {page === 'ats-check' && <ATSCheck navigate={navigate} notify={setNotice} />}
          {page === 'improve' && <ResumeImprovement notify={setNotice} />}
          {page === 'job-match' && <JobMatch notify={setNotice} />}
          {page === 'suggestions' && <Suggestions notify={setNotice} />}
          {page === 'templates' && <Templates notify={setNotice} />}
          {page === 'builder' && <Builder notify={setNotice} />}
          {page === 'interview' && <Interview notify={setNotice} />}
          {page === 'history' && <History navigate={navigate} />}
          {page === 'skills' && <SkillGap navigate={navigate} notify={setNotice} />}
          {page === 'jobs' && <JobRecommendations notify={setNotice} />}
          {page === 'applications' && <ApplicationTracker notify={setNotice} />}
          {page === 'mock-interview' && <MockInterview notify={setNotice} />}
          {page === 'assistant' && <CareerAssistant navigate={navigate} notify={setNotice} />}
          {page === 'profile' && <Profile notify={setNotice} />}
          {page === 'settings' && <Settings notify={setNotice} />}
          {page === 'profile-setup' && <ProfileSetup navigate={navigate} notify={setNotice} />}
        </div>
      </main>
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}

function pageTitle(page) {
  const titles = { dashboard: 'Dashboard', upload: 'Resume Analysis', analysis: 'Analysis Results', 'ats-check': 'ATS Compatibility', improve: 'Resume Improvement', 'job-match': 'Job Match', suggestions: 'AI Suggestions', templates: 'Resume Templates', builder: 'Resume Builder', interview: 'Interview Prep', history: 'History & Analytics', skills: 'Skill Gap Analyzer', jobs: 'Job Recommendations', applications: 'Application Tracker', 'mock-interview': 'Mock Interview', assistant: 'AI Career Assistant', profile: 'Profile & Settings', settings: 'Settings', 'profile-setup': 'Profile Setup' };
  return titles[page] || 'Dashboard';
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>;
}
function Button({ children, onClick, variant = 'primary', type = 'button' }) {
  return <button type={type} className={`button ${variant}`} onClick={onClick}>{children}</button>;
}
function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}
function ProgressRing({ score, label = 'ATS Score', size = 'large' }) {
  return <div className={`progress-ring ${size}`} style={{ '--score': `${score}%` }}><div><strong>{score}%</strong><span>{label}</span></div></div>;
}
function StatCard({ icon, label, value, change, color }) {
  return <div className="stat-card"><span className={`stat-icon ${color}`}>{icon}</span><div className="stat-label">{label}</div><strong>{value}</strong><div className={`stat-change ${change.startsWith('-') ? 'down' : ''}`}>{change}</div></div>;
}

function Dashboard({ navigate }) {
  return <>
    <PageHeading eyebrow="YOUR CAREER AT A GLANCE" title={<>Welcome back, Alex! <span className="wave">👋</span></>} subtitle="Here’s what’s happening with your career journey." action={<Button onClick={() => navigate('/upload')}>＋ Upload resume</Button>} />
    <div className="stats-grid">
      <StatCard icon="▤" label="Resumes analyzed" value="12" change="↑ 2 this month" color="purple" />
      <StatCard icon="▣" label="Job matches" value="36" change="↑ 8 this week" color="blue" />
      <StatCard icon="◉" label="Interview questions" value="18" change="Ready to practice" color="orange" />
      <StatCard icon="✓" label="Applications sent" value="3" change="↑ 1 this week" color="green" />
    </div>
    <Card className="dashboard-insight">
      <span className="insight-icon">✓</span>
      <div><b>Your resume score improved by 24%</b><span>Keep going! You’re one step closer to your next opportunity.</span></div>
      <button className="text-link" onClick={() => navigate('/analysis')}>View analysis →</button>
    </Card>
    <div className="dashboard-grid dashboard-reference-grid">
      <Card className="activity-card">
        <div className="section-title"><div><h2>Recent activity</h2><p>Your latest career moves.</p></div><button className="text-link" onClick={() => navigate('/history')}>View all →</button></div>
        <ActivityList />
      </Card>
      <Card className="trend-card">
        <div className="section-title"><div><h2>Resume score trend</h2><p>Your progress over the last 6 months.</p></div><button className="text-link" onClick={() => navigate('/history')}>See history →</button></div>
        <AnalyticsChart />
      </Card>
    </div>
    <div className="dashboard-shortcuts">
      <button className="quick-action" onClick={() => navigate('/jobs')}><span className="quick-icon blue">⌕</span><b>Explore job matches</b><span className="arrow">↗</span></button>
      <button className="quick-action" onClick={() => navigate('/assistant')}><span className="quick-icon purple">✦</span><b>Ask your career assistant</b><span className="arrow">↗</span></button>
      <button className="quick-action" onClick={() => navigate('/applications')}><span className="quick-icon cyan">▤</span><b>Track applications</b><span className="arrow">↗</span></button>
    </div>
  </>;
}
function QuickAction({ icon, color, label, onClick }) {
  return <button className="quick-action" onClick={onClick}><span className={`quick-icon ${color}`}>{icon}</span><b>{label}</b><span className="arrow">↗</span></button>;
}
function ActivityList() {
  const items = [['PDF', 'Software_Engineer_Resume.pdf', 'Analyzed · 2 hours ago', '89%', 'pdf'], ['DOC', 'Data_Analyst_Resume.docx', 'Analyzed · Yesterday', '74%', 'doc'], ['PDF', 'Frontend_Developer_Resume.pdf', 'Analyzed · Oct 18, 2026', '82%', 'pdf']];
  return <div className="activity-list">{items.map(([type, name, date, score, color]) => <div className="activity-row" key={name}><span className={`file-icon ${color}`}>{type}</span><div className="activity-name"><b>{name}</b><span>{date}</span></div><span className={`score-pill ${score === '74%' ? 'warning' : ''}`}>{score}</span><button className="more-button">•••</button></div>)}</div>;
}

function Dropzone({ onFile }) {
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);
  const chooseFile = (file) => {
    if (!file) return;
    setFileName(file.name);
  };
  return <div className="dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }}>
    <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(event) => chooseFile(event.target.files[0])} />
    <span className="upload-cloud">↑</span><b>{fileName || 'Drag & drop your resume here'}</b><span>or click below to browse files</span>
    <Button onClick={() => fileName ? onFile() : inputRef.current?.click()}>{fileName ? 'Analyze resume →' : 'Choose file'}</Button>
    <small>PDF, DOC, DOCX · Max file size: 10 MB</small>
  </div>;
}

function Upload({ navigate, notify }) {
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Upload your resume" subtitle="Get an instant ATS analysis, keyword match, and AI-powered suggestions." />
    <div className="upload-layout">
      <Card className="upload-main-card"><div className="section-title"><div><h2>Start with your resume</h2><p>Upload a file to see how it performs with applicant tracking systems.</p></div><span className="secure-note">♢ Secure &amp; private</span></div>
        <Dropzone onFile={() => navigate('/analysis')} />
        <div className="supported-files"><span>✓ PDF documents</span><span>✓ Microsoft Word</span><span>✓ Up to 10 MB</span></div>
      </Card>
      <Card className="why-card"><span className="why-icon">✧</span><h2>Why analyze your resume?</h2><p>Make sure your experience gets noticed by both recruiters and applicant tracking systems.</p><div className="benefit-list"><span><i>✓</i><b>Get your ATS score</b><small>See how your resume ranks</small></span><span><i>✓</i><b>Find missing keywords</b><small>Match skills to your next role</small></span><span><i>✓</i><b>Receive AI suggestions</b><small>Improve impact and clarity</small></span><span><i>✓</i><b>Track your progress</b><small>Keep every version organized</small></span></div></Card>
    </div>
    <div className="upload-footnote">🔒 Your resume is encrypted and private. We never share your data.</div>
    <div className="upload-recent"><div className="section-title"><div><h2>Recently analyzed</h2><p>Open a previous result whenever you need it.</p></div><button className="text-link" onClick={() => navigate('/history')}>View history →</button></div><ActivityList /></div>
  </>;
}

function Analysis({ navigate, notify }) {
  return <>
    <PageHeading eyebrow="RESUME TOOLS / ANALYSIS RESULTS" title="Resume analysis" subtitle="Software_Engineer_Resume.pdf · Analyzed just now" action={<div className="button-row"><Button variant="secondary" onClick={() => navigate('/upload')}>↻ Re-analyze</Button><Button onClick={() => notify('Your resume report is ready to download.')}>↓ Download report</Button></div>} />
    <Card className="analysis-banner"><div className="banner-score"><ProgressRing score={89} /></div><div className="banner-copy"><span className="status-label">✦ GREAT MATCH</span><h2>Your resume is looking strong!</h2><p>You’re ahead of 78% of candidates in your field. A few improvements could make it even better.</p><div className="banner-pills"><span>✓ ATS friendly</span><span>✓ Strong keywords</span><span>↗ +12% this month</span></div></div><div className="banner-chart"><div className="mini-chart"><i style={{height:'34%'}}/><i style={{height:'47%'}}/><i style={{height:'43%'}}/><i style={{height:'67%'}}/><i style={{height:'59%'}}/><i style={{height:'75%'}}/><i style={{height:'90%'}}/></div><span>YOUR SCORE OVER TIME</span></div></Card>
    <div className="analysis-columns"><Card><div className="section-title"><div><h2>Score breakdown</h2><p>How each section contributes to your score.</p></div></div><ScoreBreakdown /></Card><Card><div className="section-title"><div><h2>Top recommendations</h2><p>Three quick wins to improve your score.</p></div><button className="text-link" onClick={() => navigate('/suggestions')}>View all →</button></div><RecommendationList notify={notify} /></Card></div>
    <div className="keyword-columns"><Card><div className="section-title"><div><h2>Matched keywords <span className="subtle-count">12</span></h2></div></div><KeywordTags values={['React','Node.js','JavaScript','TypeScript','AWS','Docker','CI/CD','Agile']} /></Card><Card><div className="section-title"><div><h2>Missing keywords <span className="subtle-count warn-count">3</span></h2></div></div><KeywordTags warning values={['Kubernetes','System Design','Microservices']} /></Card></div>
  </>;
}

function ATSCheck({ navigate, notify }) {
  const checks = [
    ['✓', 'Contact information', 'Name, email, and phone number are easy to find.', 'Passed'],
    ['✓', 'Standard section headings', 'Experience and education sections are recognized.', 'Passed'],
    ['✓', 'Readable file format', 'Your PDF text can be parsed correctly.', 'Passed'],
    ['✓', 'Relevant keywords', 'Most skills from the target role appear in your resume.', 'Passed'],
    ['!', 'Work experience dates', 'Use a consistent month and year format.', 'Needs review'],
    ['!', 'Skills to include', 'Consider adding accessibility and automated testing.', 'Needs review'],
  ];
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="ATS compatibility check" subtitle="See how applicant tracking systems read your resume and find quick ways to improve it." action={<Button variant="secondary" onClick={() => navigate('/upload')}>↻ Check another resume</Button>} />
    <Card className="ats-overview-card"><div className="ats-score-overview"><ProgressRing score={85} label="ATS friendly" /><div><span className="ats-status-label">✓ ATS FRIENDLY</span><h2>Your resume is ready for most tracking systems</h2><p>We checked the formatting, structure, and keywords in Software_Engineer_Resume.pdf.</p><button className="text-link" onClick={() => notify('Your ATS compatibility report is ready to download.')}>↓ Download full report</button></div></div><div className="ats-overview-metrics"><span><b>12</b>Checks passed</span><span><b>2</b>Suggested improvements</span><span><b>1,240</b>Job descriptions compared</span></div></Card>
    <div className="ats-detail-grid"><Card><div className="section-title"><div><h2>Compatibility checklist</h2><p>What hiring platforms can read in your resume.</p></div></div><div className="ats-checklist">{checks.map(([icon,title,detail,status]) => <div className="ats-check-row" key={title}><span className={`ats-check-icon ${status === 'Passed' ? '' : 'needs-review'}`}>{icon}</span><span><b>{title}</b><small>{detail}</small></span><span className={`ats-check-status ${status === 'Passed' ? '' : 'needs-review'}`}>{status}</span></div>)}</div></Card><Card><div className="section-title"><div><h2>Keyword coverage</h2><p>Skills frequently requested for your target role.</p></div></div><div className="ats-keyword-meter"><div><span>Matched keywords</span><b>12 / 14</b></div><div className="skill-track"><i style={{ width: '86%' }} /></div></div><KeywordTags values={['React','TypeScript','JavaScript','Node.js','AWS','REST APIs']} /><h3 className="mini-heading">Add these skills if relevant</h3><KeywordTags warning values={['Accessibility','Automated testing']} /><div className="ats-recommendation"><b>Quick improvement</b><p>Use a standard “Work Experience” heading and a consistent date format to improve parsing.</p><Button onClick={() => navigate('/improve')}>Improve my resume →</Button></div></Card></div>
  </>;
}

function ResumeImprovement({ notify }) {
  const [mode, setMode] = useState('Improved');
  const [original, setOriginal] = useState('Worked on the company website and helped make it faster.');
  const [improved, setImproved] = useState('Improved website performance by 35%, reducing page load times and increasing customer engagement.');
  const [applied, setApplied] = useState(false);
  const copyImproved = () => {
    if (!navigator.clipboard?.writeText) {
      notify('Clipboard access is unavailable. Select and copy the improved text manually.');
      return;
    }
    navigator.clipboard.writeText(improved)
      .then(() => notify('Improved text copied.'))
      .catch(() => notify('Could not copy text. Please select and copy it manually.'));
  };
  return <>
    <PageHeading eyebrow="AI CAREER COACH" title="Resume improvement" subtitle="Review AI suggestions, compare your original wording, and make each bullet more impactful." action={<Button onClick={() => { setApplied(true); notify('Your resume improvement has been saved.'); }}>✓ Save changes</Button>} />
    <div className="improvement-summary"><span>✦</span><div><b>Three opportunities to strengthen this resume</b><small>We focused on clear impact, measurable results, and action-oriented language.</small></div><span className="impact-badge high">HIGH IMPACT</span></div>
    <Card className="improvement-editor"><div className="section-title"><div><h2>Experience · Software Engineer</h2><p>Compare the original sentence with the AI-improved version.</p></div><span className={`save-state ${applied ? 'saved' : ''}`}>{applied ? '✓ Saved' : '● Unsaved changes'}</span></div><div className="improvement-tabs"><button className={mode === 'Original' ? 'selected' : ''} onClick={() => setMode('Original')}>Original</button><button className={mode === 'Improved' ? 'selected' : ''} onClick={() => setMode('Improved')}>✦ Improved</button></div><div className="improvement-columns"><label className="field-label">Original content<textarea rows="8" value={original} onChange={(event) => { setOriginal(event.target.value); setApplied(false); }} /></label><label className="field-label">AI suggested version<textarea rows="8" className="improved-textarea" value={improved} onChange={(event) => { setImproved(event.target.value); setApplied(false); }} /></label></div><div className="improvement-actions"><Button variant="secondary" onClick={() => { setImproved(original); setApplied(false); }}>↶ Reset suggestion</Button><Button onClick={() => { setOriginal(improved); setApplied(true); notify('Improved wording applied to your resume.'); }}>✓ Apply suggestion</Button><Button variant="secondary" onClick={copyImproved}>Copy text</Button></div></Card>
    <Card className="more-improvements"><div className="section-title"><div><h2>More suggestions</h2><p>Small changes that can make your experience stand out.</p></div></div>{[['Add a measurable outcome','Show the result of your work with a percentage or number.'],['Use a stronger action verb','Start with a clear verb that describes your contribution.'],['Tailor keywords to the role','Include relevant skills from the job description.']].map(([title,detail]) => <button className="improvement-suggestion" key={title} onClick={() => notify(`Suggestion selected: ${title}`)}><span><b>{title}</b><small>{detail}</small></span><i>›</i></button>)}</Card>
  </>;
}

function ScoreBreakdown() {
  return <div className="score-breakdown">{[['Skills match',92],['Experience',90],['Education',85],['Formatting',83],['Grammar & clarity',94]].map(([label,score])=><div className="score-line" key={label}><div><span>{label}</span><b>{score}%</b></div><div className="meter"><i style={{width:`${score}%`}}/></div></div>)}</div>;
}
function KeywordTags({ values, warning = false }) {
  return <div className={`keyword-tags ${warning ? 'warning-tags' : ''}`}>{values.map((value) => <span key={value}>{value}</span>)}</div>;
}
function RecommendationList({ notify }) {
  const suggestions = [['✦','Add a metrics-driven achievement','Include specific numbers that show your impact.','High impact'],['↗','Improve project descriptions','Highlight the tools, scope, and outcomes of your work.','Medium'],['✦','Use stronger action verbs','Replace passive wording with “led”, “built”, and “delivered”.','Medium']];
  return <div className="recommendation-list">{suggestions.map(([icon,title,desc,level])=><div className="recommendation" key={title}><span className="recommend-icon">{icon}</span><div><b>{title}</b><p>{desc}</p><span className="impact">{level}</span></div><button className="small-apply" onClick={() => notify(`Applied suggestion: ${title}`)}>Apply</button></div>)}</div>;
}

function JobMatch({ notify }) {
  const [job, setJob] = useState('Senior Software Engineer');
  const [company, setCompany] = useState('Acme Technologies');
  const [description, setDescription] = useState('We are looking for a Senior Software Engineer to build scalable web applications. You will collaborate with cross-functional teams, design APIs, and deliver high-quality products using React, Node.js, TypeScript, and AWS.');
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Job description matcher" subtitle="Compare your resume to a role and discover the skills that will help you stand out." />
    <div className="match-layout">
      <Card className="job-form"><div className="section-title"><div><h2>Job details</h2><p>Add the role you’re applying for.</p></div></div><label className="field-label">Job title<input value={job} onChange={(event)=>setJob(event.target.value)} /></label><label className="field-label">Company<input value={company} onChange={(event)=>setCompany(event.target.value)} /></label><label className="field-label">Job description<textarea value={description} onChange={(event)=>setDescription(event.target.value)} rows="10" /></label><Button onClick={()=>notify('Your resume has been matched to this job.')}>✦ Match my resume →</Button><small className="match-note">Your resume: Software_Engineer_Resume.pdf</small></Card>
      <Card className="match-results"><div className="section-title"><div><h2>Match results</h2><p>{company || 'Your target company'} · {job || 'Target role'}</p></div><span className="match-live">LIVE</span></div><div className="match-score-wrap"><ProgressRing score={78} label="Match score" /><div><b>Good match!</b><p>Your experience aligns well with this role.</p></div></div><h3 className="mini-heading">Matched skills</h3><KeywordTags values={['React','TypeScript','Node.js','AWS','REST APIs']} /><h3 className="mini-heading missing-heading">Skills to highlight</h3><KeywordTags warning values={['System design','Mentoring']} /><div className="match-advice"><span>✦</span><div><b>AI recommendation</b><p>Emphasize your experience building scalable APIs in your project descriptions.</p></div></div></Card>
    </div>
  </>;
}

function Suggestions({ notify }) {
  const [filter, setFilter] = useState('All suggestions');
  const suggestions = [
    ['✹','Add measurable achievements','Replace broad responsibilities with specific results and numbers.','HIGH IMPACT','high'],
    ['↗','Improve project descriptions','Add the tools you used, the size of the project, and the outcome.','MEDIUM','medium'],
    ['✦','Use stronger action verbs','Use action words that clearly communicate your contribution.','MEDIUM','medium'],
    ['▤','Optimize your formatting','Keep headings consistent and make your most relevant experience easy to find.','LOW','low'],
  ];
  const visible = filter === 'All suggestions' ? suggestions : suggestions.filter((item) => item[3].toLowerCase().includes(filter.toLowerCase()));
  return <>
    <PageHeading eyebrow="AI CAREER COACH" title="AI suggestions" subtitle="Personalized recommendations to make your resume stand out." action={<Button onClick={()=>notify('Your recommendations are up to date.')}>✦ Generate new suggestions</Button>} />
    <div className="filter-tabs">{['All suggestions','High impact','Medium','Low'].map((tab)=><button key={tab} className={filter===tab?'selected':''} onClick={()=>setFilter(tab)}>{tab}{tab==='All suggestions'&&<span>4</span>}</button>)}</div>
    <div className="suggestion-stack">{visible.map(([icon,title,desc,level,color])=><Card className="suggestion-card" key={title}><span className={`suggestion-icon ${color}`}>{icon}</span><div className="suggestion-content"><div className="suggestion-heading"><h2>{title}</h2><span className={`impact-badge ${color}`}>{level}</span></div><p>{desc}</p><div className="suggestion-meta"><span>✦ AI suggestion</span><span>Resume: Software_Engineer_Resume.pdf</span></div></div><Button variant="secondary" onClick={()=>notify(`Applied: ${title}`)}>Apply suggestion</Button></Card>)}</div>
  </>;
}

const templates = [
  ['Modern Minimal','Clean, contemporary, and easy to scan.','modern'],['Professional','A polished layout for experienced professionals.','professional'],['Creative Edge','Distinctive style with a confident visual hierarchy.','creative'],['Executive Classic','Timeless structure for senior leadership roles.','executive'],['Student Friendly','Showcase education, projects, and potential.','student'],['Two Column','Compact layout with a clear skills sidebar.','columns'],
];
function Templates({ notify }) {
  const [selected, setSelected] = useState('Modern Minimal');
  const [query, setQuery] = useState('');
  const visible = templates.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Resume templates" subtitle="ATS-friendly designs, thoughtfully crafted to help your experience shine." action={<Button onClick={()=>notify(`Selected template: ${selected}`)}>Continue with {selected} →</Button>} />
    <div className="template-toolbar"><label className="template-search">⌕ <input placeholder="Search templates..." value={query} onChange={(event)=>setQuery(event.target.value)} /></label><div className="filter-tabs compact">{['All','Modern','Professional','Creative'].map((item)=><button key={item} className={item==='All'?'selected':''} onClick={()=>setQuery(item==='All'?'':item)}>{item}</button>)}</div></div>
    <div className="template-grid">{visible.map(([name,description,style],index)=><button key={name} className={`template-card ${selected===name?'chosen':''}`} onClick={()=>setSelected(name)}><div className={`resume-preview ${style}`}><div className="preview-head"><span className="preview-avatar"/><div><i/><i/><i/></div></div><div className="preview-rule"/><div className="preview-columns"><div><i/><i/><i/><i/><i/></div><div><i/><i/><i/><i/><i/><i/></div></div><div className="preview-bottom"><i/><i/><i/></div>{index===0&&<span className="preview-tag">ATS FRIENDLY</span>}</div><span className="template-info"><span><b>{name}</b><small>{description}</small></span><span className={`template-select ${selected===name?'is-selected':''}`}>{selected===name?'✓':'+'}</span></span></button>)}</div>
  </>;
}

function Builder({ notify }) {
  const [tab, setTab] = useState('Personal');
  const [name, setName] = useState('John Anderson');
  const [title, setTitle] = useState('Full Stack Developer');
  const [saved, setSaved] = useState(false);
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Resume builder" subtitle="Create a polished, ATS-friendly resume with real-time preview." action={<div className="button-row"><span className={`save-state ${saved?'saved':''}`}>{saved?'✓ Saved':'● Unsaved changes'}</span><Button variant="secondary" onClick={()=>notify('Preview opened in this window.')}>Preview</Button><Button onClick={()=>notify('Your resume is ready to download.')}>↓ Download PDF</Button></div>} />
    <div className="builder-tabs">{['Personal','Summary','Experience','Education','Skills','Projects'].map((item)=><button key={item} className={tab===item?'active':''} onClick={()=>setTab(item)}>{item}</button>)}</div>
    <div className="builder-layout"><Card className="builder-form"><div className="section-title"><div><h2>{tab} information</h2><p>Make your story memorable.</p></div><span className="completion">● 80% complete</span></div>
      {tab==='Personal'?<div className="builder-fields"><label className="field-label">Full name<input value={name} onChange={(event)=>{setName(event.target.value);setSaved(false);}} /></label><label className="field-label">Professional title<input value={title} onChange={(event)=>{setTitle(event.target.value);setSaved(false);}} /></label><label className="field-label">Email<input defaultValue="john.anderson@email.com" /></label><label className="field-label">Phone<input defaultValue="+1 (555) 123-4567" /></label><label className="field-label">Location<input defaultValue="San Francisco, CA" /></label><label className="field-label">LinkedIn<input defaultValue="linkedin.com/in/johnanderson" /></label><label className="field-label field-full">Professional summary<textarea rows="4" defaultValue="Results-driven developer with 6+ years of experience building scalable web applications and leading high-performing teams." /></label></div>:<div className="builder-empty"><span>✦</span><h3>Add your {tab.toLowerCase()}</h3><p>Fill in your {tab.toLowerCase()} details to make your resume more compelling.</p><Button variant="secondary" onClick={()=>notify(`${tab} editor opened.`)}>＋ Add {tab.toLowerCase()}</Button></div>}
      <div className="builder-footer"><Button variant="secondary" onClick={()=>setTab('Personal')}>← Back</Button><Button onClick={()=>{setSaved(true);notify('Your resume changes have been saved.');}}>Save changes</Button></div>
    </Card><Card className="resume-live-preview"><div className="preview-toolbar"><span>LIVE PREVIEW</span><button onClick={()=>notify('Preview zoom adjusted.')}>↗</button></div><div className="resume-paper"><div className="paper-name">{name || 'Your Name'}</div><div className="paper-title">{title || 'Professional Title'}</div><div className="paper-contact">john.anderson@email.com&nbsp; · &nbsp;San Francisco, CA&nbsp; · &nbsp;LinkedIn</div><div className="paper-section"><b>PROFESSIONAL SUMMARY</b><p>Results-driven developer with 6+ years of experience building scalable web applications and leading high-performing teams.</p></div><div className="paper-section"><b>EXPERIENCE</b><strong>Senior Software Engineer</strong><span>Acme Technologies · 2022 — Present</span><p>Built and launched modern web experiences that improved customer engagement by 32%.</p></div><div className="paper-section"><b>SKILLS</b><p>React&nbsp; · &nbsp;TypeScript&nbsp; · &nbsp;Node.js&nbsp; · &nbsp;AWS&nbsp; · &nbsp;Agile</p></div><div className="paper-section"><b>EDUCATION</b><strong>B.S. Computer Science</strong><span>University of California · 2018</span></div></div></Card></div>
  </>;
}

function Interview({ notify }) {
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const questions = ['Explain the difference between SQL and NoSQL databases.','Tell me about a time you solved a difficult technical problem.','How do you make sure your code is maintainable?'];
  return <>
    <PageHeading eyebrow="CAREER COACH" title="Interview preparation" subtitle="Practice with questions tailored to your role and get instant AI feedback." action={<Button onClick={()=>notify('A new practice session is ready.')}>＋ New practice session</Button>} />
    <div className="interview-layout"><Card className="question-card"><div className="question-top"><span className="practice-tag">✦ TECHNICAL INTERVIEW</span><span>Question {question+1} of 10</span></div><div className="question-progress"><i style={{width:`${(question+1)*10}%`}}/></div><span className="question-number">QUESTION {question+1}</span><h2>{questions[question%questions.length]}</h2><div className="question-tags"><span>Software Engineer</span><span className="medium-tag">Medium</span></div><label className="field-label">Your answer<textarea rows="9" placeholder="Type your answer here..." value={answer} onChange={(event)=>setAnswer(event.target.value)} /></label><div className="answer-actions"><Button variant="secondary" onClick={()=>setAnswer('')}>Skip question</Button><Button onClick={()=>{setAnswer('');setQuestion((question+1)%10);notify('Answer submitted. Your AI feedback is ready.');}}>Submit answer →</Button></div><div className="ai-feedback"><span>✦</span><div><b>AI feedback</b><p>Your feedback will appear here after you submit an answer.</p></div></div></Card><Card className="interview-progress"><div className="section-title"><div><h2>Your progress</h2><p>Technical interview practice</p></div></div><div className="interview-ring"><ProgressRing score={10} label="Complete" /></div><div className="progress-metrics"><span>Questions attempted<b>1 / 10</b></span><span>Average score<b>—</b></span><span>Time spent<b>02:14</b></span></div><div className="interview-hint"><b>✦ Practice tip</b><p>Use the STAR method: Situation, Task, Action, and Result.</p></div></Card></div>
  </>;
}

function History({ navigate }) {
  const [filter, setFilter] = useState('All types');
  const rows = [['Software_Engineer_Resume.pdf','PDF','Oct 21, 2026','89%','Analyzed'],['Data_Analyst_Resume.docx','DOCX','Oct 19, 2026','74%','Analyzed'],['Frontend_Developer_Resume.pdf','PDF','Oct 18, 2026','82%','Analyzed'],['Product_Manager_Resume.pdf','PDF','Oct 15, 2026','68%','Needs work'],['UX_Designer_Resume.docx','DOCX','Oct 12, 2026','91%','Analyzed']];
  const visible = filter==='All types' ? rows : rows.filter(([name,type])=>type===filter || name.includes(filter));
  return <>
    <PageHeading eyebrow="YOUR WORKSPACE" title="History &amp; analytics" subtitle="Track your resume progress and career activity over time." action={<Button onClick={()=>navigate('/upload')}>＋ Analyze a resume</Button>} />
    <div className="stats-grid analytics-stats">
      <StatCard icon="▤" label="Total analyses" value="24" change="↑ 4 this month" color="purple" />
      <StatCard icon="↗" label="Average ATS score" value="82%" change="↑ 8% this quarter" color="green" />
      <StatCard icon="✦" label="Suggestions applied" value="18" change="↑ 6 this month" color="blue" />
      <StatCard icon="◷" label="Last analyzed" value="2h ago" change="Software Engineer CV" color="orange" />
    </div>
    <Card className="analytics-trend-card"><div className="section-title"><div><h2>Resume score trend</h2><p>Your ATS score is trending up. Keep making targeted improvements.</p></div><select aria-label="Analytics time period" defaultValue="Last 6 months"><option>Last 6 months</option><option>Last 30 days</option><option>Last year</option></select></div><AnalyticsChart /></Card>
    <Card className="history-card"><div className="history-filters"><label className="template-search">⌕ <input placeholder="Search files..." /></label><select value={filter} onChange={(event)=>setFilter(event.target.value)}><option>All types</option><option>PDF</option><option>DOCX</option></select><select defaultValue="All statuses"><option>All statuses</option><option>Analyzed</option><option>Needs work</option></select></div>
      <div className="table-scroll"><table className="history-table"><thead><tr><th>FILE NAME</th><th>TYPE</th><th>DATE</th><th>ATS SCORE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{visible.map(([name,type,date,score,status])=><tr key={name}><td><span className={`file-icon ${type==='PDF'?'pdf':'doc'}`}>{type}</span><b>{name}</b></td><td>{type}</td><td>{date}</td><td><span className={`score-pill ${parseInt(score)<80?'warning':''}`}>{score}</span></td><td><span className={`status-chip ${status==='Analyzed'?'complete':'pending'}`}>{status}</span></td><td><button className="table-action" onClick={()=>navigate('/analysis')}>↗</button><button className="table-action" onClick={()=>navigate('/upload')}>↓</button><button className="table-action" aria-label="More">•••</button></td></tr>)}</tbody></table></div>
      <div className="table-footer"><span>Showing {visible.length} of 24 analyses</span><div className="pagination"><button>‹</button><button className="current-page">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button></div><select defaultValue="5 per page"><option>5 per page</option><option>10 per page</option></select></div>
    </Card>
  </>;
}

function AnalyticsChart() {
  return <div className="analytics-chart">
    <div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div>
    <svg viewBox="0 0 600 190" role="img" aria-label="Resume score rising from 58 to 89 percent over six months" preserveAspectRatio="none">
      <defs><linearGradient id="score-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3478ed" stopOpacity=".2" /><stop offset="100%" stopColor="#3478ed" stopOpacity="0" /></linearGradient></defs>
      <path className="chart-area" d="M0 155 L100 138 L200 146 L300 104 L400 112 L500 70 L600 38 L600 190 L0 190 Z" />
      <path className="chart-line" d="M0 155 L100 138 L200 146 L300 104 L400 112 L500 70 L600 38" />
      <circle cx="600" cy="38" r="5" className="chart-point" />
    </svg>
    <div className="chart-x-labels"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
    <span className="chart-current-score">89%</span>
  </div>;
}

function SkillGap({ navigate, notify }) {
  const [role, setRole] = useState('Frontend Developer');
  const skills = [['React', 92, 'Strong'], ['JavaScript', 86, 'Strong'], ['TypeScript', 74, 'Good'], ['Testing', 48, 'To improve'], ['Accessibility', 32, 'Missing'], ['Performance optimization', 25, 'Missing']];
  return <>
    <PageHeading eyebrow="CAREER DEVELOPMENT" title="Skill gap analyzer" subtitle="See how your skills compare with the roles you want and get a clear plan to close the gaps." />
    <Card className="skill-role-card"><label className="field-label">Target role<select value={role} onChange={(event) => setRole(event.target.value)}><option>Frontend Developer</option><option>Senior Software Engineer</option><option>Product Designer</option><option>Data Analyst</option></select></label><span className="skill-role-note">Based on 1,240 current job descriptions</span></Card>
    <div className="skill-summary-grid">
      <Card className="skill-score-card"><div className="section-title"><div><h2>Your role readiness</h2><p>How closely your profile matches a {role} role.</p></div></div><div className="skill-score-content"><ProgressRing score={72} label="Skills match" /><div><b>You’re on the right track</b><p>You already have 9 of the 12 most requested skills for this role.</p><Button onClick={() => navigate('/jobs')}>See matching jobs →</Button></div></div></Card>
      <Card><div className="section-title"><div><h2>Skill coverage</h2><p>Skills found in your resume.</p></div></div><div className="skill-bars">{skills.map(([name, score, state]) => <div className="skill-bar-row" key={name}><div><b>{name}</b><span className={`skill-state ${state === 'Missing' || state === 'To improve' ? 'skill-state-gap' : ''}`}>{state}</span></div><div className="skill-track"><i style={{ width: `${score}%` }} /></div></div>)}</div></Card>
    </div>
    <Card className="skill-roadmap"><div className="section-title"><div><h2>Your learning roadmap</h2><p>Focus on these high-impact skills to strengthen your profile.</p></div></div><div className="roadmap-list"><div><span className="roadmap-number">01</span><span><b>Web accessibility</b><small>Learn WCAG fundamentals and accessible component patterns.</small></span><span className="roadmap-time">2 weeks</span><button className="text-link" onClick={() => notify('Web accessibility learning resources opened.')}>Explore resources →</button></div><div><span className="roadmap-number">02</span><span><b>Frontend testing</b><small>Build confidence with unit and end-to-end testing.</small></span><span className="roadmap-time">3 weeks</span><button className="text-link" onClick={() => notify('Frontend testing learning resources opened.')}>Explore resources →</button></div></div></Card>
  </>;
}

function JobRecommendations({ notify }) {
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState([]);
  const jobs = [
    ['Senior Frontend Engineer', 'Linear', 'Remote · Full-time', '$145k–$180k', '94%', ['React', 'TypeScript', 'Design systems']],
    ['Product Engineer', 'Notion', 'New York, NY · Hybrid', '$135k–$165k', '88%', ['React', 'Node.js', 'Product thinking']],
    ['UI Engineer', 'Figma', 'San Francisco, CA · Hybrid', '$150k–$190k', '82%', ['JavaScript', 'CSS', 'Accessibility']],
    ['Frontend Developer', 'Vercel', 'Remote · Full-time', '$125k–$155k', '78%', ['Next.js', 'React', 'Performance']],
  ];
  const visible = jobs.filter(([title, company]) => `${title} ${company}`.toLowerCase().includes(query.toLowerCase()));
  const toggleSaved = (title) => setSaved((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  return <>
    <PageHeading eyebrow="YOUR NEXT OPPORTUNITY" title="Job recommendations" subtitle="Roles picked for your skills, experience, and career goals." action={<Button onClick={() => notify('Job recommendations refreshed.')}>↻ Refresh matches</Button>} />
    <div className="job-match-banner"><span className="insight-icon">✦</span><div><b>Your profile is matching well</b><span>We found 36 roles that fit your experience. Your best match today is 94%.</span></div><span className="job-match-total">36 matches</span></div>
    <div className="job-filter-row"><label className="template-search">⌕ <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles or companies..." /></label><select aria-label="Filter by work style" defaultValue="Any work style"><option>Any work style</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select><select aria-label="Sort job recommendations" defaultValue="Best match"><option>Best match</option><option>Newest</option><option>Salary: high to low</option></select></div>
    <div className="job-recommendation-list">{visible.map(([title, company, details, salary, match, tags]) => <Card className="job-recommendation-card" key={title}><div className="company-mark">{company.slice(0, 1)}</div><div className="job-recommendation-main"><div className="job-title-row"><div><h2>{title}</h2><b>{company}</b></div><span className="job-match-score">{match} match</span></div><span className="job-details">{details} <i>·</i> {salary}</span><KeywordTags values={tags} /><div className="job-card-actions"><Button onClick={() => notify(`Application started for ${title} at ${company}.`)}>View job →</Button><Button variant="secondary" onClick={() => toggleSaved(title)}>{saved.includes(title) ? '✓ Saved' : '☆ Save job'}</Button><button className="text-link" onClick={() => notify(`${title} at ${company} added to your application tracker.`)}>＋ Track application</button></div></div></Card>)}</div>
    {!visible.length && <Card className="empty-results">No roles match that search. Try a different title or company.</Card>}
  </>;
}

function ApplicationTracker({ notify }) {
  const [filter, setFilter] = useState('All applications');
  const [applications, setApplications] = useState([
    { company: 'Stripe', role: 'Frontend Engineer', date: 'Oct 21, 2026', status: 'Interview', color: 'purple' },
    { company: 'Notion', role: 'Product Engineer', date: 'Oct 19, 2026', status: 'Applied', color: 'green' },
    { company: 'Figma', role: 'UI Engineer', date: 'Oct 17, 2026', status: 'In review', color: 'orange' },
    { company: 'Linear', role: 'Senior Frontend Engineer', date: 'Oct 15, 2026', status: 'Offer', color: 'blue' },
  ]);
  const visible = filter === 'All applications' ? applications : applications.filter((item) => item.status === filter);
  const updateStatus = (company, status) => setApplications((current) => current.map((item) => item.company === company ? { ...item, status } : item));
  const addApplication = () => {
    if (applications.some((item) => item.company === 'New company')) {
      notify('Your draft application is already in the tracker.');
      return;
    }
    setApplications((current) => [{ company: 'New company', role: 'New role', date: 'Today', status: 'Saved', color: 'blue' }, ...current]);
    notify('A new application draft was added.');
  };
  return <>
    <PageHeading eyebrow="YOUR JOB SEARCH" title="Application tracker" subtitle="Keep every opportunity organized, from your first application to the final offer." action={<Button onClick={addApplication}>＋ Add application</Button>} />
    <div className="stats-grid application-stats"><StatCard icon="▤" label="Total applications" value={applications.length + 8} change="↑ 3 this month" color="purple" /><StatCard icon="◷" label="In progress" value="6" change="2 interviews upcoming" color="blue" /><StatCard icon="◉" label="Interviews" value="3" change="↑ 1 this week" color="orange" /><StatCard icon="✓" label="Offers received" value="1" change="Keep it going!" color="green" /></div>
    <Card className="application-table-card"><div className="section-title"><div><h2>Your applications</h2><p>Update a status whenever your application moves forward.</p></div><select aria-label="Filter applications" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All applications</option>{['Saved', 'Applied', 'In review', 'Interview', 'Offer'].map((status) => <option key={status}>{status}</option>)}</select></div><div className="table-scroll"><table className="history-table applications-table"><thead><tr><th>COMPANY &amp; ROLE</th><th>DATE ADDED</th><th>STATUS</th><th>FOLLOW-UP</th></tr></thead><tbody>{visible.map((item) => <tr key={item.company}><td><span className={`company-mini ${item.color}`}>{item.company.slice(0, 1)}</span><span className="application-role"><b>{item.company}</b><small>{item.role}</small></span></td><td>{item.date}</td><td><select aria-label={`Update ${item.company} application status`} value={item.status} onChange={(event) => updateStatus(item.company, event.target.value)}>{['Saved', 'Applied', 'In review', 'Interview', 'Offer'].map((status) => <option key={status}>{status}</option>)}</select></td><td>{item.status === 'Interview' ? 'Prepare for interview' : item.status === 'Applied' ? 'Follow up in 5 days' : '—'}</td></tr>)}</tbody></table></div>{!visible.length && <p className="empty-results">No applications in this stage yet.</p>}</Card>
  </>;
}

function CareerAssistant({ navigate, notify }) {
  const [messages, setMessages] = useState([{ from: 'assistant', text: 'Hi Alex! I’m your AI career assistant. I can help improve your resume, find your next role, prepare for interviews, and plan your career. What would you like help with?' }]);
  const [draft, setDraft] = useState('');
  const sendMessage = (text = draft) => {
    const question = text.trim();
    if (!question) return;
    setMessages((current) => [...current, { from: 'user', text: question }, { from: 'assistant', text: 'A great next step is to tailor your resume to the role, lead with measurable results, and highlight the skills that match the job description. I can help you take it further—would you like to review your resume, find matching jobs, or practice interview questions?' }]);
    setDraft('');
  };
  return <>
    <PageHeading eyebrow="YOUR PERSONAL CAREER COACH" title="AI career assistant" subtitle="Ask anything about your job search, resume, interviews, or next career move." />
    <div className="assistant-layout"><Card className="assistant-chat"><div className="assistant-chat-header"><span className="assistant-avatar">✦</span><span><b>Your career copilot</b><small><i /> Ready to help</small></span><button className="text-link" onClick={() => setMessages([{ from: 'assistant', text: 'Fresh start! What would you like help with today?' }])}>New conversation</button></div><div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.from === 'user' ? 'chat-user' : 'chat-assistant'}`} key={`${message.from}-${index}`}><span className="chat-avatar">{message.from === 'user' ? 'AJ' : '✦'}</span><p>{message.text}</p></div>)}</div><div className="assistant-prompts"><span>Try asking</span>{['How can I improve my resume?', 'Find jobs that match my skills', 'Help me prepare for an interview'].map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)}>{prompt} →</button>)}</div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><input aria-label="Message your career assistant" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask me anything about your career..." /><button type="submit" aria-label="Send message" disabled={!draft.trim()}>↑</button></form><small className="assistant-disclaimer">AI can make mistakes. Review suggestions before using them.</small></Card><div className="assistant-sidebar"><Card><div className="section-title"><div><h2>What I can help with</h2><p>Your personal career toolkit.</p></div></div>{[['▤','Resume review','Get targeted feedback and ATS tips','/analysis'],['⌕','Find opportunities','Explore jobs that fit your skills','/jobs'],['◉','Interview practice','Build confidence with mock questions','/mock-interview'],['◈','Skill development','Find and close your skill gaps','/skills']].map(([icon,title,detail,path]) => <button className="assistant-tool" key={title} onClick={() => navigate(path)}><span>{icon}</span><span><b>{title}</b><small>{detail}</small></span><i>›</i></button>)}</Card><Card className="assistant-insight"><span>✦</span><b>Your profile insight</b><p>Your experience with React and TypeScript is in high demand. Add quantified project outcomes to stand out.</p><button className="text-link" onClick={() => navigate('/suggestions')}>See suggestions →</button></Card></div></div>
  </>;
}

function MockInterview({ notify }) {
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState(0);
  const questions = ['Tell me about a project you’re proud of and the impact it had.', 'How do you handle a challenging deadline?', 'What makes you the right person for this role?'];
  return <>
    <PageHeading eyebrow="PRACTICE WITH CONFIDENCE" title="Mock interview" subtitle="Practice a realistic interview and get thoughtful feedback on your answers." action={<Button variant="secondary" onClick={() => notify('Interview settings opened.')}>⚙ Practice settings</Button>} />
    <div className="mock-interview-layout"><div className="mock-interview-main"><Card className="mock-video-card"><div className="mock-video-toolbar"><span>{started ? '● SESSION IN PROGRESS' : 'READY WHEN YOU ARE'}</span><span>Senior Product Designer · Practice interview</span></div><div className="mock-video-stage"><div className="interviewer-avatar">AM</div><span className="interviewer-name">Alex Morgan <small>AI interviewer</small></span><div className="video-controls"><button aria-label="Toggle microphone" onClick={() => notify('Microphone preference updated.')}>♩</button><button aria-label="Toggle camera" onClick={() => notify('Camera preference updated.')}>▣</button><button className={started ? 'end-session' : 'start-session'} onClick={() => { setStarted(!started); if (started) notify('Practice session ended. Your feedback is ready.'); }}>{started ? 'End session' : '▶ Start practice'}</button></div></div><div className="mock-question"><span>QUESTION {question + 1} OF {questions.length}</span><b>{questions[question]}</b><p>{started ? 'Take a moment to organize your thoughts, then share your answer.' : 'Start the session when you’re ready to answer.'}</p></div><label className="field-label">Your answer<textarea rows="4" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your response here, or practice speaking out loud..." /></label><div className="mock-answer-actions"><Button variant="secondary" onClick={() => { setQuestion((current) => (current + 1) % questions.length); setAnswer(''); }}>Skip question</Button><Button onClick={() => { if (!answer.trim()) { notify('Write a short answer before requesting feedback.'); return; } notify('Your answer was saved. AI feedback is ready.'); setQuestion((current) => (current + 1) % questions.length); setAnswer(''); }}>Submit answer →</Button></div></Card></div><div className="mock-feedback-column"><Card><div className="section-title"><div><h2>Interview readiness</h2><p>Your practice session overview.</p></div></div><div className="mock-score-ring"><ProgressRing score={88} label="Readiness" /></div><div className="mock-feedback-list"><b>AI feedback</b><p>Speak clearly about your individual contribution and include a measurable result where possible.</p><span>✓ Clear communication</span><span>↗ Add a specific outcome</span><span>✦ Try the STAR method</span></div></Card><Card className="mock-tip-card"><b>✦ Practice tip</b><p>Use the STAR method to structure a clear answer: Situation, Task, Action, and Result.</p></Card></div></div>
  </>;
}

function Profile({ notify }) {
  return <>
    <PageHeading eyebrow="ACCOUNT" title="Profile & settings" subtitle="Manage your personal information, career goals, and preferences." />
    <div className="profile-tabs"><button className="active">Profile</button><button onClick={()=>notify('Account settings are available in the Settings page.')}>Account</button><button onClick={()=>notify('Notification preferences saved.')}>Notifications</button><button onClick={()=>notify('Privacy settings opened.')}>Privacy</button></div>
    <div className="profile-layout"><Card className="profile-card"><div className="section-title"><div><h2>Personal information</h2><p>Update the details associated with your account.</p></div></div><div className="profile-avatar-row"><div className="avatar avatar-large">AJ</div><div><b>Profile photo</b><span>JPG or PNG, max 2 MB</span></div><Button variant="secondary" onClick={()=>notify('Choose a profile photo from your device.')}>Change photo</Button></div><div className="builder-fields"><label className="field-label">Full name<input defaultValue="Alex Johnson" /></label><label className="field-label">Email address<input defaultValue="alex.johnson@email.com" /></label><label className="field-label">Phone number<input defaultValue="+1 (555) 238-4600" /></label><label className="field-label">Location<input defaultValue="San Francisco, CA" /></label><label className="field-label">Current job title<input defaultValue="Senior Product Designer" /></label><label className="field-label">Years of experience<select defaultValue="5–8 years"><option>0–2 years</option><option>3–4 years</option><option>5–8 years</option><option>9+ years</option></select></label></div><div className="profile-save"><Button onClick={()=>notify('Your profile has been saved.')}>Save changes</Button></div></Card><div className="profile-side"><Card><div className="section-title"><div><h2>Skills</h2><p>Help us personalize your suggestions.</p></div><button className="text-link" onClick={()=>notify('Add a skill to your profile.')}>＋ Add</button></div><KeywordTags values={['Product design','Figma','User research','Prototyping','Design systems','+ Add skill']} /></Card><Card><div className="section-title"><div><h2>Career preferences</h2><p>What are you looking for?</p></div></div><label className="field-label">Preferred role<input defaultValue="Product Designer" /></label><label className="field-label">Preferred work style<select defaultValue="Hybrid"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label><label className="field-label">Job search status<select defaultValue="Actively looking"><option>Actively looking</option><option>Open to offers</option><option>Not looking</option></select></label></Card></div></div>
  </>;
}

function Settings({ notify }) {
  return <>
    <PageHeading eyebrow="ACCOUNT" title="Settings" subtitle="Choose how CV Insights works for you." />
    <div className="settings-layout"><Card><div className="section-title"><div><h2>Preferences</h2><p>Customize your workspace experience.</p></div></div><SettingRow title="Email notifications" detail="Get updates about your analysis and career activity." defaultChecked /><SettingRow title="Weekly career digest" detail="A weekly summary of your career progress and suggestions." defaultChecked /><SettingRow title="Product updates" detail="Hear about new features and improvements." /><SettingRow title="Keep resume history" detail="Save your previous resume analyses to your account." defaultChecked /><div className="profile-save"><Button onClick={()=>notify('Settings saved successfully.')}>Save preferences</Button></div></Card><Card><div className="section-title"><div><h2>Account security</h2><p>Manage your sign-in and account details.</p></div></div><div className="security-row"><span className="security-icon">♙</span><div><b>Password</b><span>Last updated 3 months ago</span></div><button onClick={()=>notify('Password reset link sent to your email.')}>Change password →</button></div><div className="security-row"><span className="security-icon">✉</span><div><b>Email address</b><span>alex.johnson@email.com · Verified</span></div><span className="verified">✓ Verified</span></div><div className="danger-zone"><b>Delete account</b><p>Permanently remove your account and all associated data.</p><Button variant="danger" onClick={()=>notify('Contact support to permanently delete your account.')}>Delete account</Button></div></Card></div>
  </>;
}
function SettingRow({ title, detail, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <div className="setting-row"><div><b>{title}</b><span>{detail}</span></div><button role="switch" aria-checked={checked} className={`switch ${checked?'on':''}`} onClick={()=>setChecked(!checked)}><i/></button></div>;
}

function ProfileSetup({ navigate, notify }) {
  return <><PageHeading eyebrow="GETTING STARTED · 2 OF 3" title="Let’s personalize your experience" subtitle="Tell us a little about your goals so we can make your recommendations more relevant." /><Card className="setup-card"><div className="builder-fields"><label className="field-label">What role are you looking for?<input placeholder="e.g. Product Designer" /></label><label className="field-label">Experience level<select defaultValue=""><option value="" disabled>Select your experience</option><option>Entry level</option><option>Mid level</option><option>Senior</option></select></label><label className="field-label field-full">Which skills do you want to highlight?<input placeholder="Add skills separated by commas" /></label></div><div className="builder-footer"><Button variant="secondary" onClick={()=>navigate('/dashboard')}>Skip for now</Button><Button onClick={()=>{notify('Your profile is ready.');navigate('/dashboard');}}>Continue →</Button></div></Card></>;
}

function SplashPage({ navigate }) {
  useEffect(() => {
    const timeout = window.setTimeout(() => navigate('/home'), 2600);
    return () => window.clearTimeout(timeout);
  }, [navigate]);

  return <div className="auth-shell reference-splash-shell"><section className="reference-splash">
    <div className="reference-splash-brand">
      <svg className="reference-brand-mark" viewBox="0 0 92 82" role="img" aria-label="CV Insights logo">
        <path d="M13 29 46 12l33 17-33 17z" fill="#183b7a" />
        <path d="M22 33v34c0 4 3 7 7 7h35c4 0 7-3 7-7V33" fill="#fff" stroke="#183b7a" strokeWidth="5" />
        <path d="M38 44h17M38 54h13M38 64h9" stroke="#2673df" strokeWidth="4" strokeLinecap="round" />
        <path d="M69 47v24M77 40v31" stroke="#24b98b" strokeWidth="5" strokeLinecap="round" />
        <path d="M37 17 46 7l10 11" fill="none" stroke="#183b7a" strokeWidth="4" strokeLinejoin="round" />
      </svg>
      <strong>CVInsights</strong>
      <span>Build <i /> Analyze <i /> Grow</span>
    </div>
    <div className="reference-splash-copy"><h1>Your AI-Powered<br />Career Companion</h1><p>Build your future with confidence.</p></div>
    <div className="splash-loading" role="status"><span>Preparing your career workspace…</span><i /></div>
    <button className="splash-skip" onClick={() => navigate('/home')}>Continue now →</button>
  </section></div>;
}

function LandingPage({ navigate }) {
  const features = [
    ['▤', 'AI Resume Analyzer', 'Get detailed feedback and improve every part of your resume.', 'blue'],
    ['✓', 'ATS Compatibility', 'See how your resume performs with applicant tracking systems.', 'green'],
    ['⌕', 'Job Description Match', 'Find your best fit and identify skills to highlight.', 'purple'],
    ['▧', 'Resume Builder', 'Create a polished, ATS-friendly resume from scratch.', 'blue'],
    ['◉', 'Interview Preparation', 'Practice role-specific questions and answer with confidence.', 'orange'],
    ['◈', 'Skill Gap Analyzer', 'Discover skills to strengthen for your next career step.', 'green'],
    ['↗', 'Job Recommendations', 'Explore relevant roles picked for your profile.', 'orange'],
    ['▦', 'Application Tracker', 'Keep every opportunity organized in one workspace.', 'purple'],
  ];
  const steps = [
    ['01', 'Upload or build your resume', 'Start with the resume you already have, or create a new one.'],
    ['02', 'Get your AI analysis', 'See your ATS score, strengths, and personalized suggestions.'],
    ['03', 'Match & prepare', 'Find relevant roles and practice for upcoming interviews.'],
    ['04', 'Grow your career', 'Track applications and keep moving toward your goals.'],
  ];
  const audiences = [
    ['🎓', 'Students', 'Build a strong first resume and get internship-ready.'],
    ['⌕', 'Job seekers', 'Find better-fit roles and make your next move count.'],
    ['✦', 'Professionals', 'Showcase your impact and plan your career growth.'],
    ['↗', 'Career changers', 'Connect transferable skills to a new direction.'],
  ];

  return <div className="landing-page">
    <header className="landing-header">
      <a className="landing-brand" href="#home" aria-label="CV Insights home">
        <span className="landing-brand-mark">CV</span><span>CVInsights<small>Build · Analyse · Grow</small></span>
      </a>
      <nav className="landing-nav" aria-label="Landing page navigation">
        <a href="#home">Home</a><a href="#features">Features</a><a href="#how-it-works">How It Works</a><a href="#testimonials">Testimonials</a><a href="#faqs">FAQs</a>
      </nav>
      <div className="landing-header-actions"><button className="landing-signin" onClick={() => navigate('/login')}>Sign in</button><Button onClick={() => navigate('/signup')}>Get Started →</Button></div>
    </header>

    <main>
      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <span className="landing-eyebrow">AI-POWERED · STUDENT-FRIENDLY · CAREER-ORIENTED</span>
          <h1>Turn your resume<br />into <span>real opportunities.</span></h1>
          <h2>Analyse. Improve. Match. Prepare. Grow.</h2>
          <p>CVInsights is your all-in-one AI career companion that helps you build better resumes, discover job-ready roles, prepare for interviews, and track your career progress—all in one place.</p>
          <div className="landing-hero-actions"><Button onClick={() => navigate('/signup')}>Get started free →</Button><a href="#features" className="landing-demo-link"><span>▶</span> Watch demo</a></div>
          <div className="landing-proof"><span>▤ <b>10K+</b><small>Resumes analysed</small></span><span>◈ <b>85%</b><small>Average improvement</small></span><span>✦ <b>5,000+</b><small>Students trust us</small></span></div>
        </div>
        <div className="landing-hero-art" aria-label="Preview of the CVInsights resume dashboard">
          <div className="hero-orbit" />
          <div className="hero-resume-window"><div className="hero-window-top"><span>▦ &nbsp;Overview</span><span>•••</span></div><div className="hero-resume-content"><span className="hero-resume-eyebrow">RESUME SCORE</span><div className="hero-resume-score"><b>78<span>%</span></b><small>Good match</small></div><div className="hero-resume-lines"><i /><i /><i /></div><strong>GOOD MATCH</strong><div className="hero-skill-lines"><span>React <i /></span><span>Problem solving <i /></span><span>SQL / Data <i /></span><span>Web Development <i /></span></div></div></div>
          <div className="hero-float-card hero-ai-card"><span>✦</span><div><b>AI Suggestions</b><small>Improve your resume with personalized feedback.</small></div></div>
          <div className="hero-float-card hero-job-card"><span>72%</span><div><b>Job Match</b><small>Take the next career step.</small></div></div>
          <div className="hero-float-card hero-interview-card"><span>◉</span><div><b>Interview Prep</b><small>Practice with AI questions.</small></div></div>
        </div>
      </section>

      <section className="landing-section landing-about" id="about">
        <div className="landing-section-copy"><span className="landing-eyebrow">ABOUT CVINSIGHTS</span><h2>What is <span>CVInsights?</span></h2><p>CVInsights is an AI-powered career platform designed to help students and job seekers build strong resumes, analyse them using AI, match them with job opportunities, and prepare for interviews with personalised guidance.</p><div className="landing-benefit-grid">{[['◉','Smart analysis'],['✦','Career guidance'],['◈','Skill development'],['▣','Interview preparation']].map(([icon,title])=><div key={title}><span>{icon}</span><b>{title}</b></div>)}</div></div>
        <div className="landing-about-visual"><span>YOUR CAREER, IN FOCUS</span><div className="about-mini-dashboard"><b>Resume Score</b><div className="about-score">78<small>%</small></div><span>↑ Your profile is improving</span><i /><i /><i /></div></div>
      </section>

      <section className="landing-section landing-features-section" id="features">
        <div className="landing-section-heading"><span className="landing-eyebrow">OUR FEATURES</span><h2>Everything you need<br />for a <span>successful career</span></h2><p>Smart tools to take you from the first draft to your next opportunity.</p></div>
        <div className="landing-feature-grid">{features.map(([icon,title,detail,color])=><article className="landing-feature-card" key={title}><span className={`landing-feature-icon ${color}`}>{icon}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </section>

      <section className="landing-section landing-how-section" id="how-it-works">
        <div className="landing-section-heading"><span className="landing-eyebrow">HOW IT WORKS</span><h2>Get started in <span>4 simple steps</span></h2><p>A clear path to your next career opportunity.</p></div>
        <div className="landing-step-grid">{steps.map(([number,title,detail],index)=><article className="landing-step-card" key={number}><span className={`landing-step-number step-${index+1}`}>{number}</span><span className={`landing-step-icon step-${index+1}`}>{['↑','⌕','◎','↗'][index]}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </section>

      <section className="landing-stats-section"><span className="landing-eyebrow">WHY CHOOSE CVINSIGHTS</span><h2>More than just a <span>resume tool</span></h2><p>Everything you need to move forward, all in one place.</p><div className="landing-stats-grid">{[['▤','10K+','Resumes analysed'],['◉','85%','Average score increase'],['♙','5,000+','Happy students'],['✓','98%','Positive feedback']].map(([icon,value,label])=><div key={label}><span>{icon}</span><b>{value}</b><small>{label}</small></div>)}</div></section>

      <section className="landing-section landing-audience-section">
        <div className="landing-section-heading"><span className="landing-eyebrow">WHO IS CVINSIGHTS FOR?</span><h2>Built for every <span>career stage</span></h2><p>Wherever you are in your journey, there's a next step.</p></div>
        <div className="landing-audience-grid">{audiences.map(([icon,title,detail],index)=><article className={`landing-audience-card audience-${index+1}`} key={title}><span>{icon}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </section>

      <section className="landing-testimonials" id="testimonials"><span className="landing-eyebrow">REAL CAREER PROGRESS</span><h2>Confidence for your next step</h2><div className="landing-quote-card"><span>“</span><blockquote>CVInsights helped me understand what recruiters were looking for and turn my experience into a much stronger resume.</blockquote><b>Jordan Lee</b><small>Early-career professional</small></div></section>

      <section className="landing-faq-section" id="faqs"><div className="landing-section-heading"><span className="landing-eyebrow">FREQUENTLY ASKED QUESTIONS</span><h2>Good questions.<br /><span>Clear answers.</span></h2></div><div className="landing-faq-list"><details><summary>Is CVInsights free to use?</summary><p>You can get started for free and explore the core resume and career tools. Some advanced features may require an upgraded plan.</p></details><details><summary>How does the AI resume analysis work?</summary><p>The analyzer reviews resume content, structure, and relevant skills to provide a score and practical suggestions you can review.</p></details><details><summary>Can I use CVInsights if I’m still a student?</summary><p>Yes. CVInsights is designed for students, new graduates, experienced professionals, and people changing careers.</p></details><details><summary>Does CVInsights apply for jobs on my behalf?</summary><p>No. It helps you discover opportunities and organize your applications, while you remain in control of where and when you apply.</p></details></div></section>

      <section className="landing-cta"><span className="landing-eyebrow">READY TO TRANSFORM YOUR CAREER?</span><h2>Start your journey with<br /><span>CVInsights today.</span></h2><p>Join students and professionals building better careers with AI.</p><Button onClick={() => navigate('/signup')}>Get started for free →</Button><div className="landing-cta-perks"><span>✓ No credit card required</span><span>✓ Free resume analysis</span><span>✓ Access to basic features</span></div></section>
    </main>
    <footer className="landing-footer"><a className="landing-brand" href="#home"><span className="landing-brand-mark">CV</span><span>CVInsights<small>Build · Analyse · Grow</small></span></a><span>© 2026 CVInsights. Your next opportunity starts here.</span><a href="#faqs">Help &amp; FAQs</a></footer>
  </div>;
}

function AuthPage({ page, navigate, notify }) {
  const isSplash = page === 'splash' || page === 'intro';
  const isSignup = page === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event) => {
    event.preventDefault();
    if (isSignup && name.trim().length < 2) return notify('Please enter your full name.');
    if (!email.includes('@')) return notify('Enter a valid email address to continue.');
    if (password.length < 6) return notify('Your password must be at least 6 characters.');
    navigate(isSignup ? '/profile-setup' : '/dashboard');
  };
  if (isSplash) return <SplashPage navigate={navigate} />;
  return <div className="auth-shell"><div className="auth-background-orb orb-left"/><div className="auth-background-orb orb-right"/><div className="auth-brand"><a className="brand" href="/" onClick={(event)=>{event.preventDefault();navigate('/');}}><span className="brand-mark">CV</span><span className="brand-copy"><b>CV INSIGHTS</b><small>Your AI career copilot</small></span></a></div><div className="auth-layout"><section className="auth-promo"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h1>{isSignup?'Build a career that feels like you.':'Welcome back! 👋'}</h1><p>Sign in to continue your career journey with smart tools built to make your next move count.</p><div className="auth-feature-list"><span><i>✦</i><b>AI resume analysis</b><small>Know exactly what recruiters see.</small></span><span><i>⌕</i><b>Smart job matching</b><small>Find roles that fit your strengths.</small></span><span><i>▣</i><b>Interview preparation</b><small>Show up confident and ready.</small></span></div><div className="auth-quote"><span>“</span><p>Better resumes.<br/>Brighter opportunities.</p></div></section><section className="auth-card"><div className="auth-card-mark">CV</div><h2>{isSignup?'Create your account':'Sign in to your account'}</h2><p>{isSignup?'Start building your next opportunity.':'Pick up right where you left off.'}</p><form onSubmit={submit} className="auth-form">{isSignup&&<label className="field-label">Full name<div className="auth-input"><span>♙</span><input placeholder="Alex Johnson" value={name} onChange={(event)=>setName(event.target.value)} required /></div></label>}<label className="field-label">Email address<div className="auth-input"><span>✉</span><input type="email" placeholder="you@example.com" value={email} onChange={(event)=>setEmail(event.target.value)} required /></div></label><label className="field-label">Password<div className="auth-input"><span>♙</span><input type={showPassword?'text':'password'} placeholder="••••••••" value={password} onChange={(event)=>setPassword(event.target.value)} required /><button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPassword(!showPassword)}>{showPassword?'◉':'◎'}</button></div></label>{isSignup?<label className="auth-terms"><input type="checkbox" required /> I agree to the <a href="#" onClick={(event)=>event.preventDefault()}>Terms &amp; Conditions</a></label>:<div className="auth-options"><label><input type="checkbox" /> Remember me</label><button type="button" onClick={()=>notify('Password reset instructions will be sent to your email.')}>Forgot password?</button></div>}<Button type="submit">{isSignup?'Create account':'Sign in'} <span>→</span></Button></form><div className="or-divider"><span/>or<span/></div><Button variant="google" onClick={()=>notify('Google sign-in will be available soon.')}>◉ &nbsp; Continue with Google</Button><div className="auth-switch">{isSignup?'Already have an account?':'Don’t have an account?'} <button onClick={()=>navigate(isSignup?'/login':'/signup')}>{isSignup?'Sign in':'Sign up'}</button></div></section></div><div className="auth-footer">© 2026 CV Insights <span>Privacy</span><span>Terms</span></div></div>;
}

export default App;
