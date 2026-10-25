import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiDownload, apiRequest, clearAuthToken, getAuthToken, saveAuthToken } from './api.js';
import ResumeBuilderPage from './components/ResumeBuilderPage.jsx';
import ResumeImprovementPage from './components/ResumeImprovementPage.jsx';

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
const userInitials = (name = '') => name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'GU';
const firstName = (name = '') => name.trim().split(/\s+/).filter(Boolean)[0] || 'there';
function practiceFeedback(answer) {
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 15) {
    return 'Try adding more detail: describe the situation, what you did, and the result.';
  }
  if (/\d|%|\b(increased|reduced|improved|delivered|result)\b/i.test(answer)) {
    return 'Your answer includes a concrete outcome. Make sure to explain your individual contribution clearly.';
  }
  return 'Your answer has a useful level of detail. Add a specific result or example to make the impact clearer.';
}
function useSavedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = window.localStorage.getItem(key);
    if (!saved) return initialValue;
    try {
      return JSON.parse(saved);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      console.error(`Could not read saved ${key}; resetting it.`, error);
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
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
  const searchInputRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [applications, setApplications] = useSavedState('cv-insights-applications', []);
  const searchMatches = search.trim()
    ? [
      ...pages.filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => ({ label: item.label, path: item.path })),
      ...resumes.filter((item) => item.originalName.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => ({ label: item.originalName, resume: item })),
    ].slice(0, 6)
    : [];

  useEffect(() => {
    if (!getAuthToken()) {
      setCurrentUser(null);
      return;
    }
    apiRequest('/auth/me').then(({ user }) => {
      setCurrentUser(user);
    }).catch((error) => setNotice(error.message));
    apiRequest('/resumes').then(({ resumes: items }) => {
      setResumes(items);
      setAnalysisResult((current) => current || items[0] || null);
    }).catch((error) => setNotice(error.message));
  }, [path]);

  useEffect(() => {
    const handlePopState = () => setPath(initialPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const navigate = useCallback((nextPath) => {
    if (!nextPath) return;
    const destination = nextPath.startsWith('/app') ? nextPath : `/app${nextPath === '/' ? '' : nextPath}`;
    window.history.pushState({}, '', destination);
    setPath(destination);
    window.scrollTo(0, 0);
  }, []);
  const trackApplication = (job) => {
    if (applications.some((item) => item.role === job.role && item.company === job.company)) {
      setNotice(`${job.role} at ${job.company} is already in your tracker.`);
      return;
    }
    setApplications((current) => [{ ...job, id: crypto.randomUUID(), date: new Date().toLocaleDateString(), status: 'Saved' }, ...current]);
    notifyIfNewApplication(job);
  };
  const notifyIfNewApplication = (job) => setNotice(`${job.role} at ${job.company} added to your application tracker.`);
  const openSearchMatch = (match) => {
    if (match.resume) {
      setAnalysisResult(match.resume);
      navigate('/analysis');
    } else {
      navigate(match.path);
    }
    setSearch('');
  };
  const downloadResume = async (resume) => {
    try {
      await apiDownload(`/resumes/${resume.id}/file`, resume.originalName);
    } catch (error) {
      setNotice(error.message);
    }
  };
  const deleteResume = async (resume) => {
    if (!window.confirm(`Delete ${resume.originalName} from your resume history?`)) return;
    try {
      await apiRequest(`/resumes/${resume.id}`, { method: 'DELETE' });
      setResumes((current) => current.filter((item) => item.id !== resume.id));
      setAnalysisResult((current) => current?.id === resume.id ? null : current);
      setNotice('Resume deleted.');
    } catch (error) {
      setNotice(error.message);
    }
  };
  const logout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setResumes([]);
    setAnalysisResult(null);
    setNotice('');
    navigate('/login');
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

  if (!getAuthToken()) {
    return (
      <>
        <AuthPage page="login" navigate={navigate} notify={setNotice} />
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
            <span className="avatar avatar-small">{userInitials(currentUser?.name)}</span>
            <span><b>{currentUser?.name || 'Your account'}</b><small>{currentUser ? 'Free plan' : 'Loading account...'}</small></span>
            <span className="user-menu">•••</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <div className="global-search-wrap">
              <label className="global-search"><span>⌕</span><input ref={searchInputRef} value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && searchMatches[0]) openSearchMatch(searchMatches[0]); if (event.key === 'Escape') setSearch(''); }} placeholder="Search pages and resumes..." aria-label="Search pages and resumes" aria-expanded={searchMatches.length > 0} /><kbd>⌘ K</kbd></label>
              {searchMatches.length > 0 && <div className="global-search-results" role="listbox">{searchMatches.map((match) => <button key={match.path || match.label} role="option" aria-selected="false" onClick={() => openSearchMatch(match)}>{match.label}<span>{match.resume ? 'Resume' : 'Page'}</span></button>)}</div>}
            </div>
            <button className="icon-button" aria-label="Notifications" onClick={() => setNotice('You’re all caught up!')}>♧<i /></button>
            <button className="top-user" onClick={() => navigate('/profile')}><span className="avatar avatar-small">{userInitials(currentUser?.name)}</span><span>{currentUser ? firstName(currentUser.name) : 'Account'}</span><span className="chevron">⌄</span></button>
            <button className="logout-button" onClick={logout}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M10 17l5-5-5-5M15 12H3m9-7h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6" />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </header>
        <div className="page-content">
          {page === 'dashboard' && <Dashboard navigate={navigate} resumes={resumes} applications={applications} user={currentUser} />}
          {page === 'upload' && <Upload navigate={navigate} notify={setNotice} onAnalysis={(item) => { setAnalysisResult(item); setResumes((current) => [item, ...current.filter((resume) => resume.id !== item.id)]); }} resumes={resumes} onOpen={(item) => { setAnalysisResult(item); navigate('/analysis'); }} />}
          {page === 'analysis' && <Analysis navigate={navigate} notify={setNotice} result={analysisResult} />}
          {page === 'ats-check' && <ATSCheck navigate={navigate} notify={setNotice} result={analysisResult || resumes[0]} />}
          {page === 'improve' && <ResumeImprovementPage notify={setNotice} navigate={navigate} />}
          {page === 'job-match' && <JobMatch notify={setNotice} resumes={resumes} onTrackApplication={trackApplication} />}
          {page === 'suggestions' && <Suggestions navigate={navigate} />}
          {page === 'templates' && <Templates notify={setNotice} navigate={navigate} />}
          {page === 'builder' && <ResumeBuilderPage notify={setNotice} user={currentUser} />}
          {page === 'interview' && <Interview notify={setNotice} />}
          {page === 'history' && <History navigate={navigate} resumes={resumes} onOpen={(item) => { setAnalysisResult(item); navigate('/analysis'); }} onDownload={downloadResume} onDelete={deleteResume} />}
          {page === 'skills' && <SkillGap navigate={navigate} notify={setNotice} />}
          {page === 'jobs' && <JobRecommendations notify={setNotice} onTrackApplication={trackApplication} />}
          {page === 'applications' && <ApplicationTracker notify={setNotice} applications={applications} setApplications={setApplications} />}
          {page === 'mock-interview' && <MockInterview notify={setNotice} />}
          {page === 'assistant' && <CareerAssistant navigate={navigate} notify={setNotice} user={currentUser} />}
          {page === 'profile' && <Profile notify={setNotice} user={currentUser} />}
          {page === 'settings' && <Settings notify={setNotice} user={currentUser} />}
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
function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  return <button type={type} className={`button ${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
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

function Dashboard({ navigate, resumes, applications = [], user }) {
  const latestResume = resumes[0];
  const latestAnalysis = latestResume?.analysis;
  const matchedKeywordCount = latestAnalysis?.matchedKeywords?.length || 0;
  const averageScore = resumes.length
    ? Math.round(resumes.reduce((sum, item) => sum + (item.analysis?.score || 0), 0) / resumes.length)
    : null;

  return <>
    <PageHeading
      eyebrow="YOUR CAREER, IN FOCUS"
      title={<>Make your next move<br />your best one yet.</>}
      subtitle={`Welcome back, ${firstName(user?.name)}. Your progress is ready when you are.`}
      action={<Button onClick={() => navigate('/upload')}>Analyze resume</Button>}
    />

    <div className="stats-grid">
      <StatCard icon="CV" label="Resumes analyzed" value={resumes.length} change="Saved to your history" color="purple" />
      <StatCard icon="ATS" label="Average ATS score" value={averageScore === null ? '—' : `${averageScore}%`} change={averageScore === null ? 'Analyze your first resume' : 'Across your analyses'} color="blue" />
      <StatCard icon="KEY" label="Keywords matched" value={latestAnalysis ? matchedKeywordCount : '—'} change={latestAnalysis ? 'On your latest resume' : 'Add a job description'} color="green" />
      <StatCard icon="JOB" label="Applications tracked" value={applications.length} change="Saved opportunities" color="orange" />
    </div>

    <div className="dashboard-focus-grid">
      <Card className="dashboard-latest-card">
        <div className="section-title">
          <div>
            <h2>Latest resume analysis</h2>
            <p>{latestResume?.originalName || 'Your resume insights will appear here.'}</p>
          </div>
          {latestResume && <button className="text-link" onClick={() => navigate('/analysis')}>Open analysis &gt;</button>}
        </div>
        {latestAnalysis ? (
          <div className="dashboard-score-panel">
            <ProgressRing score={latestAnalysis.score || 0} label="ATS score" />
            <div className="dashboard-score-copy">
              <span className="dashboard-status">{latestAnalysis.score >= 75 ? 'GOOD FOUNDATION' : 'ROOM TO GROW'}</span>
              <h3>{latestAnalysis.score >= 75 ? 'You are building a strong match.' : 'A few focused edits can help.'}</h3>
              <p>{matchedKeywordCount} role keywords matched. Review your missing skills and include only the ones that reflect your experience.</p>
              <Button variant="secondary" onClick={() => navigate('/analysis')}>View insights</Button>
            </div>
          </div>
        ) : (
          <div className="dashboard-empty-analysis">
            <span className="dashboard-empty-icon">CV</span>
            <div><b>Start with one resume</b><p>Compare your experience with a job description to get an ATS score and keyword insights.</p></div>
            <Button variant="secondary" onClick={() => navigate('/upload')}>Analyze a resume</Button>
          </div>
        )}
      </Card>

      <Card className="dashboard-next-steps">
        <div className="section-title"><div><h2>Your next best steps</h2><p>Small updates, stronger applications.</p></div></div>
        <button className="dashboard-step" onClick={() => navigate('/upload')}>
          <span className="dashboard-step-number violet">01</span>
          <span><b>Check a role match</b><small>Compare your resume with a job description.</small></span>
          <span className="dashboard-step-arrow">&gt;</span>
        </button>
        <button className="dashboard-step" onClick={() => navigate('/improve')}>
          <span className="dashboard-step-number cyan">02</span>
          <span><b>Strengthen a bullet</b><small>Show your impact with a clear result.</small></span>
          <span className="dashboard-step-arrow">&gt;</span>
        </button>
        <button className="dashboard-step" onClick={() => navigate('/templates')}>
          <span className="dashboard-step-number blue">03</span>
          <span><b>Choose a polished template</b><small>Give your experience a confident finish.</small></span>
          <span className="dashboard-step-arrow">&gt;</span>
        </button>
      </Card>
    </div>

    <Card className="activity-card dashboard-recent-activity">
      <div className="section-title"><div><h2>Recent activity</h2><p>Your latest career moves.</p></div><button className="text-link" onClick={() => navigate('/history')}>View history &gt;</button></div>
      <ActivityList resumes={resumes} />
    </Card>
  </>;
}function QuickAction({ icon, color, label, onClick }) {
  return <button className="quick-action" onClick={onClick}><span className={`quick-icon ${color}`}>{icon}</span><b>{label}</b><span className="arrow">↗</span></button>;
}
function ActivityList({ resumes = [] }) {
  const items = resumes.slice(0, 5).map((item) => ['PDF', item.originalName, new Date(item.createdAt).toLocaleDateString(), `${item.analysis?.score || 0}%`, 'pdf']);
  if (!items.length) return <p className="empty-results">No resumes analyzed yet.</p>;
  return <div className="activity-list">{items.map(([type, name, date, score, color]) => <div className="activity-row" key={name}><span className={`file-icon ${color}`}>{type}</span><div className="activity-name"><b>{name}</b><span>{date}</span></div><span className={`score-pill ${score === '74%' ? 'warning' : ''}`}>{score}</span><button className="more-button">•••</button></div>)}</div>;
}

function Dropzone({ onFile, uploading, notify }) {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const chooseFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type !== 'application/pdf')) {
      setFileName('');
      setSelectedFile(null);
      notify('Choose a PDF file to continue.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileName('');
      setSelectedFile(null);
      notify('The PDF must be 10 MB or smaller.');
      return;
    }
    setFileName(file.name);
    setSelectedFile(file);
    return file;
    return file;
  };
  return <div className="dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }}>
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(event) => chooseFile(event.target.files[0])} />
    <span className="upload-cloud">↑</span><b>{fileName || 'Drag & drop your resume here'}</b><span>or click below to browse files</span>
    <Button disabled={uploading} onClick={() => {
      if (!fileName) {
        inputRef.current?.click();
        return;
      }
      if (selectedFile) onFile(selectedFile);
    }}>{uploading ? 'Uploading and analyzing…' : fileName ? 'Analyze resume →' : 'Choose PDF'}</Button>
    <small>PDF only · Max file size: 10 MB</small>
  </div>;
}

function Upload({ navigate, notify, onAnalysis, resumes, onOpen }) {
  const [jobDescription, setJobDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadResume = async (file) => {
    if (!jobDescription.trim()) {
      notify('Paste the job description to compare your resume against.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const response = await apiRequest('/resumes/upload', {
        method: 'POST',
        body: formData,
      });
      onAnalysis(response.resume);
      navigate('/analysis');
    } catch (error) {
      notify(error.message);
    } finally {
      setUploading(false);
    }
  };

  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Upload your resume" subtitle="Get an instant ATS analysis, keyword match, and AI-powered suggestions." />
    <div className="upload-layout">
      <Card className="upload-main-card"><div className="section-title"><div><h2>Start with your resume</h2><p>Upload a file to see how it performs with applicant tracking systems.</p></div><span className="secure-note">♢ Secure &amp; private</span></div>
        <label className="field-label upload-job-description">Job description<textarea rows="6" maxLength="30000" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste the job description here. We’ll compare its skills and keywords with your resume." /></label>
        <Dropzone onFile={uploadResume} uploading={uploading} notify={notify} />
        <div className="supported-files"><span>✓ Text-based PDF</span><span>✓ Private to your account</span><span>✓ Up to 10 MB</span></div>
      </Card>
      <Card className="why-card"><span className="why-icon">✧</span><h2>Why analyze your resume?</h2><p>Make sure your experience gets noticed by both recruiters and applicant tracking systems.</p><div className="benefit-list"><span><i>✓</i><b>Get your ATS score</b><small>See how your resume ranks</small></span><span><i>✓</i><b>Find missing keywords</b><small>Match skills to your next role</small></span><span><i>✓</i><b>Receive AI suggestions</b><small>Improve impact and clarity</small></span><span><i>✓</i><b>Track your progress</b><small>Keep every version organized</small></span></div></Card>
    </div>
    <div className="upload-footnote">🔒 Your resume is encrypted and private. We never share your data.</div>
    <div className="upload-recent"><div className="section-title"><div><h2>Recently analyzed</h2><p>Open a previous result whenever you need it.</p></div><button className="text-link" onClick={() => navigate("/history")}>View history</button></div>{resumes?.length ? resumes.slice(0, 5).map((item) => <button className="activity-row" key={item.id} onClick={() => onOpen(item)}><span className="file-icon pdf">PDF</span><span className="activity-name"><b>{item.originalName}</b><span>{new Date(item.createdAt).toLocaleString()}</span></span><span className="score-pill">{item.analysis?.score || 0}%</span></button>) : <p>No resumes saved yet.</p>}</div>
  </>;
}

function Analysis({ navigate, result }) {
  if (result?.analysis) {
    const { analysis } = result;
    return <>
      <PageHeading eyebrow="RESUME TOOLS / KEYWORD ANALYSIS" title="Resume analysis" subtitle={`${result.originalName} · Saved to your account`} action={<Button variant="secondary" onClick={() => navigate('/upload')}>Analyze another resume</Button>} />
      <Card className="analysis-banner">
        <div className="banner-score"><ProgressRing score={analysis.score} label="Keyword match" /></div>
        <div className="banner-copy"><span className="status-label">RESUME / JOB MATCH</span><h2>{analysis.score}% keyword match</h2><p>Matched {analysis.matchedKeywords.length} of {analysis.jobKeywords.length} keywords found in the job description.</p><div className="banner-pills"><span>{analysis.matchedKeywords.length} matched</span><span>{analysis.missingKeywords.length} to consider</span><span>Text-based analysis</span></div></div>
      </Card>
      <PriorityKeywords analysis={analysis} />
      <div className="keyword-columns">
        <Card><div className="section-title"><div><h2>Keywords found in your resume</h2><p>Skills and terms extracted from the uploaded PDF.</p></div></div><KeywordTags values={analysis.resumeKeywords} /></Card>
        <Card><div className="section-title"><div><h2>Matched job keywords</h2><p>These terms appear in both your resume and the job description.</p></div></div><KeywordTags values={analysis.matchedKeywords} /></Card>
        <Card><div className="section-title"><div><h2>Keywords to consider</h2><p>Only add them if they honestly reflect your experience.</p></div></div><KeywordTags warning values={analysis.missingKeywords} /></Card>
      </div>
      <Card className="analysis-explanation"><b>How this score is calculated</b><p>Coverage is weighted by job importance: explicitly required terms count 4 points, recognized skills count 2 points, and other repeated terms count 1 point. The score is the matched points divided by all job keyword points. It is a text-based estimate, not a prediction from an ATS vendor or a guarantee of interview results.</p></Card>
    </>;
  }

  return <Card className="empty-state"><h2>No resume analysis selected</h2><p>Upload a resume with a job description to create an analysis, or choose one from your history.</p><div className="button-row"><Button onClick={() => navigate('/upload')}>Upload a resume</Button><Button variant="secondary" onClick={() => navigate('/history')}>Open history</Button></div></Card>;
}

function ATSCheck({ navigate, result }) {
  if (!result?.analysis) {
    return <Card className="empty-state"><h2>No resume to check yet</h2><p>Upload and analyze a resume first. This page will show the real keyword results from that analysis.</p><Button onClick={() => navigate('/upload')}>Upload a resume</Button></Card>;
  }
  const { analysis } = result;
  const checks = [
    ['✓', 'PDF uploaded', result.originalName, 'Passed'],
    ['✓', 'Resume text extracted', `${analysis.resumeKeywords.length} terms found`, analysis.resumeKeywords.length ? 'Passed' : 'Needs review'],
    ['✓', 'Job description compared', `${analysis.jobKeywords.length} terms found`, analysis.jobKeywords.length ? 'Passed' : 'Needs review'],
    ['✓', 'Terms matched', `${analysis.matchedKeywords.length} matching terms`, analysis.matchedKeywords.length ? 'Passed' : 'Needs review'],
  ];
  const passed = checks.filter(([, , , status]) => status === 'Passed').length;
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Resume keyword check" subtitle="View the comparison from your selected resume analysis." action={<Button variant="secondary" onClick={() => navigate('/upload')}>Check another resume</Button>} />
    <PriorityKeywords analysis={analysis} />
    <Card className="ats-overview-card"><div className="ats-score-overview"><ProgressRing score={analysis.score} label="Keyword match" /><div><span className="ats-status-label">{passed} of {checks.length} checks passed</span><h2>{result.originalName}</h2><p>This is a text and keyword comparison only, not a guarantee of ATS compatibility.</p></div></div><div className="ats-overview-metrics"><span><b>{analysis.resumeKeywords.length}</b>Resume terms</span><span><b>{analysis.jobKeywords.length}</b>Job terms</span><span><b>{analysis.matchedKeywords.length}</b>Matched terms</span></div></Card>
    <div className="ats-detail-grid"><Card><div className="section-title"><div><h2>Analysis checklist</h2><p>Checks available from this text-based analysis.</p></div></div><div className="ats-checklist">{checks.map(([icon,title,detail,status]) => <div className="ats-check-row" key={title}><span className={`ats-check-icon ${status === 'Passed' ? '' : 'needs-review'}`}>{icon}</span><span><b>{title}</b><small>{detail}</small></span><span className={`ats-check-status ${status === 'Passed' ? '' : 'needs-review'}`}>{status}</span></div>)}</div></Card><Card><div className="section-title"><div><h2>Keyword coverage</h2><p>Terms from the uploaded resume and job description.</p></div></div><div className="ats-keyword-meter"><div><span>Matched terms</span><b>{analysis.matchedKeywords.length} / {analysis.jobKeywords.length}</b></div><div className="skill-track"><i style={{ width: `${analysis.score}%` }} /></div></div><KeywordTags values={analysis.matchedKeywords} /><h3 className="mini-heading">Terms not found in the resume</h3><KeywordTags warning values={analysis.missingKeywords} /><div className="ats-recommendation"><b>Review missing terms</b><p>Only add a skill if it accurately reflects your experience.</p><Button onClick={() => navigate('/improve')}>Open resume improvement →</Button></div></Card></div>
  </>;
}

function ScoreBreakdown() {
  return <div className="score-breakdown">{[['Skills match',92],['Experience',90],['Education',85],['Formatting',83],['Grammar & clarity',94]].map(([label,score])=><div className="score-line" key={label}><div><span>{label}</span><b>{score}%</b></div><div className="meter"><i style={{width:`${score}%`}}/></div></div>)}</div>;
}
function KeywordTags({ values, warning = false }) {
  return <div className={`keyword-tags ${warning ? 'warning-tags' : ''}`}>{values.map((value) => <span key={value}>{value}</span>)}</div>;
}

function PriorityKeywords({ analysis }) {
  const details = analysis.keywordDetails || [];
  const hasPriorityData = details.length > 0;
  const detailsByTerm = new Map(details.map((item) => [item.term, item]));
  const terms = analysis.importantKeywords?.length
    ? analysis.importantKeywords
    : analysis.jobKeywords.slice(0, 5);
  const keywords = terms.map((term) => detailsByTerm.get(term) || {
    term,
    importance: 'standard',
    matched: analysis.matchedKeywords.includes(term),
  });

  return <Card className="priority-keywords-card">
    <div className="section-title"><div><h2>{hasPriorityData ? 'Most important job keywords' : 'Keywords from this saved analysis'}</h2><p>{hasPriorityData ? 'Required terms and recognized skills are prioritized. Add a missing term only when it accurately describes your experience.' : 'This older analysis does not include keyword importance details.'}</p></div></div>
    <div className="priority-keyword-list">
      {keywords.map((keyword) => <div className="priority-keyword-row" key={keyword.term}>
        <span className="priority-keyword-name">{keyword.term}</span>
        <span className={`priority-keyword-level ${keyword.importance}`}>{keyword.importance === 'critical' ? 'Required' : keyword.importance === 'high' ? 'High priority' : 'Keyword'}</span>
        <span className={`priority-keyword-status ${keyword.matched ? 'matched' : 'missing'}`}>{keyword.matched ? 'In resume' : 'Missing'}</span>
      </div>)}
    </div>
  </Card>;
}
function RecommendationList({ notify }) {
  const suggestions = [['✦','Add a metrics-driven achievement','Include specific numbers that show your impact.','High impact'],['↗','Improve project descriptions','Highlight the tools, scope, and outcomes of your work.','Medium'],['✦','Use stronger action verbs','Replace passive wording with “led”, “built”, and “delivered”.','Medium']];
  return <div className="recommendation-list">{suggestions.map(([icon,title,desc,level])=><div className="recommendation" key={title}><span className="recommend-icon">{icon}</span><div><b>{title}</b><p>{desc}</p><span className="impact">{level}</span></div><button className="small-apply" onClick={() => notify(`Applied suggestion: ${title}`)}>Apply</button></div>)}</div>;
}

function JobMatch({ notify, resumes, onTrackApplication }) {
  const [job, setJob] = useState('Senior Software Engineer');
  const [company, setCompany] = useState('Acme Technologies');
  const [description, setDescription] = useState('');
  const [matched, setMatched] = useState(false);
  const resume = resumes[0];
  const resumeKeywords = resume?.analysis?.resumeKeywords || [];
  const stopWords = new Set(['about', 'after', 'also', 'and', 'are', 'based', 'been', 'build', 'built', 'can', 'company', 'create', 'develop', 'experience', 'for', 'from', 'have', 'help', 'into', 'looking', 'more', 'our', 'role', 'skills', 'team', 'their', 'this', 'using', 'will', 'with', 'work', 'years', 'you', 'your']);
  const jobKeywords = [...new Set(description.toLowerCase().match(/[a-z][a-z0-9+#./-]{2,}/g) || [])].filter((word) => !stopWords.has(word));
  const resumeKeywordSet = new Set(resumeKeywords.map((keyword) => keyword.toLowerCase()));
  const matchedKeywords = jobKeywords.filter((keyword) => resumeKeywordSet.has(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeKeywordSet.has(keyword));
  const matchScore = jobKeywords.length ? Math.round((matchedKeywords.length / jobKeywords.length) * 100) : 0;
  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Job description matcher" subtitle="Compare a saved resume with a job description using a basic word-overlap check." />
    <div className="match-layout">
      <Card className="job-form"><div className="section-title"><div><h2>Job details</h2><p>Add the role you’re applying for.</p></div></div><label className="field-label">Job title<input value={job} onChange={(event)=>setJob(event.target.value)} /></label><label className="field-label">Company<input value={company} onChange={(event)=>setCompany(event.target.value)} /></label><label className="field-label">Job description<textarea value={description} onChange={(event)=>{setDescription(event.target.value);setMatched(false);}} rows="10" placeholder="Paste the job description here." /></label><Button onClick={()=>{if(!resume){notify('Upload and analyze a resume first.');return;}if(!description.trim()){notify('Paste a job description first.');return;}setMatched(true);}}>✦ Match my resume →</Button><small className="match-note">{resume ? `Resume: ${resume.originalName}` : 'No analyzed resume yet. Upload one to compare.'}</small></Card>
      <Card className="match-results"><div className="section-title"><div><h2>Match results</h2><p>{company || 'Your target company'} · {job || 'Target role'}</p></div><span className="match-live">{matched ? 'RESULT' : 'READY'}</span></div>{matched ? <><div className="match-score-wrap"><ProgressRing score={matchScore} label="Word overlap" /><div><b>{matchedKeywords.length} matching terms</b><p>This is a basic word comparison, not an AI or ATS score.</p></div></div><h3 className="mini-heading">Terms found in both</h3>{matchedKeywords.length ? <KeywordTags values={matchedKeywords} /> : <p className="empty-results">No matching terms found.</p>}<h3 className="mini-heading missing-heading">Job description terms not found in resume</h3>{missingKeywords.length ? <KeywordTags warning values={missingKeywords.slice(0, 20)} /> : <p className="empty-results">No unmatched terms found.</p>}<Button variant="secondary" onClick={() => onTrackApplication({ role: job.trim() || 'Untitled role', company: company.trim() || 'Unknown company', color: 'blue' })}>＋ Track this role</Button></> : <p className="empty-results">Add a job description and click “Match my resume” to see the comparison.</p>}</Card>
    </div>
  </>;
}

function Suggestions({ navigate }) {
  const [filter, setFilter] = useState('All suggestions');
  const suggestions = [
    ['✹','Add measurable achievements','Replace broad responsibilities with specific results and numbers.','HIGH IMPACT','high'],
    ['↗','Improve project descriptions','Add the tools you used, the size of the project, and the outcome.','MEDIUM','medium'],
    ['✦','Use stronger action verbs','Use action words that clearly communicate your contribution.','MEDIUM','medium'],
    ['▤','Optimize your formatting','Keep headings consistent and make your most relevant experience easy to find.','LOW','low'],
  ];
  const visible = filter === 'All suggestions' ? suggestions : suggestions.filter((item) => item[3].toLowerCase().includes(filter.toLowerCase()));
  return <>
    <PageHeading eyebrow="CAREER COACH" title="Resume suggestions" subtitle="General writing guidance to help you improve your resume." />
    <Card className="analysis-explanation"><b>About these suggestions</b><p>These are general examples, not AI-generated recommendations. Review them and edit your resume yourself before using them.</p></Card>
    <div className="filter-tabs">{['All suggestions','High impact','Medium','Low'].map((tab)=><button key={tab} className={filter===tab?'selected':''} onClick={()=>setFilter(tab)}>{tab}{tab==='All suggestions'&&<span>4</span>}</button>)}</div>
    <div className="suggestion-stack">{visible.map(([icon,title,desc,level,color])=><Card className="suggestion-card" key={title}><span className={`suggestion-icon ${color}`}>{icon}</span><div className="suggestion-content"><div className="suggestion-heading"><h2>{title}</h2><span className={`impact-badge ${color}`}>{level}</span></div><p>{desc}</p><div className="suggestion-meta"><span>General guidance</span><span>Review before changing your resume</span></div></div><Button variant="secondary" onClick={()=>navigate('/improve')}>Open improvement editor</Button></Card>)}</div>
  </>;
}

const templates = [
  ['Modern Minimal', 'Clean type, generous spacing, easy to scan.', 'modern', 'Modern'],
  ['Professional', 'Structured sections for experienced professionals.', 'professional', 'Professional'],
  ['Creative Edge', 'A bold sidebar and expressive visual hierarchy.', 'creative', 'Creative'],
  ['Executive Classic', 'A refined, centered layout with traditional type.', 'executive', 'Professional'],
  ['Student Friendly', 'Education and projects take the lead.', 'student', 'Student'],
  ['Two Column', 'A compact skills rail beside your experience.', 'columns', 'Modern'],
];

function TemplatePreview({ style }) {
  if (style === 'creative') {
    return <div className="resume-preview creative" aria-hidden="true"><div className="creative-sheet"><aside><span>JL</span><i /><i /><i /><b>SKILLS</b><i /><i /><i /></aside><main><strong>Jordan Lee</strong><small>PRODUCT DESIGNER</small><hr /><b>PROFILE</b><i /><i /><i /><b>EXPERIENCE</b><i /><i /><i /><i /><b>SELECTED WORK</b><i /><i /></main></div></div>;
  }

  if (style === 'executive') {
    return <div className="resume-preview executive" aria-hidden="true"><div className="executive-sheet"><strong>JORDAN LEE</strong><small>PRODUCT &amp; DESIGN LEADER</small><hr /><span>SAN FRANCISCO  |  LINKEDIN</span><b>EXECUTIVE PROFILE</b><i /><i /><i /><b>LEADERSHIP EXPERIENCE</b><i /><i /><i /><b>EDUCATION</b><i /><i /></div></div>;
  }

  if (style === 'student') {
    return <div className="resume-preview student" aria-hidden="true"><div className="student-sheet"><header><span>JL</span><div><strong>Jordan Lee</strong><small>DESIGN STUDENT</small></div></header><b>EDUCATION</b><i /><i /><div className="student-highlight"><b>SELECTED PROJECT</b><i /><i /></div><b>EXPERIENCE</b><i /><i /><b>TOOLS &amp; SKILLS</b><div className="student-tags"><i /><i /><i /><i /></div></div></div>;
  }

  if (style === 'columns') {
    return <div className="resume-preview columns" aria-hidden="true"><div className="columns-sheet"><aside><strong>Jordan<br />Lee</strong><small>CONTACT</small><i /><i /><small>SKILLS</small><i /><i /><i /><i /><small>EDUCATION</small><i /><i /></aside><main><b>PROFILE</b><i /><i /><i /><b>EXPERIENCE</b><i /><i /><i /><i /><i /><b>PROJECTS</b><i /><i /></main></div></div>;
  }

  if (style === 'professional') {
    return <div className="resume-preview professional" aria-hidden="true"><div className="professional-sheet"><header><strong>Jordan Lee</strong><small>PRODUCT DESIGNER</small><span>EMAIL  |  PHONE  |  LOCATION</span></header><b>SUMMARY</b><i /><i /><b>PROFESSIONAL EXPERIENCE</b><strong className="mini-role">Senior Product Designer</strong><i /><i /><i /><strong className="mini-role">Product Designer</strong><i /><i /><b>EDUCATION &amp; SKILLS</b><i /><i /></div></div>;
  }

  return <div className="resume-preview modern" aria-hidden="true"><div className="modern-sheet"><header><div><strong>Jordan Lee</strong><small>Product Designer</small></div><span>EMAIL  |  LINKEDIN</span></header><b>PROFILE</b><i /><i /><i /><b>EXPERIENCE</b><strong className="mini-role">Senior Product Designer</strong><i /><i /><i /><b>SELECTED PROJECTS</b><i /><i /><b>SKILLS</b><div className="modern-tags"><i /><i /><i /></div></div></div>;
}

function Templates({ notify, navigate }) {
  const [selected, setSelected] = useSavedState('cv-insights-selected-template', 'Modern Minimal');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const visible = templates.filter(([name, description, , templateCategory]) => {
    const matchesQuery = `${name} ${description}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || category === templateCategory;
    return matchesQuery && matchesCategory;
  });
  const continueWithTemplate = () => {
    notify(`${selected} selected. Your resume builder is ready.`);
    navigate('/builder');
  };

  return <>
    <PageHeading eyebrow="RESUME TOOLS" title="Resume templates" subtitle="Choose a design, then continue to the resume builder." action={<Button onClick={continueWithTemplate}>Continue with {selected} &gt;</Button>} />
    <div className="template-toolbar">
      <label className="template-search"><span aria-hidden="true">Search</span><input aria-label="Search templates" placeholder="Search templates..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <div className="filter-tabs compact" role="group" aria-label="Filter templates">
        {['All', 'Modern', 'Professional', 'Creative', 'Student'].map((item) => (
          <button key={item} type="button" className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
    </div>
    {visible.length ? (
      <div className="template-grid">
        {visible.map(([name, description, style]) => (
          <button key={name} type="button" className={`template-card ${selected === name ? 'chosen' : ''}`} aria-pressed={selected === name} onClick={() => setSelected(name)}>
            <TemplatePreview style={style} />
            <span className="template-info"><span><b>{name}</b><small>{description}</small></span><span className={`template-select ${selected === name ? 'is-selected' : ''}`}>{selected === name ? 'Selected' : 'Select'}</span></span>
          </button>
        ))}
      </div>
    ) : <Card className="empty-state"><h2>No templates found</h2><p>Try another search or choose a different category.</p><Button variant="secondary" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</Button></Card>}
  </>;
}
function Interview({ notify }) {
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempted, setAttempted] = useState(0);
  const questions = ['Explain the difference between SQL and NoSQL databases.','Tell me about a time you solved a difficult technical problem.','How do you make sure your code is maintainable?'];
  const submitAnswer = () => {
    if (!answer.trim()) {
      notify('Write an answer before submitting.');
      return;
    }
    setFeedback(practiceFeedback(answer));
    setAttempted((current) => current + 1);
    setAnswer('');
    setQuestion((current) => (current + 1) % questions.length);
  };
  const startNewSession = () => {
    setQuestion(0);
    setAnswer('');
    setFeedback('');
    setAttempted(0);
  };
  return <>
    <PageHeading eyebrow="CAREER COACH" title="Interview preparation" subtitle="Practice sample questions and get simple, rule-based feedback on your answers." action={<Button onClick={startNewSession}>＋ New practice session</Button>} />
    <div className="interview-layout"><Card className="question-card"><div className="question-top"><span className="practice-tag">✦ TECHNICAL INTERVIEW</span><span>Question {question + 1} of {questions.length}</span></div><div className="question-progress"><i style={{width:`${(attempted / questions.length) * 100}%`}}/></div><span className="question-number">QUESTION {question+1}</span><h2>{questions[question]}</h2><div className="question-tags"><span>Software Engineer</span><span className="medium-tag">Practice</span></div><label className="field-label">Your answer<textarea rows="9" placeholder="Type your answer here..." value={answer} onChange={(event)=>setAnswer(event.target.value)} /></label><div className="answer-actions"><Button variant="secondary" onClick={()=>{setAnswer('');setFeedback('');setQuestion((current)=>(current+1)%questions.length);}}>Skip question</Button><Button onClick={submitAnswer}>Submit answer →</Button></div><div className="ai-feedback"><span>✦</span><div><b>Practice feedback · not AI-generated</b><p>{feedback || 'Submit an answer to receive basic feedback on its detail and use of examples.'}</p></div></div></Card><Card className="interview-progress"><div className="section-title"><div><h2>Your progress</h2><p>Current practice session</p></div></div><div className="interview-ring"><ProgressRing score={Math.round((attempted / questions.length) * 100)} label="Complete" /></div><div className="progress-metrics"><span>Questions attempted<b>{attempted} / {questions.length}</b></span><span>Feedback type<b>Basic</b></span><span>Questions left<b>{questions.length - attempted}</b></span></div><div className="interview-hint"><b>✦ Practice tip</b><p>Use the STAR method: Situation, Task, Action, and Result.</p></div></Card></div>
  </>;
}

function History({ navigate, resumes = [], onOpen, onDownload, onDelete }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);
  const averageScore = resumes.length
    ? Math.round(resumes.reduce((total, item) => total + (item.analysis?.score || 0), 0) / resumes.length)
    : 0;
  const visibleRows = resumes.filter((item) => {
    const matchesQuery = item.originalName.toLowerCase().includes(query.trim().toLowerCase());
    const needsWork = (item.analysis?.score || 0) < 70;
    return matchesQuery && (status === 'All statuses' || (status === 'Needs work' ? needsWork : !needsWork));
  });
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = visibleRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  return <div className="history-page">
    <PageHeading eyebrow="YOUR WORKSPACE" title="History &amp; analytics" subtitle="Review, download, or remove your saved resume analyses." action={<Button onClick={()=>navigate('/upload')}>＋ Analyze a resume</Button>} />
    <div className="stats-grid analytics-stats">
      <StatCard icon="▤" label="Total analyses" value={resumes.length} change="Saved resumes" color="purple" />
      <StatCard icon="↗" label="Average keyword match" value={`${averageScore}%`} change="Across your saved resumes" color="green" />
      <StatCard icon="✦" label="Suggestions applied" value="—" change="Not tracked yet" color="blue" />
      <StatCard icon="◷" label="Last analyzed" value={resumes[0] ? new Date(resumes[0].createdAt).toLocaleDateString() : '—'} change={resumes[0]?.originalName || 'No analyses yet'} color="orange" />
    </div>
    {resumes.length > 0 && <Card className="analytics-trend-card"><div className="section-title"><div><h2>Saved resume scores</h2><p>Keyword match scores from your saved analyses.</p></div></div><div className="history-score-list">{resumes.slice(0, 8).map((item) => <div key={item.id}><span>{item.originalName}</span><div className="skill-track"><i style={{ width: `${item.analysis?.score || 0}%` }} /></div><b>{item.analysis?.score || 0}%</b></div>)}</div></Card>}
    <Card className="history-card"><div className="history-filters"><label className="template-search">⌕ <input placeholder="Search files..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label><select aria-label="Filter by status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(0); }}><option>All statuses</option><option>Analyzed</option><option>Needs work</option></select></div>
      {pageRows.length ? <div className="table-scroll"><table className="history-table"><thead><tr><th>FILE NAME</th><th>TYPE</th><th>DATE</th><th>KEYWORD MATCH</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{pageRows.map((item) => { const score = item.analysis?.score || 0; const itemStatus = score < 70 ? 'Needs work' : 'Analyzed'; return <tr key={item.id}><td><span className="file-icon pdf">PDF</span><b>{item.originalName}</b></td><td>PDF</td><td>{new Date(item.createdAt).toLocaleDateString()}</td><td><span className={`score-pill ${score < 70 ? 'warning' : ''}`}>{score}%</span></td><td><span className={`status-chip ${itemStatus === 'Analyzed' ? 'complete' : 'pending'}`}>{itemStatus}</span></td><td><button className="table-action" aria-label={`Open analysis for ${item.originalName}`} onClick={() => onOpen(item)}>↗</button><button className="table-action" aria-label={`Download ${item.originalName}`} onClick={() => onDownload(item)}>↓</button><button className="table-action" aria-label={`Delete ${item.originalName}`} onClick={() => onDelete(item)}>×</button></td></tr>; })}</tbody></table></div> : <p className="empty-results">{resumes.length ? 'No resumes match these filters.' : 'No resumes analyzed yet. Upload a PDF and its results will appear here.'}</p>}
      <div className="table-footer"><span>Showing {pageRows.length ? currentPage * pageSize + 1 : 0}–{currentPage * pageSize + pageRows.length} of {visibleRows.length}</span><div className="pagination"><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>‹</button><span className="current-page">{currentPage + 1} / {pageCount}</span><button disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>›</button></div><select aria-label="Rows per page" value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(0); }}><option value="5">5 per page</option><option value="10">10 per page</option><option value="20">20 per page</option></select></div>
    </Card>
  </div>;
}

