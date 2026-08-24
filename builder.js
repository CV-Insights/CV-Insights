

document.addEventListener('DOMContentLoaded', () => {

    const COLOR_PALETTES = {
        purple: { primary: '#5B5FEF', light: '#EEF1FF' },
        blue: { primary: '#2563EB', light: '#EEF2FF' },
        emerald: { primary: '#059669', light: '#ECFDF5' },
        indigo: { primary: '#4F46E5', light: '#EEF2FF' },
        crimson: { primary: '#DC2626', light: '#FEF2F2' },
        slate: { primary: '#1E293B', light: '#F1F5F9' },
        teal: { primary: '#0D9488', light: '#F0FDFA' }
    };

    const ACTION_VERBS = [
        'spearheaded', 'architected', 'optimized', 'engineered', 'accelerated',
        'automated', 'orchestrated', 'revamped', 'deployed', 'built',
        'designed', 'developed', 'scaled', 'implemented', 'reduced',
        'increased', 'boosted', 'led', 'delivered', 'integrated'
    ];

    const AI_SUMMARIES = {
        swe: 'Results-oriented Senior Software Engineer with 5+ years of experience designing high-availability distributed systems, RESTful microservices, and reactive web applications. Proven track record of optimizing database queries and boosting application throughput by 40%.',
        frontend: 'Creative Frontend Engineer specialized in React, Next.js, and TypeScript. Passionate about building accessible, pixel-perfect user interfaces with 99.9% test coverage and lightning-fast Core Web Vitals.',
        fullstack: 'Versatile Full Stack Systems Architect with expertise in Node.js, Python, PostgreSQL, and cloud infrastructure (AWS/GCP). Experienced in leading agile engineering teams from concept to enterprise-scale deployment.',
        devops: 'Cloud & DevOps Engineer with extensive hands-on experience in Kubernetes, Docker, Terraform, and CI/CD pipelines. Dedicated to automating infrastructure, minimizing downtime, and reducing cloud spend by 30%.',
        product: 'Strategic Technical Product Manager with background in software architecture and user-centric product discovery. Successfully launched 4 SaaS products generating $5M+ ARR and scaled user adoption by 180%.',
        grad: 'Ambitious Computer Science Graduate with strong foundations in algorithms, data structures, full stack web development, and cloud computing. Fast learner with published hackathon projects and open-source contributions.'
    };

    const SAMPLE_DATA = {
        docTitle: 'John_Anderson_FullStack_Resume',
        settings: {
            template: 'modern-tech',
            color: 'purple',
            font: 'Poppins, sans-serif',
            density: 'normal',
            zoom: 100
        },
        personal: {
            fullName: 'Alex Morgan',
            jobTitle: 'Senior Full Stack Software Engineer',
            email: 'alex.morgan@email.com',
            phone: '+1 (555) 349-2041',
            location: 'San Francisco, CA',
            website: 'alexmorgan.dev',
            linkedIn: 'linkedin.com/in/alexmorgan',
            gitHub: 'github.com/alexmorgan'
        },
        summary: 'Accomplished Full Stack Software Engineer with 6+ years of experience architecting scalable distributed systems and web platforms. Expert in React, Node.js, TypeScript, and AWS. Proven track record of boosting system performance by 45% and leading cross-functional agile teams to deliver $10M+ enterprise products.',
        experience: [
            {
                id: 'exp-1',
                title: 'Senior Software Engineer',
                company: 'TechSphere Cloud Solutions',
                location: 'San Francisco, CA',
                startDate: '2022',
                endDate: 'Present',
                isCurrent: true,
                bullets: [
                    'Architected and deployed event-driven microservices architecture handling 20M+ daily requests with 99.99% uptime.',
                    'Engineered real-time collaboration canvas in React & WebSockets, decreasing latency by 65% for 150,000+ active users.',
                    'Optimized PostgreSQL query execution plans, reducing server compute costs by $38,000 annually.'
                ]
            },
            {
                id: 'exp-2',
                title: 'Full Stack Engineer',
                company: 'Nexus Digital Labs',
                location: 'Austin, TX',
                startDate: '2019',
                endDate: '2022',
                isCurrent: false,
                bullets: [
                    'Built modern SaaS analytics dashboard using React, Next.js, and GraphQL, increasing user engagement by 42%.',
                    'Spearheaded automated CI/CD deployment pipelines on AWS ECS, slashing deployment cycle times from 4 hours to 12 minutes.',
                    'Mentored 5 junior developers and introduced automated Jest & Cypress end-to-end testing standards.'
                ]
            }
        ],
        education: [
            {
                id: 'edu-1',
                degree: 'B.S. in Computer Science',
                school: 'University of California, Berkeley',
                location: 'Berkeley, CA',
                gradYear: '2019',
                gpa: 'GPA 3.85 / 4.0 • Magna Cum Laude'
            }
        ],
        skills: {
            tech: ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'GraphQL', 'Next.js', 'PostgreSQL'],
            tools: ['AWS', 'Docker', 'Kubernetes', 'Redis', 'Git', 'Terraform', 'CI/CD', 'Kafka'],
            soft: ['System Architecture', 'Agile / Scrum', 'Team Leadership', 'Code Review', 'Cross-functional Collaboration']
        },
        projects: [
            {
                id: 'proj-1',
                name: 'AI Resume & ATS Optimizer',
                tech: 'React, Node.js, Python, OpenAI API',
                liveUrl: 'https://cvinsights.io',
                gitHubUrl: 'https://github.com/alexmorgan/cvinsights',
                bullets: [
                    'Built AI-powered parsing engine processing 30k+ resumes with real-time keyword and grammar scoring.',
                    'Integrated vector similarity search matching candidate skills to job descriptions with 96% accuracy.'
                ]
            }
        ],
        certs: [
            {
                id: 'cert-1',
                name: 'AWS Certified Solutions Architect – Associate',
                issuer: 'Amazon Web Services',
                date: '2023',
                url: 'aws.amazon.com/verify'
            }
        ]
    };

    let resumeData = loadFromLocalStorage() || JSON.parse(JSON.stringify(SAMPLE_DATA));

    // Parse URL query params (e.g. ?template=clean-minimalist&color=emerald)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('template')) {
        resumeData.settings.template = urlParams.get('template');
    }
    if (urlParams.has('color')) {
        resumeData.settings.color = urlParams.get('color');
    }

    // DOM Elements
    const resumeDocTitle = document.getElementById('resumeDocTitle');
    const templateSelector = document.getElementById('templateSelector');
    const fontSelector = document.getElementById('fontSelector');
    const resumeDocument = document.getElementById('resumeDocument');
    const zoomLabel = document.getElementById('zoomLabel');
    const saveStatus = document.getElementById('saveStatus');

    // Live Input Elements
    const inputFullName = document.getElementById('inputFullName');
    const inputJobTitle = document.getElementById('inputJobTitle');
    const inputEmail = document.getElementById('inputEmail');
    const inputPhone = document.getElementById('inputPhone');
    const inputLocation = document.getElementById('inputLocation');
    const inputWebsite = document.getElementById('inputWebsite');
    const inputLinkedIn = document.getElementById('inputLinkedIn');
    const inputGitHub = document.getElementById('inputGitHub');
    const inputSummary = document.getElementById('inputSummary');

    // Repeater Containers
    const experienceList = document.getElementById('experienceList');
    const educationList = document.getElementById('educationList');
    const projectsList = document.getElementById('projectsList');
    const certsList = document.getElementById('certsList');

    // Tags Elements
    const techSkillsTagsList = document.getElementById('techSkillsTagsList');
    const inputTechSkills = document.getElementById('inputTechSkills');
    const toolsTagsList = document.getElementById('toolsTagsList');
    const inputTools = document.getElementById('inputTools');
    const softSkillsTagsList = document.getElementById('softSkillsTagsList');
    const inputSoftSkills = document.getElementById('inputSoftSkills');

    // ATS Drawer Elements
    const atsScoreWidgetBtn = document.getElementById('atsScoreWidgetBtn');
    const atsDrawer = document.getElementById('atsDrawer');
    const atsDrawerOverlay = document.getElementById('atsDrawerOverlay');
    const atsDrawerClose = document.getElementById('atsDrawerClose');
    const topbarAtsNumber = document.getElementById('topbarAtsNumber');
    const atsStatusLabel = document.getElementById('atsStatusLabel');
    const drawerScoreBig = document.getElementById('drawerScoreBig');
    const drawerScoreHeading = document.getElementById('drawerScoreHeading');

   
    function init() {
        populateFormFromState();
        renderAllRepeaters();
        renderAllTags();
        applyThemeStyles();
        renderResumeCanvas();
        calculateATSScore();

        attachEventListeners();
    }

    function populateFormFromState() {
        resumeDocTitle.value = resumeData.docTitle || 'My_Resume';
        templateSelector.value = resumeData.settings.template || 'modern-tech';
        fontSelector.value = resumeData.settings.font || 'Poppins, sans-serif';

        // 1. Template Visual Cards
        document.querySelectorAll('#templateVisualGrid .tpl-select-card').forEach(card => {
            if (card.dataset.template === (resumeData.settings.template || 'modern-tech')) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // 2. Color Swatches
        document.querySelectorAll('#builderColorPicker .color-swatch-box').forEach(box => {
            if (box.dataset.color === (resumeData.settings.color || 'purple')) {
                box.classList.add('active');
            } else {
                box.classList.remove('active');
            }
        });

        // 3. Font Pills
        document.querySelectorAll('#fontVisualGrid .font-pill-btn').forEach(pill => {
            if (pill.dataset.font === (resumeData.settings.font || 'Poppins, sans-serif')) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        // 4. Density Toggles
        document.querySelectorAll('#densityToggles .density-btn').forEach(btn => {
            if (btn.dataset.density === (resumeData.settings.density || 'normal')) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Personal
        inputFullName.value = resumeData.personal.fullName || '';
        inputJobTitle.value = resumeData.personal.jobTitle || '';
        inputEmail.value = resumeData.personal.email || '';
        inputPhone.value = resumeData.personal.phone || '';
        inputLocation.value = resumeData.personal.location || '';
        inputWebsite.value = resumeData.personal.website || '';
        inputLinkedIn.value = resumeData.personal.linkedIn || '';
        inputGitHub.value = resumeData.personal.gitHub || '';

        // Summary
        inputSummary.value = resumeData.summary || '';
    }


    function renderAllRepeaters() {
        renderExperienceItems();
        renderEducationItems();
        renderProjectsItems();
        renderCertsItems();
    }

  
    function renderExperienceItems() {
        experienceList.innerHTML = resumeData.experience.map((exp, index) => `
            <div class="repeater-card" data-id="${exp.id}">
                <div class="repeater-card-head">
                    <div class="repeater-title-text">
                        <i class="fa-solid fa-briefcase"></i>
                        <span>${exp.title ? exp.title + (exp.company ? ' at ' + exp.company : '') : 'Position #' + (index + 1)}</span>
                    </div>
                    <button type="button" class="btn-remove-item" onclick="removeExperience('${exp.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="repeater-card-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Job Title</label>
                            <input type="text" class="form-control" value="${exp.title || ''}" placeholder="e.g. Senior Software Engineer" oninput="updateExpField('${exp.id}', 'title', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Company / Organization</label>
                            <input type="text" class="form-control" value="${exp.company || ''}" placeholder="e.g. Google" oninput="updateExpField('${exp.id}', 'company', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" class="form-control" value="${exp.location || ''}" placeholder="e.g. Mountain View, CA" oninput="updateExpField('${exp.id}', 'location', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Timeline / Dates</label>
                            <div style="display:flex;gap:8px;">
                                <input type="text" class="form-control" value="${exp.startDate || ''}" placeholder="Start (e.g. 2021)" oninput="updateExpField('${exp.id}', 'startDate', this.value)">
                                <input type="text" class="form-control" value="${exp.endDate || ''}" placeholder="End (e.g. Present)" oninput="updateExpField('${exp.id}', 'endDate', this.value)">
                            </div>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 8px;">
                        <label>Accomplishment Bullets (Quantify results!)</label>
                        <div class="bullets-group">
                            ${(exp.bullets || []).map((b, bIdx) => `
                                <div class="bullet-item">
                                    <input type="text" class="form-control" value="${escapeHtml(b)}" placeholder="e.g. Spearheaded microservice rebuild boosting latency by 35%..." oninput="updateExpBullet('${exp.id}', ${bIdx}, this.value)">
                                    <button type="button" class="btn-del-bullet" onclick="deleteExpBullet('${exp.id}', ${bIdx})"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            `).join('')}
                            <button type="button" class="btn-add-bullet" onclick="addExpBullet('${exp.id}')">
                                <i class="fa-solid fa-plus"></i> Add Bullet Point
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }


    function renderEducationItems() {
        educationList.innerHTML = resumeData.education.map((edu, index) => `
            <div class="repeater-card" data-id="${edu.id}">
                <div class="repeater-card-head">
                    <div class="repeater-title-text">
                        <i class="fa-solid fa-graduation-cap"></i>
                        <span>${edu.degree ? edu.degree + (edu.school ? ' - ' + edu.school : '') : 'Degree #' + (index + 1)}</span>
                    </div>
                    <button type="button" class="btn-remove-item" onclick="removeEducation('${edu.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="repeater-card-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Degree & Major</label>
                            <input type="text" class="form-control" value="${edu.degree || ''}" placeholder="e.g. B.S. in Computer Science" oninput="updateEduField('${edu.id}', 'degree', this.value)">
                        </div>
                        <div class="form-group">
                            <label>University / School</label>
                            <input type="text" class="form-control" value="${edu.school || ''}" placeholder="e.g. Stanford University" oninput="updateEduField('${edu.id}', 'school', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Location</label>
                            <input type="text" class="form-control" value="${edu.location || ''}" placeholder="e.g. Stanford, CA" oninput="updateEduField('${edu.id}', 'location', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Graduation Year</label>
                            <input type="text" class="form-control" value="${edu.gradYear || ''}" placeholder="e.g. 2020" oninput="updateEduField('${edu.id}', 'gradYear', this.value)">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label>GPA / Honors / Coursework</label>
                            <input type="text" class="form-control" value="${edu.gpa || ''}" placeholder="e.g. GPA 3.9 / 4.0 • Dean's Honors List" oninput="updateEduField('${edu.id}', 'gpa', this.value)">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }


    function renderProjectsItems() {
        projectsList.innerHTML = resumeData.projects.map((proj, index) => `
            <div class="repeater-card" data-id="${proj.id}">
                <div class="repeater-card-head">
                    <div class="repeater-title-text">
                        <i class="fa-solid fa-rocket"></i>
                        <span>${proj.name || 'Project #' + (index + 1)}</span>
                    </div>
                    <button type="button" class="btn-remove-item" onclick="removeProject('${proj.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="repeater-card-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Project Title</label>
                            <input type="text" class="form-control" value="${proj.name || ''}" placeholder="e.g. Real-Time Chat App" oninput="updateProjField('${proj.id}', 'name', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Tech Stack</label>
                            <input type="text" class="form-control" value="${proj.tech || ''}" placeholder="e.g. React, WebSockets, Node.js" oninput="updateProjField('${proj.id}', 'tech', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Live URL</label>
                            <input type="text" class="form-control" value="${proj.liveUrl || ''}" placeholder="e.g. https://myapp.com" oninput="updateProjField('${proj.id}', 'liveUrl', this.value)">
                        </div>
                        <div class="form-group">
                            <label>GitHub Repository</label>
                            <input type="text" class="form-control" value="${proj.gitHubUrl || ''}" placeholder="e.g. github.com/user/repo" oninput="updateProjField('${proj.id}', 'gitHubUrl', this.value)">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 8px;">
                        <label>Description Bullets</label>
                        <div class="bullets-group">
                            ${(proj.bullets || []).map((b, bIdx) => `
                                <div class="bullet-item">
                                    <input type="text" class="form-control" value="${escapeHtml(b)}" placeholder="Key highlight or metric..." oninput="updateProjBullet('${proj.id}', ${bIdx}, this.value)">
                                    <button type="button" class="btn-del-bullet" onclick="deleteProjBullet('${proj.id}', ${bIdx})"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            `).join('')}
                            <button type="button" class="btn-add-bullet" onclick="addProjBullet('${proj.id}')">
                                <i class="fa-solid fa-plus"></i> Add Bullet Point
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    
    function renderCertsItems() {
        certsList.innerHTML = resumeData.certs.map((cert, index) => `
            <div class="repeater-card" data-id="${cert.id}">
                <div class="repeater-card-head">
                    <div class="repeater-title-text">
                        <i class="fa-solid fa-certificate"></i>
                        <span>${cert.name || 'Certification #' + (index + 1)}</span>
                    </div>
                    <button type="button" class="btn-remove-item" onclick="removeCert('${cert.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="repeater-card-body">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label>Certification Name</label>
                            <input type="text" class="form-control" value="${cert.name || ''}" placeholder="e.g. AWS Solutions Architect" oninput="updateCertField('${cert.id}', 'name', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Issuing Organization</label>
                            <input type="text" class="form-control" value="${cert.issuer || ''}" placeholder="e.g. Amazon Web Services" oninput="updateCertField('${cert.id}', 'issuer', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Issue Date / Year</label>
                            <input type="text" class="form-control" value="${cert.date || ''}" placeholder="e.g. 2023" oninput="updateCertField('${cert.id}', 'date', this.value)">
                        </div>
                        <div class="form-group">
                            <label>Credential Verification URL</label>
                            <input type="text" class="form-control" value="${cert.url || ''}" placeholder="e.g. verify.link/abc" oninput="updateCertField('${cert.id}', 'url', this.value)">
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderAllTags() {
        renderTagCategory('tech', techSkillsTagsList, resumeData.skills.tech);
        renderTagCategory('tools', toolsTagsList, resumeData.skills.tools);
        renderTagCategory('soft', softSkillsTagsList, resumeData.skills.soft);
    }

    function renderTagCategory(cat, container, list) {
        container.innerHTML = (list || []).map((tag, idx) => `
            <span class="skill-tag">
                ${escapeHtml(tag)}
                <i class="fa-solid fa-xmark" onclick="removeSkillTag('${cat}', ${idx})"></i>
            </span>
        `).join('');
    }

    window.removeSkillTag = function(cat, idx) {
        resumeData.skills[cat].splice(idx, 1);
        renderAllTags();
        onStateChange();
    };

    function addSkillTag(cat, inputElem) {
        const val = inputElem.value.trim();
        if (val) {
            // Split if comma separated
            const items = val.split(',').map(s => s.trim()).filter(Boolean);
            items.forEach(item => {
                if (!resumeData.skills[cat].includes(item)) {
                    resumeData.skills[cat].push(item);
                }
            });
            inputElem.value = '';
            renderAllTags();
            onStateChange();
        }
    }

    inputTechSkills.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkillTag('tech', inputTechSkills);
        }
    });

    inputTools.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkillTag('tools', inputTools);
        }
    });

    inputSoftSkills.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkillTag('soft', inputSoftSkills);
        }
    });

    window.updateExpField = (id, field, val) => {
        const item = resumeData.experience.find(e => e.id === id);
        if (item) { item[field] = val; onStateChange(); }
    };
    window.updateExpBullet = (id, idx, val) => {
        const item = resumeData.experience.find(e => e.id === id);
        if (item && item.bullets) { item.bullets[idx] = val; onStateChange(); }
    };
    window.addExpBullet = (id) => {
        const item = resumeData.experience.find(e => e.id === id);
        if (item) { item.bullets.push(''); renderExperienceItems(); onStateChange(); }
    };
    window.deleteExpBullet = (id, idx) => {
        const item = resumeData.experience.find(e => e.id === id);
        if (item) { item.bullets.splice(idx, 1); renderExperienceItems(); onStateChange(); }
    };
    window.removeExperience = (id) => {
        resumeData.experience = resumeData.experience.filter(e => e.id !== id);
        renderExperienceItems();
        onStateChange();
    };

    window.updateEduField = (id, field, val) => {
        const item = resumeData.education.find(e => e.id === id);
        if (item) { item[field] = val; onStateChange(); }
    };
    window.removeEducation = (id) => {
        resumeData.education = resumeData.education.filter(e => e.id !== id);
        renderEducationItems();
        onStateChange();
    };

    window.updateProjField = (id, field, val) => {
        const item = resumeData.projects.find(p => p.id === id);
        if (item) { item[field] = val; onStateChange(); }
    };
    window.updateProjBullet = (id, idx, val) => {
        const item = resumeData.projects.find(p => p.id === id);
        if (item && item.bullets) { item.bullets[idx] = val; onStateChange(); }
    };
    window.addProjBullet = (id) => {
        const item = resumeData.projects.find(p => p.id === id);
        if (item) { item.bullets.push(''); renderProjectsItems(); onStateChange(); }
    };
    window.deleteProjBullet = (id, idx) => {
        const item = resumeData.projects.find(p => p.id === id);
        if (item) { item.bullets.splice(idx, 1); renderProjectsItems(); onStateChange(); }
    };
    window.removeProject = (id) => {
        resumeData.projects = resumeData.projects.filter(p => p.id !== id);
        renderProjectsItems();
        onStateChange();
    };

    window.updateCertField = (id, field, val) => {
        const item = resumeData.certs.find(c => c.id === id);
        if (item) { item[field] = val; onStateChange(); }
    };
    window.removeCert = (id) => {
        resumeData.certs = resumeData.certs.filter(c => c.id !== id);
        renderCertsItems();
        onStateChange();
    };

    // Add Item Buttons
    document.getElementById('addExperienceBtn').addEventListener('click', () => {
        const newId = 'exp-' + Date.now();
        resumeData.experience.unshift({
            id: newId,
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bullets: ['']
        });
        renderExperienceItems();
        onStateChange();
    });

    document.getElementById('addEducationBtn').addEventListener('click', () => {
        const newId = 'edu-' + Date.now();
        resumeData.education.unshift({
            id: newId,
            degree: '',
            school: '',
            location: '',
            gradYear: '',
            gpa: ''
        });
        renderEducationItems();
        onStateChange();
    });

    document.getElementById('addProjectBtn').addEventListener('click', () => {
        const newId = 'proj-' + Date.now();
        resumeData.projects.unshift({
            id: newId,
            name: '',
            tech: '',
            liveUrl: '',
            gitHubUrl: '',
            bullets: ['']
        });
        renderProjectsItems();
        onStateChange();
    });

    document.getElementById('addCertBtn').addEventListener('click', () => {
        const newId = 'cert-' + Date.now();
        resumeData.certs.unshift({
            id: newId,
            name: '',
            issuer: '',
            date: '',
            url: ''
        });
        renderCertsItems();
        onStateChange();
    });

    // ==========================================
    // THEME & STYLES APPLICATION
    // ==========================================
    function applyThemeStyles() {
        const colorKey = resumeData.settings.color || 'blue';
        const colorConfig = COLOR_PALETTES[colorKey] || COLOR_PALETTES.blue;

        document.documentElement.style.setProperty('--resume-theme', colorConfig.primary);
        document.documentElement.style.setProperty('--resume-theme-light', colorConfig.light);
        document.documentElement.style.setProperty('--resume-font', resumeData.settings.font || 'Poppins, sans-serif');

        // Apply zoom
        const zoom = resumeData.settings.zoom || 100;
        resumeDocument.style.transform = `scale(${zoom / 100})`;
        zoomLabel.textContent = `${zoom}%`;
    }

    // ==========================================
    // A4 RESUME RENDERER
    // ==========================================
    function renderResumeCanvas() {
        const tpl = resumeData.settings.template || 'modern-tech';
        const p = resumeData.personal || {};

        // Contacts row
        const contactsList = [];
        if (p.email) contactsList.push(`<span><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</span>`);
        if (p.phone) contactsList.push(`<span><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</span>`);
        if (p.location) contactsList.push(`<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</span>`);
        if (p.linkedIn) contactsList.push(`<span><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedIn)}</span>`);
        if (p.gitHub) contactsList.push(`<span><i class="fa-brands fa-github"></i> ${escapeHtml(p.gitHub)}</span>`);
        if (p.website) contactsList.push(`<span><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website)}</span>`);

        const contactsHTML = contactsList.join('');

        // Summary block
        const summaryHTML = resumeData.summary ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-user"></i> Professional Summary</div>
                <p style="font-size: 11.5px; color: #334155; line-height: 1.55;">${escapeHtml(resumeData.summary)}</p>
            </div>
        ` : '';

        // Experience block
        const expHTML = resumeData.experience.length ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
                ${resumeData.experience.map(exp => `
                    <div class="doc-item">
                        <div class="doc-item-head">
                            <div>
                                <span class="doc-item-title">${escapeHtml(exp.title || 'Position')}</span>
                                ${exp.company ? `<span class="doc-item-subtitle"> • ${escapeHtml(exp.company)}</span>` : ''}
                            </div>
                            <span class="doc-item-date">${escapeHtml(exp.startDate || '')} ${exp.endDate ? '- ' + escapeHtml(exp.endDate) : ''} ${exp.location ? ' | ' + escapeHtml(exp.location) : ''}</span>
                        </div>
                        ${(exp.bullets && exp.bullets.filter(Boolean).length) ? `
                            <ul class="doc-bullet-list">
                                ${exp.bullets.filter(Boolean).map(b => `<li class="doc-bullet-item">${escapeHtml(b)}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Education block
        const eduHTML = resumeData.education.length ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
                ${resumeData.education.map(edu => `
                    <div class="doc-item">
                        <div class="doc-item-head">
                            <div>
                                <span class="doc-item-title">${escapeHtml(edu.degree || 'Degree')}</span>
                                ${edu.school ? `<span class="doc-item-subtitle"> • ${escapeHtml(edu.school)}</span>` : ''}
                            </div>
                            <span class="doc-item-date">${escapeHtml(edu.gradYear || '')} ${edu.location ? ' | ' + escapeHtml(edu.location) : ''}</span>
                        </div>
                        ${edu.gpa ? `<div style="font-size:11px;color:#64748B;margin-top:2px;">${escapeHtml(edu.gpa)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Skills block
        const allSkills = [
            ...(resumeData.skills.tech || []),
            ...(resumeData.skills.tools || []),
            ...(resumeData.skills.soft || [])
        ];
        const skillsHTML = allSkills.length ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-code"></i> Skills & Competencies</div>
                <div class="doc-skills-group">
                    ${allSkills.map(s => `<span class="doc-skill-pill">${escapeHtml(s)}</span>`).join('')}
                </div>
            </div>
        ` : '';

        // Projects block
        const projHTML = resumeData.projects.length ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-rocket"></i> Projects</div>
                ${resumeData.projects.map(proj => `
                    <div class="doc-item">
                        <div class="doc-item-head">
                            <div>
                                <span class="doc-item-title">${escapeHtml(proj.name || 'Project Title')}</span>
                                ${proj.tech ? `<span style="font-size:11.5px;color:#64748B;"> (${escapeHtml(proj.tech)})</span>` : ''}
                            </div>
                            <span class="doc-item-date">${proj.liveUrl || proj.gitHubUrl || ''}</span>
                        </div>
                        ${(proj.bullets && proj.bullets.filter(Boolean).length) ? `
                            <ul class="doc-bullet-list">
                                ${proj.bullets.filter(Boolean).map(b => `<li class="doc-bullet-item">${escapeHtml(b)}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Certs block
        const certsHTML = resumeData.certs.length ? `
            <div class="doc-section">
                <div class="doc-sec-title"><i class="fa-solid fa-certificate"></i> Certifications</div>
                ${resumeData.certs.map(cert => `
                    <div class="doc-item" style="margin-bottom:6px;">
                        <div class="doc-item-head">
                            <span class="doc-item-title">${escapeHtml(cert.name || 'Certification')} ${cert.issuer ? '• ' + escapeHtml(cert.issuer) : ''}</span>
                            <span class="doc-item-date">${escapeHtml(cert.date || '')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '';

        // Set layout classes on root document
        resumeDocument.className = `a4-document-page tpl-${tpl} density-${resumeData.settings.density || 'normal'}`;

        // Template Layout Rendering
        if (tpl === 'creative-studio') {
            resumeDocument.innerHTML = `
                <div class="sidebar-col">
                    <div class="doc-name">${escapeHtml(p.fullName || 'Your Name')}</div>
                    <div class="doc-jobtitle">${escapeHtml(p.jobTitle || 'Your Job Title')}</div>
                    <div class="doc-sec-title">CONTACT</div>
                    <div class="doc-contacts">${contactsHTML}</div>
                    <div class="doc-sec-title">SKILLS</div>
                    <div class="doc-skills-group" style="gap:4px;">
                        ${allSkills.map(s => `<span class="doc-skill-pill" style="background:rgba(255,255,255,0.15);color:#fff">${escapeHtml(s)}</span>`).join('')}
                    </div>
                    ${eduHTML ? `<div style="margin-top:16px;">${eduHTML}</div>` : ''}
                </div>
                <div class="main-col">
                    ${summaryHTML}
                    ${expHTML}
                    ${projHTML}
                    ${certsHTML}
                </div>
            `;
        } else {
            // Standard / Minimalist / Executive Layouts
            resumeDocument.innerHTML = `
                <div class="doc-header">
                    <div class="doc-name">${escapeHtml(p.fullName || 'Your Name')}</div>
                    <div class="doc-jobtitle">${escapeHtml(p.jobTitle || 'Your Job Title / Specialization')}</div>
                    <div class="doc-contacts">${contactsHTML}</div>
                </div>
                ${summaryHTML}
                ${skillsHTML}
                ${expHTML}
                ${eduHTML}
                ${projHTML}
                ${certsHTML}
            `;
        }
    }

    // ==========================================
    // DYNAMIC ATS SCORE CALCULATION
    // ==========================================
    function calculateATSScore() {
        let score = 0;
        const p = resumeData.personal || {};

        // 1. Contact Info (20 pts)
        if (p.fullName && p.email) score += 10;
        if (p.phone || p.location) score += 5;
        if (p.linkedIn || p.gitHub || p.website) score += 5;

        // 2. Summary (15 pts)
        if (resumeData.summary && resumeData.summary.length > 50) score += 15;

        // 3. Work Experience & Bullets (25 pts)
        if (resumeData.experience.length > 0) {
            score += 10;
            const allBullets = resumeData.experience.flatMap(e => e.bullets || []).filter(Boolean);
            if (allBullets.length >= 3) score += 15;
        }

        // 4. Measurable Numbers (%, $, figures) (15 pts)
        const fullText = JSON.stringify(resumeData);
        const hasNumbers = /\d+%|\$\d+|\d+\+|\d+k|\d+M/i.test(fullText);
        if (hasNumbers) score += 15;

        // 5. Action Verbs (15 pts)
        let foundVerbsCount = 0;
        ACTION_VERBS.forEach(verb => {
            if (new RegExp('\\b' + verb, 'i').test(fullText)) {
                foundVerbsCount++;
            }
        });
        if (foundVerbsCount >= 2) score += 15;
        else if (foundVerbsCount === 1) score += 8;

        // 6. Skills Density (10 pts)
        const totalSkills = (resumeData.skills.tech.length + resumeData.skills.tools.length + resumeData.skills.soft.length);
        if (totalSkills >= 6) score += 10;
        else if (totalSkills >= 3) score += 5;

        // Clamp between 20 and 99
        score = Math.min(Math.max(score, 25), 99);

        // Update Topbar and Drawer UI
        topbarAtsNumber.textContent = `${score}%`;
        drawerScoreBig.textContent = `${score}%`;

        let status = 'Good';
        if (score >= 90) status = 'Excellent';
        else if (score >= 75) status = 'Strong';
        else if (score >= 50) status = 'Moderate';
        else status = 'Needs Work';

        atsStatusLabel.textContent = status;
        drawerScoreHeading.textContent = `${status} ATS Profile`;
    }

    // ==========================================
    // STATE CHANGE & STORAGE
    // ==========================================
    function onStateChange() {
        saveToLocalStorage();
        renderResumeCanvas();
        calculateATSScore();
        triggerSavedIndicator();
    }

    function saveToLocalStorage() {
        try {
            localStorage.setItem('cv_insights_builder_state', JSON.stringify(resumeData));
        } catch (e) {
            console.error('Storage error:', e);
        }
    }

    function loadFromLocalStorage() {
        try {
            const item = localStorage.getItem('cv_insights_builder_state');
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    }

    function triggerSavedIndicator() {
        saveStatus.innerHTML = '<i class="fa-solid fa-cloud-check"></i> Saved';
        saveStatus.style.opacity = '1';
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    function attachEventListeners() {
        // Document Title
        resumeDocTitle.addEventListener('input', (e) => {
            resumeData.docTitle = e.target.value;
            onStateChange();
        });

        // 1. Template Visual Cards Click
        document.querySelectorAll('#templateVisualGrid .tpl-select-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('#templateVisualGrid .tpl-select-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                resumeData.settings.template = card.dataset.template;
                if (templateSelector) templateSelector.value = card.dataset.template;
                onStateChange();
            });
        });

        // Template Selector Dropdown Fallback
        if (templateSelector) {
            templateSelector.addEventListener('change', (e) => {
                resumeData.settings.template = e.target.value;
                document.querySelectorAll('#templateVisualGrid .tpl-select-card').forEach(card => {
                    if (card.dataset.template === e.target.value) card.classList.add('active');
                    else card.classList.remove('active');
                });
                onStateChange();
            });
        }

        // 2. Color Swatch Boxes Click
        document.querySelectorAll('#builderColorPicker .color-swatch-box').forEach(box => {
            box.addEventListener('click', () => {
                document.querySelectorAll('#builderColorPicker .color-swatch-box').forEach(b => b.classList.remove('active'));
                box.classList.add('active');
                resumeData.settings.color = box.dataset.color;
                applyThemeStyles();
                renderAllTags();
                onStateChange();
            });
        });

        // 3. Font Visual Pills Click
        document.querySelectorAll('#fontVisualGrid .font-pill-btn').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('#fontVisualGrid .font-pill-btn').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                resumeData.settings.font = pill.dataset.font;
                if (fontSelector) fontSelector.value = pill.dataset.font;
                applyThemeStyles();
                onStateChange();
            });
        });

        // Font Selector Dropdown Fallback
        if (fontSelector) {
            fontSelector.addEventListener('change', (e) => {
                resumeData.settings.font = e.target.value;
                document.querySelectorAll('#fontVisualGrid .font-pill-btn').forEach(pill => {
                    if (pill.dataset.font === e.target.value) pill.classList.add('active');
                    else pill.classList.remove('active');
                });
                applyThemeStyles();
                onStateChange();
            });
        }

        // 4. Density Toggles Click
        document.querySelectorAll('#densityToggles .density-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#densityToggles .density-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                resumeData.settings.density = btn.dataset.density;
                onStateChange();
            });
        });

        // Live Inputs for Personal Info
        const personalInputs = [
            { elem: inputFullName, key: 'fullName' },
            { elem: inputJobTitle, key: 'jobTitle' },
            { elem: inputEmail, key: 'email' },
            { elem: inputPhone, key: 'phone' },
            { elem: inputLocation, key: 'location' },
            { elem: inputWebsite, key: 'website' },
            { elem: inputLinkedIn, key: 'linkedIn' },
            { elem: inputGitHub, key: 'gitHub' }
        ];

        personalInputs.forEach(({ elem, key }) => {
            if (elem) {
                elem.addEventListener('input', (e) => {
                    resumeData.personal[key] = e.target.value;
                    onStateChange();
                });
            }
        });

        // Summary Input
        if (inputSummary) {
            inputSummary.addEventListener('input', (e) => {
                resumeData.summary = e.target.value;
                onStateChange();
            });
        }

        // AI Summary Chips
        document.querySelectorAll('.ai-chip, .ai-pill').forEach(chip => {
            chip.addEventListener('click', () => {
                const type = chip.dataset.type;
                if (AI_SUMMARIES[type]) {
                    if (inputSummary) inputSummary.value = AI_SUMMARIES[type];
                    resumeData.summary = AI_SUMMARIES[type];
                    onStateChange();
                }
            });
        });

        // Function to switch active tab panel
        function switchTab(tabId) {
            // Update Tab buttons
            document.querySelectorAll('.tab-btn, .tab-item').forEach(b => {
                if (b.dataset.tab === tabId) b.classList.add('active');
                else b.classList.remove('active');
            });

            // Update Tab Panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                if (panel.id === `sec-${tabId}`) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            // Scroll container to top
            const container = document.querySelector('.editor-cards-container');
            if (container) container.scrollTop = 0;
        }

        // Tabs Navigation Click
        document.querySelectorAll('.tab-btn, .tab-item').forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });

        // Step Navigation Buttons (Prev / Next)
        document.querySelectorAll('.btn-step-nav[data-goto]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.goto;
                if (targetTab) switchTab(targetTab);
            });
        });

        // Zoom Controls
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            if (resumeData.settings.zoom < 140) {
                resumeData.settings.zoom += 10;
                applyThemeStyles();
            }
        });

        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            if (resumeData.settings.zoom > 50) {
                resumeData.settings.zoom -= 10;
                applyThemeStyles();
            }
        });

        document.getElementById('zoomFitBtn').addEventListener('click', () => {
            resumeData.settings.zoom = 100;
            applyThemeStyles();
        });

        // Sample Data Button
        document.getElementById('loadSampleBtn').addEventListener('click', () => {
            if (confirm('Load sample tech resume data? This will overwrite your current inputs.')) {
                resumeData = JSON.parse(JSON.stringify(SAMPLE_DATA));
                init();
            }
        });

        // Reset Button
        document.getElementById('resetFormBtn').addEventListener('click', () => {
            if (confirm('Reset entire resume form? All entered text will be cleared.')) {
                resumeData = {
                    docTitle: 'My_Resume',
                    settings: { template: 'modern-tech', color: 'blue', font: 'Poppins, sans-serif', zoom: 100 },
                    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedIn: '', gitHub: '' },
                    summary: '',
                    experience: [],
                    education: [],
                    skills: { tech: [], tools: [], soft: [] },
                    projects: [],
                    certs: []
                };
                init();
            }
        });

        // Download / Print PDF
        document.getElementById('downloadPdfBtn').addEventListener('click', () => {
            window.print();
        });

        // ATS Drawer Toggle
        atsScoreWidgetBtn.addEventListener('click', () => {
            atsDrawer.classList.add('active');
            atsDrawerOverlay.classList.add('active');
        });

        atsDrawerClose.addEventListener('click', closeAtsDrawer);
        atsDrawerOverlay.addEventListener('click', closeAtsDrawer);

        function closeAtsDrawer() {
            atsDrawer.classList.remove('active');
            atsDrawerOverlay.classList.remove('active');
        }

        // More Options Dropdown
        const moreOptionsBtn = document.getElementById('moreOptionsBtn');
        const moreDropdownMenu = document.getElementById('moreDropdownMenu');

        moreOptionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreDropdownMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            moreDropdownMenu.classList.remove('show');
        });

        // Export JSON
        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${resumeData.docTitle || 'resume'}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });

        // Import JSON
        const importJsonFile = document.getElementById('importJsonFile');
        document.getElementById('importJsonBtn').addEventListener('click', () => {
            importJsonFile.click();
        });

        importJsonFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        resumeData = imported;
                        init();
                        alert('Resume data imported successfully!');
                    } catch (err) {
                        alert('Invalid JSON file format.');
                    }
                };
                reader.readAsText(file);
            }
        });

        document.getElementById('viewTemplatesBtn').addEventListener('click', () => {
            window.location.href = 'templates.html';
        });
    }

    // Helper: HTML escape
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Start App
    init();
});