function AnalyticsChart({ resumes = [] }) {
  const items = resumes.slice(0, 7).reverse();
  if (!items.length) return <p className="empty-results">Your resume score trend will appear after you analyze a resume.</p>;
  const points = items.map((item, index) => ({
    x: items.length === 1 ? 300 : (index / (items.length - 1)) * 600,
    y: 175 - ((item.analysis?.score || 0) / 100) * 150,
  }));
  const line = points.map(({ x, y }, index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ');
  const area = `${line} L${points.at(-1).x} 190 L${points[0].x} 190 Z`;
  return <div className="analytics-chart">
    <div className="chart-y-labels"><span>100</span><span>75</span><span>50</span><span>25</span></div>
    <svg viewBox="0 0 600 190" role="img" aria-label="Resume score rising from 58 to 89 percent over six months" preserveAspectRatio="none">
      <defs><linearGradient id="score-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#20ad81" stopOpacity=".2" /><stop offset="100%" stopColor="#20ad81" stopOpacity="0" /></linearGradient></defs>
      <path className="chart-area" d={area} />
      <path className="chart-line" d={line} />
      {points.map((point, index) => <circle key={`${point.x}-${index}`} cx={point.x} cy={point.y} r="4" className="chart-point" />)}
    </svg>
    <div className="chart-x-labels">{items.map((item) => <span key={item.id}>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>)}</div>
    <span className="chart-current-score">{items.at(-1).analysis?.score || 0}%</span>
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

function JobRecommendations({ notify, onTrackApplication }) {
  const [query, setQuery] = useState('');
  const [workStyle, setWorkStyle] = useState('Any work style');
  const [sortBy, setSortBy] = useState('Best match');
  const [saved, setSaved] = useSavedState('cv-insights-saved-jobs', []);
  const jobs = [
    ['Senior Frontend Engineer', 'Linear', 'Remote · Full-time', '$145k–$180k', '94%', ['React', 'TypeScript', 'Design systems']],
    ['Product Engineer', 'Notion', 'New York, NY · Hybrid', '$135k–$165k', '88%', ['React', 'Node.js', 'Product thinking']],
    ['UI Engineer', 'Figma', 'San Francisco, CA · Hybrid', '$150k–$190k', '82%', ['JavaScript', 'CSS', 'Accessibility']],
    ['Frontend Developer', 'Vercel', 'Remote · Full-time', '$125k–$155k', '78%', ['Next.js', 'React', 'Performance']],
  ];
  const visible = jobs
    .filter(([title, company, details]) => `${title} ${company}`.toLowerCase().includes(query.toLowerCase())
      && (workStyle === 'Any work style' || details.toLowerCase().includes(workStyle.toLowerCase())))
    .sort((left, right) => sortBy === 'Salary: high to low'
      ? Number(right[3].match(/\d+/)?.[0] || 0) - Number(left[3].match(/\d+/)?.[0] || 0)
      : sortBy === 'Newest' ? right[0].localeCompare(left[0]) : Number.parseInt(right[4], 10) - Number.parseInt(left[4], 10));
  const toggleSaved = (title) => setSaved((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  return <div className="job-recommendations-page">
    <PageHeading eyebrow="YOUR NEXT OPPORTUNITY" title="Job recommendations" subtitle="Explore sample roles, save interesting ones, and track your applications." />
    <div className="job-match-banner"><span className="insight-icon">✦</span><div><b>Example job listings</b><span>These sample roles are for exploring the interface; they are not live vacancies.</span></div><span className="job-match-total">{visible.length} shown</span></div>
    <div className="job-filter-row"><label className="template-search">⌕ <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles or companies..." /></label><select aria-label="Filter by work style" value={workStyle} onChange={(event) => setWorkStyle(event.target.value)}><option>Any work style</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select><select aria-label="Sort job recommendations" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option>Best match</option><option>Newest</option><option>Salary: high to low</option></select></div>
    <div className="job-recommendation-list">{visible.map(([title, company, details, salary, match, tags]) => <Card className="job-recommendation-card" key={title}><div className="company-mark">{company.slice(0, 1)}</div><div className="job-recommendation-main"><div className="job-title-row"><div><h2>{title}</h2><b>{company}</b></div><span className="job-match-score">{match} sample match</span></div><span className="job-details">{details} <i>·</i> {salary}</span><KeywordTags values={tags} /><div className="job-card-actions"><a className="button" href={`https://www.google.com/search?q=${encodeURIComponent(`${title} ${company} jobs`)}`} target="_blank" rel="noreferrer">Search job →</a><Button variant="secondary" onClick={() => toggleSaved(title)}>{saved.includes(title) ? '✓ Saved' : '☆ Save job'}</Button><button className="text-link" onClick={() => onTrackApplication({ role: title, company, color: 'blue' })}>＋ Track application</button></div></div></Card>)}</div>
    {!visible.length && <Card className="empty-results">No roles match that search. Try a different title or company.</Card>}
  </div>;
}

function ApplicationTracker({ notify, applications, setApplications }) {
  const [filter, setFilter] = useState('All applications');
  const [adding, setAdding] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const visible = filter === 'All applications' ? applications : applications.filter((item) => item.status === filter);
  const updateStatus = (id, status) => setApplications((current) => current.map((item) => item.id === id ? { ...item, status } : item));
  const addApplication = () => {
    if (!company.trim() || !role.trim()) {
      notify('Enter the company and role before saving this application.');
      return;
    }
    setApplications((current) => [{ id: crypto.randomUUID(), company: company.trim(), role: role.trim(), date: new Date().toLocaleDateString(), status: 'Saved', color: 'blue' }, ...current]);
    setCompany('');
    setRole('');
    setAdding(false);
    notify('Application saved in this browser.');
  };
  return <>
    <PageHeading eyebrow="YOUR JOB SEARCH" title="Application tracker" subtitle="Track application details and update each status. Your list is saved in this browser." action={<Button onClick={() => setAdding((current) => !current)}>{adding ? 'Cancel' : '＋ Add application'}</Button>} />
    {adding && <Card className="application-add-form"><label className="field-label">Company<input value={company} onChange={(event) => setCompany(event.target.value)} autoFocus /></label><label className="field-label">Role<input value={role} onChange={(event) => setRole(event.target.value)} /></label><Button onClick={addApplication}>Save application</Button></Card>}
    <div className="stats-grid application-stats"><StatCard icon="▤" label="Total applications" value={applications.length} change="In this browser" color="purple" /><StatCard icon="◷" label="In progress" value={applications.filter((item) => !['Offer', 'Rejected'].includes(item.status)).length} change="Not yet closed" color="blue" /><StatCard icon="◉" label="Interviews" value={applications.filter((item) => item.status === 'Interview').length} change="Tracked interviews" color="orange" /><StatCard icon="✓" label="Offers received" value={applications.filter((item) => item.status === 'Offer').length} change="Tracked offers" color="green" /></div>
    <Card className="application-table-card"><div className="section-title"><div><h2>Your applications</h2><p>Update a status whenever your application moves forward.</p></div><select aria-label="Filter applications" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All applications</option>{['Saved', 'Applied', 'In review', 'Interview', 'Offer', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</select></div>{visible.length ? <div className="table-scroll"><table className="history-table applications-table"><thead><tr><th>COMPANY &amp; ROLE</th><th>DATE ADDED</th><th>STATUS</th><th>FOLLOW-UP</th><th /></tr></thead><tbody>{visible.map((item) => <tr key={item.id}><td><span className={`company-mini ${item.color}`}>{item.company.slice(0, 1)}</span><span className="application-role"><b>{item.company}</b><small>{item.role}</small></span></td><td>{item.date}</td><td><select aria-label={`Update ${item.company} application status`} value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>{['Saved', 'Applied', 'In review', 'Interview', 'Offer', 'Rejected'].map((status) => <option key={status}>{status}</option>)}</select></td><td>{item.status === 'Interview' ? 'Prepare for interview' : item.status === 'Applied' ? 'Follow up on this application' : '—'}</td><td><button className="table-action" aria-label={`Remove ${item.company} application`} onClick={() => setApplications((current) => current.filter((application) => application.id !== item.id))}>×</button></td></tr>)}</tbody></table></div> : <p className="empty-results">{filter === 'All applications' ? 'No applications yet. Add one here or track a role from Job Recommendations.' : `No applications with status “${filter}”.`}</p>}</Card>
  </>;
}

function CareerAssistant({ navigate, notify, user }) {
  const [messages, setMessages] = useState([{ from: 'assistant', text: 'Hi! I’m your AI career assistant. I can help improve your resume, find your next role, prepare for interviews, and plan your career. What would you like help with?' }]);
  const [draft, setDraft] = useState('');
  const sendMessage = (text = draft) => {
    const question = text.trim();
    if (!question) return;
    setMessages((current) => [...current, { from: 'user', text: question }, { from: 'assistant', text: 'A great next step is to tailor your resume to the role, lead with measurable results, and highlight the skills that match the job description. I can help you take it further—would you like to review your resume, find matching jobs, or practice interview questions?' }]);
    setDraft('');
  };
  return <>
    <PageHeading eyebrow="YOUR PERSONAL CAREER COACH" title="AI career assistant" subtitle="Ask anything about your job search, resume, interviews, or next career move." />
    <div className="assistant-layout"><Card className="assistant-chat"><div className="assistant-chat-header"><span className="assistant-avatar">✦</span><span><b>Your career copilot</b><small><i /> Ready to help</small></span><button className="text-link" onClick={() => setMessages([{ from: 'assistant', text: 'Fresh start! What would you like help with today?' }])}>New conversation</button></div><div className="assistant-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.from === 'user' ? 'chat-user' : 'chat-assistant'}`} key={`${message.from}-${index}`}><span className="chat-avatar">{message.from === 'user' ? userInitials(user?.name) : '✦'}</span><p>{message.text}</p></div>)}</div><div className="assistant-prompts"><span>Try asking</span>{['How can I improve my resume?', 'Find jobs that match my skills', 'Help me prepare for an interview'].map((prompt) => <button key={prompt} onClick={() => sendMessage(prompt)}>{prompt} →</button>)}</div><form className="assistant-input" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}><input aria-label="Message your career assistant" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask me anything about your career..." /><button type="submit" aria-label="Send message" disabled={!draft.trim()}>↑</button></form><small className="assistant-disclaimer">AI can make mistakes. Review suggestions before using them.</small></Card><div className="assistant-sidebar"><Card><div className="section-title"><div><h2>What I can help with</h2><p>Your personal career toolkit.</p></div></div>{[['▤','Resume review','Get targeted feedback and ATS tips','/analysis'],['⌕','Find opportunities','Explore jobs that fit your skills','/jobs'],['◉','Interview practice','Build confidence with mock questions','/mock-interview'],['◈','Skill development','Find and close your skill gaps','/skills']].map(([icon,title,detail,path]) => <button className="assistant-tool" key={title} onClick={() => navigate(path)}><span>{icon}</span><span><b>{title}</b><small>{detail}</small></span><i>›</i></button>)}</Card><Card className="assistant-insight"><span>✦</span><b>Your profile insight</b><p>Your experience with React and TypeScript is in high demand. Add quantified project outcomes to stand out.</p><button className="text-link" onClick={() => navigate('/suggestions')}>See suggestions →</button></Card></div></div>
  </>;
}

function MockInterview({ notify }) {
  const [started, setStarted] = useState(false);
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [attempted, setAttempted] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const questions = ['Tell me about a project you’re proud of and the impact it had.', 'How do you handle a challenging deadline?', 'What makes you the right person for this role?'];
  const submitAnswer = () => {
    if (!answer.trim()) {
      notify('Write an answer before submitting.');
      return;
    }
    setFeedback(practiceFeedback(answer));
    setAttempted((current) => current + 1);
    setAnswer('');
    setQuestion((current) => (current + 1) % questions.length);
  };
  return <>
    <PageHeading eyebrow="PRACTICE WITH CONFIDENCE" title="Mock interview" subtitle="Practice sample questions with basic, rule-based feedback. This demo does not use AI or your camera/microphone." action={<Button variant="secondary" onClick={() => { setStarted(false); setQuestion(0); setAnswer(''); setFeedback(''); setAttempted(0); }}>↻ New session</Button>} />
    <div className="mock-interview-layout"><div className="mock-interview-main"><Card className="mock-video-card"><div className="mock-video-toolbar"><span>{started ? '● SESSION IN PROGRESS' : 'READY WHEN YOU ARE'}</span><span>Senior Product Designer · Practice interview</span></div><div className="mock-video-stage"><div className="interviewer-avatar">AM</div><span className="interviewer-name">Alex Morgan <small>AI interviewer</small></span><div className="video-controls"><button aria-label="Toggle microphone" onClick={() => notify('Microphone preference updated.')}>♩</button><button aria-label="Toggle camera" onClick={() => notify('Camera preference updated.')}>▣</button><button className={started ? 'end-session' : 'start-session'} onClick={() => { setStarted(!started); if (started) notify('Practice session ended. Your feedback is ready.'); }}>{started ? 'End session' : '▶ Start practice'}</button></div></div><div className="mock-question"><span>QUESTION {question + 1} OF {questions.length}</span><b>{questions[question]}</b><p>{started ? 'Take a moment to organize your thoughts, then share your answer.' : 'Start the session when you’re ready to answer.'}</p></div><label className="field-label">Your answer<textarea rows="4" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your response here, or practice speaking out loud..." /></label><div className="mock-answer-actions"><Button variant="secondary" onClick={() => { setQuestion((current) => (current + 1) % questions.length); setAnswer(''); }}>Skip question</Button><Button onClick={() => { if (!answer.trim()) { notify('Write a short answer before requesting feedback.'); return; } notify('Your answer was saved. AI feedback is ready.'); setQuestion((current) => (current + 1) % questions.length); setAnswer(''); }}>Submit answer →</Button></div></Card></div><div className="mock-feedback-column"><Card><div className="section-title"><div><h2>Interview readiness</h2><p>Your practice session overview.</p></div></div><div className="mock-score-ring"><ProgressRing score={88} label="Readiness" /></div><div className="mock-feedback-list"><b>AI feedback</b><p>Speak clearly about your individual contribution and include a measurable result where possible.</p><span>✓ Clear communication</span><span>↗ Add a specific outcome</span><span>✦ Try the STAR method</span></div></Card><Card className="mock-tip-card"><b>✦ Practice tip</b><p>Use the STAR method to structure a clear answer: Situation, Task, Action, and Result.</p></Card></div></div>
  </>;
}

function Profile({ notify, user }) {
  const [details, setDetails] = useSavedState('cv-insights-profile-details', {
    phone: '',
    location: '',
    title: '',
    experience: 'Select experience',
  });
  const update = (field, value) => setDetails((current) => ({ ...current, [field]: value }));
  return <>
    <PageHeading eyebrow="ACCOUNT" title="Profile & settings" subtitle="Manage your personal information, career goals, and preferences." />
    <div className="profile-tabs"><button className="active">Profile</button><button onClick={()=>notify('Account settings are available in the Settings page.')}>Account</button><button onClick={()=>notify('Notification preferences saved.')}>Notifications</button><button onClick={()=>notify('Privacy settings opened.')}>Privacy</button></div>
    <div className="profile-layout"><Card className="profile-card"><div className="section-title"><div><h2>Personal information</h2><p>Name and email come from your account. Other details save in this browser.</p></div></div><div className="profile-avatar-row"><div className="avatar avatar-large">{userInitials(user?.name)}</div><div><b>{user?.name || 'Your account'}</b><span>{user?.email || 'Loading account...'}</span></div></div><div className="builder-fields"><label className="field-label">Full name<input value={user?.name || ''} readOnly /></label><label className="field-label">Email address<input value={user?.email || ''} readOnly /></label><label className="field-label">Phone number<input value={details.phone} onChange={(event) => update('phone', event.target.value)} /></label><label className="field-label">Location<input value={details.location} onChange={(event) => update('location', event.target.value)} /></label><label className="field-label">Current job title<input value={details.title} onChange={(event) => update('title', event.target.value)} /></label><label className="field-label">Years of experience<select value={details.experience} onChange={(event) => update('experience', event.target.value)}><option>Select experience</option><option>0–2 years</option><option>3–4 years</option><option>5–8 years</option><option>9+ years</option></select></label></div><div className="profile-save"><span className="save-state saved">✓ Saved in this browser</span></div></Card><div className="profile-side"><Card><div className="section-title"><div><h2>Skills</h2><p>Help us personalize your suggestions.</p></div><button className="text-link" onClick={()=>notify('Add skills in the Resume Builder to include them in your resume.')}>＋ Add</button></div><KeywordTags values={['Product design','Figma','User research','Prototyping','Design systems']} /></Card><Card><div className="section-title"><div><h2>Career preferences</h2><p>What are you looking for?</p></div></div><label className="field-label">Preferred role<input value={details.preferredRole || ''} onChange={(event) => update('preferredRole', event.target.value)} /></label><label className="field-label">Preferred work style<select value={details.workStyle || 'Select work style'} onChange={(event) => update('workStyle', event.target.value)}><option>Select work style</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label><label className="field-label">Job search status<select value={details.jobStatus || 'Select status'} onChange={(event) => update('jobStatus', event.target.value)}><option>Select status</option><option>Actively looking</option><option>Open to offers</option><option>Not looking</option></select></label></Card></div></div>
  </>;
}

function Settings({ notify, user }) {
  return <>
    <PageHeading eyebrow="ACCOUNT" title="Settings" subtitle="Choose how CV Insights works for you." />
    <div className="settings-layout"><Card><div className="section-title"><div><h2>Preferences</h2><p>Customize your workspace experience.</p></div></div><SettingRow title="Email notifications" detail="Get updates about your analysis and career activity." defaultChecked /><SettingRow title="Weekly career digest" detail="A weekly summary of your career progress and suggestions." defaultChecked /><SettingRow title="Product updates" detail="Hear about new features and improvements." /><SettingRow title="Keep resume history" detail="Save your previous resume analyses to your account." defaultChecked /><div className="profile-save"><Button onClick={()=>notify('Settings saved successfully.')}>Save preferences</Button></div></Card><Card><div className="section-title"><div><h2>Account security</h2><p>Manage your sign-in and account details.</p></div></div><div className="security-row"><span className="security-icon">♙</span><div><b>Password</b><span>Last updated 3 months ago</span></div><button onClick={()=>notify('Password reset link sent to your email.')}>Change password →</button></div><div className="security-row"><span className="security-icon">✉</span><div><b>Email address</b><span>{user?.email || 'Sign in to view your email'}{user?.email && ' · Verified'}</span></div><span className="verified">✓ Verified</span></div><div className="danger-zone"><b>Delete account</b><p>Permanently remove your account and all associated data.</p><Button variant="danger" onClick={()=>notify('Contact support to permanently delete your account.')}>Delete account</Button></div></Card></div>
  </>;
}
function SettingRow({ title, detail, defaultChecked = false }) {
  const [checked, setChecked] = useSavedState(`cv-insights-setting-${title}`, defaultChecked);
  return <div className="setting-row"><div><b>{title}</b><span>{detail}</span></div><button role="switch" aria-checked={checked} className={`switch ${checked?'on':''}`} onClick={()=>setChecked(!checked)}><i/></button></div>;
}

function ProfileSetup({ navigate, notify }) {
  const [preferences, setPreferences] = useSavedState('cv-insights-career-profile', { role: '', experience: '', skills: '' });
  const update = (field, value) => setPreferences((current) => ({ ...current, [field]: value }));
  const continueSetup = () => {
    if (!preferences.role.trim() || !preferences.experience) {
      notify('Add your target role and experience level to continue.');
      return;
    }
    notify('Career preferences saved in this browser.');
    navigate('/dashboard');
  };
  return <><PageHeading eyebrow="GETTING STARTED · 2 OF 3" title="Let’s personalize your experience" subtitle="Tell us a little about your goals so we can make your recommendations more relevant." /><Card className="setup-card"><div className="builder-fields"><label className="field-label">What role are you looking for?<input placeholder="e.g. Product Designer" value={preferences.role} onChange={(event) => update('role', event.target.value)} /></label><label className="field-label">Experience level<select value={preferences.experience} onChange={(event) => update('experience', event.target.value)}><option value="">Select your experience</option><option>Entry level</option><option>Mid level</option><option>Senior</option></select></label><label className="field-label field-full">Which skills do you want to highlight?<input placeholder="Add skills separated by commas" value={preferences.skills} onChange={(event) => update('skills', event.target.value)} /></label></div><div className="builder-footer"><Button variant="secondary" onClick={()=>navigate('/dashboard')}>Skip for now</Button><Button onClick={continueSetup}>Continue →</Button></div></Card></>;
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
    { title: 'Accurate Match Score', desc: 'Know exactly how well your resume matches the job.', icon: '◎' },
    { title: 'Detailed Skill Analysis', desc: 'Find your strengths and skill gaps in seconds.', icon: '✦' },
    { title: 'Actionable Suggestions', desc: 'Get personalized tips to improve your resume.', icon: '⚡' },
    { title: 'ATS Friendly', desc: 'Build a resume that passes recruiter screening systems.', icon: '📄' },
    { title: 'Track Your Progress', desc: 'Save reports and monitor your score growth over time.', icon: '⏱' },
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="#home" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
          <span className="landing-brand-mark">CV</span>
          <span>
            <b>CV-Insights</b>
            <small>AI Career Copilot</small>
          </span>
        </a>
        <nav className="landing-nav">
          <a href="#home" className="active">Home</a>
          <a href="#features">Features</a>
          <a href="/app/upload" onClick={(e) => { e.preventDefault(); navigate('/upload'); }}>Resume Analyzer</a>
          <a href="/app/templates" onClick={(e) => { e.preventDefault(); navigate('/templates'); }}>Templates</a>
        </nav>
        <div className="landing-header-actions">
          <button className="landing-signin" onClick={() => navigate('/login')}>Login</button>
          <Button onClick={() => navigate('/signup')}>Get Started</Button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="home">
          <div className="hero-pill-badge">
            <span>✦</span> AI POWERED CAREER ASSISTANT
          </div>
          <h1 className="hero-headline">
            Turn Your Resume <span>Into Opportunities</span>
          </h1>
          <p className="hero-subhead">
            CV-Insights analyzes your resume against job descriptions using AI, gives you a match score, finds skill gaps, and provides actionable suggestions to help you get hired faster.
          </p>
          <div className="hero-cta-group">
            <Button className="hero-cta-primary" onClick={() => navigate('/upload')}>
              Analyze Your Resume →
            </Button>
            <button className="hero-cta-secondary" onClick={() => navigate('/templates')}>
              Browse Resume Templates <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="proof-avatars">
              <span className="proof-avatar">JL</span>
              <span className="proof-avatar">AK</span>
              <span className="proof-avatar">SR</span>
              <span className="proof-avatar">+2k</span>
            </div>
            <span className="proof-text">
              <b>+2,500</b> students &amp; professionals already trust CV-Insights
            </span>
          </div>

          {/* 5-Card Feature Strip */}
          <div className="features-strip" id="features">
            {features.map((item) => (
              <div className="feature-strip-card" key={item.title}>
                <div className="feature-strip-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Metrics Bar */}
          <div className="landing-metrics-bar">
            <div className="metric-item">
              <span className="metric-icon purple">👥</span>
              <div className="metric-info">
                <strong>2,500+</strong>
                <span>Happy Users</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon blue">📄</span>
              <div className="metric-info">
                <strong>5,000+</strong>
                <span>Resumes Analyzed</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon cyan">🎯</span>
              <div className="metric-info">
                <strong>85%</strong>
                <span>Average Match Score</span>
              </div>
            </div>
            <div className="metric-item">
              <span className="metric-icon green">⚡</span>
              <div className="metric-info">
                <strong>3x</strong>
                <span>More Interview Calls</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a className="landing-brand" href="#home" onClick={(e) => { e.preventDefault(); navigate('/home'); }}>
          <span className="landing-brand-mark" style={{ width: '28px', height: '28px', fontSize: '11px' }}>CV</span>
          <span style={{ fontSize: '14px' }}><b>CV-Insights</b></span>
        </a>
        <span style={{ fontSize: '12px', color: '#64748b' }}>© 2026 CV-Insights. Powered by Advanced AI.</span>
        <button className="landing-signin" onClick={() => navigate('/login')}>Get Started Free →</button>
      </footer>
    </div>
  );
}

function AuthPage({ page, navigate, notify }) {
  const isSplash = page === 'splash' || page === 'intro';
  const isSignup = page === 'signup';
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (isSignup && name.trim().length < 2) return notify('Please enter your full name.');
    if (!email.includes('@')) return notify('Enter a valid email address to continue.');
    if (password.length < (isSignup ? 8 : 6)) {
      return notify(isSignup ? 'Your password must be at least 8 characters.' : 'Your password must be at least 6 characters.');
    }

    setSubmitting(true);
    try {
      const response = await apiRequest(isSignup ? '/auth/register' : '/auth/login', {
        method: 'POST',
        body: JSON.stringify(isSignup
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password }),
      });
      saveAuthToken(response.token, isSignup || rememberMe);
      navigate(isSignup ? '/profile-setup' : '/dashboard');
    } catch (error) {
      notify(error.message);
    } finally {
      setSubmitting(false);
    }
  };
  if (isSplash) return <SplashPage navigate={navigate} />;
  return (
    <div className="auth-shell">
      <div className="auth-background-orb orb-left" />
      <div className="auth-background-orb orb-right" />
      <div className="auth-brand">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}>
          <span className="brand-mark">CV</span>
          <span className="brand-copy"><b>CV INSIGHTS</b><small>Your AI career copilot</small></span>
        </a>
      </div>
      <div className="auth-layout">
        <section className="auth-promo">
          <span className="auth-promo-badge"><i /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>{isSignup ? 'Build a career that feels like you.' : 'Your next opportunity starts here.'}</h1>
          <p>Make your experience stand out with a personal career workspace designed to help you move forward.</p>
          <div className="auth-feature-list">
            <span><i>✦</i><b>Know your resume strengths</b><small>Get a clear view of your skills and opportunities.</small></span>
            <span><i>⌕</i><b>Find roles that fit you</b><small>Focus your search on your next best move.</small></span>
            <span><i>▣</i><b>Feel ready for interviews</b><small>Practice with guidance built around your goals.</small></span>
          </div>
          <div className="auth-quote"><span>“</span><p>Better resumes.<br />Brighter opportunities.</p></div>
          <div className="auth-trust-row"><span>✓ Made for your next step</span><span>✦ Career tools in one place</span></div>
        </section>
        <section className="auth-card">
          <div className="auth-card-topline"><span className="auth-card-mark">CV</span><span className="auth-secure-label">✦ YOUR CAREER, IN FOCUS</span></div>
          <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p>{isSignup ? 'Create your free account and start building what’s next.' : 'Sign in to pick up where your career journey left off.'}</p>
          <form onSubmit={submit} className="auth-form">
            {isSignup && <label className="field-label">Full name<div className="auth-input"><span>♙</span><input placeholder="Alex Johnson" value={name} onChange={(event) => setName(event.target.value)} required /></div></label>}
            <label className="field-label">Email address<div className="auth-input"><span>✉</span><input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label>
            <label className="field-label">Password<div className="auth-input"><span>♙</span><input type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '◉' : '◎'}</button></div></label>
            {isSignup
              ? <label className="auth-terms"><input type="checkbox" required /> I agree to the <a href="#" onClick={(event) => event.preventDefault()}>Terms &amp; Conditions</a></label>
              : <div className="auth-options"><label><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} /> Remember me</label><button type="button" onClick={() => notify('Password reset is not available yet. Contact support or use your registered account credentials.')}>Forgot password?</button></div>}
            <Button type="submit" disabled={submitting}>{submitting ? 'Connecting…' : isSignup ? 'Create my free account' : 'Sign in to dashboard'} {!submitting && <span>→</span>}</Button>
          </form>
          <div className="auth-switch">{isSignup ? 'Already have an account?' : 'New to CV Insights?'} <button onClick={() => navigate(isSignup ? '/login' : '/signup')}>{isSignup ? 'Sign in' : 'Create an account'}</button></div>
        </section>
      </div>
      <div className="auth-footer">© 2026 CV Insights <span>Privacy</span><span>Terms</span></div>
    </div>
  );
}

export default App;
