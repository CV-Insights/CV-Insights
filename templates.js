/* ==================================================
            CV INSIGHTS - RESUME TEMPLATES JS
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 40
        });
    }

    // Color definitions
    const COLOR_PALETTES = {
        purple: '#5B5FEF',
        blue: '#2563EB',
        emerald: '#059669',
        indigo: '#4F46E5',
        crimson: '#DC2626',
        slate: '#1E293B',
        teal: '#0D9488'
    };

    // Templates Master Data
    const TEMPLATES_DATA = [
        {
            id: 'modern-tech',
            title: 'Modern Tech Pro',
            category: 'tech',
            categoryName: 'Tech & Software',
            description: 'Structured two-tone design engineered for software engineers, devops, and cloud architects. Prioritizes tech stack visibility and project impact.',
            atsScore: 99,
            tag: 'Top Rated',
            isFeatured: true,
            layout: 'standard',
            defaultColor: 'blue',
            highlights: [
                'Optimized for technical keyword parsers',
                'Dual-tier tech stack & framework matrix',
                'Impact-first metric bullet points',
                'GitHub, LinkedIn & Portfolio recognition'
            ]
        },
        {
            id: 'clean-minimalist',
            title: 'Clean Minimalist',
            category: 'minimalist',
            categoryName: 'Simple / Minimalist',
            description: 'Zero clutter, laser-focused single column layout. Universally compatible with 100% of legacy and modern ATS parsing algorithms.',
            atsScore: 100,
            tag: '100% ATS',
            isFeatured: true,
            layout: 'minimal',
            defaultColor: 'slate',
            highlights: [
                '100% Linear ATS parser pass guarantee',
                'Crisp hierarchical typography',
                'Ideal for all experience levels & industries',
                'Print-perfect monochrome & color balance'
            ]
        },
        {
            id: 'executive-suite',
            title: 'Executive Suite',
            category: 'executive',
            categoryName: 'Executive',
            description: 'Sophisticated format for senior leaders, VPs, and directors. Highlights leadership achievements, revenue growth metrics, and board credentials.',
            atsScore: 98,
            tag: 'Leadership',
            isFeatured: false,
            layout: 'standard',
            defaultColor: 'indigo',
            highlights: [
                'Executive summary & competencies header',
                'Revenue & KPI growth highlight areas',
                'Clear chronological career progression',
                'Board memberships & credentials section'
            ]
        },
        {
            id: 'silicon-valley',
            title: 'Silicon Valley Lean',
            category: 'tech',
            categoryName: 'Tech & Software',
            description: 'A compact, high-density format favored by top tier tech companies (FAANG/MAANG) and fast-growing tech startups.',
            atsScore: 97,
            tag: 'Startup Favorite',
            isFeatured: false,
            layout: 'standard',
            defaultColor: 'teal',
            highlights: [
                'High information density without crowding',
                'Prominent GitHub & live project links',
                'Action verb structured bullet points',
                'Compact single-page optimization'
            ]
        },
        {
            id: 'creative-studio',
            title: 'Creative Studio',
            category: 'creative',
            categoryName: 'Creative & Design',
            description: 'Sleek sidebar layout crafted for UI/UX designers, product managers, and creatives while retaining full machine-parsable text markup.',
            atsScore: 95,
            tag: 'Designer Pick',
            isFeatured: false,
            layout: 'sidebar',
            defaultColor: 'indigo',
            highlights: [
                'Structured left sidebar for profile & skills',
                'Design portfolio & Behance/Dribbble links',
                'Clean typography hierarchy',
                'Parsable semantic section headers'
            ]
        },
        {
            id: 'corporate-standard',
            title: 'Corporate Standard',
            category: 'clean',
            categoryName: 'Modern Clean',
            description: 'The definitive corporate standard for finance, consulting, banking, and enterprise operations roles with clean horizontal dividing accents.',
            atsScore: 99,
            tag: 'Enterprise',
            isFeatured: false,
            layout: 'standard',
            defaultColor: 'blue',
            highlights: [
                'Conservative, trusted corporate layout',
                'Standard chronological work timeline',
                'High-contrast professional headers',
                'Perfect for Fortune 500 portals'
            ]
        },
        {
            id: 'compact-onepage',
            title: 'Compact High-Impact',
            category: 'minimalist',
            categoryName: 'Simple / Minimalist',
            description: 'Fit 5+ years of extensive experience into a perfectly proportioned, scannable single page without sacrificing font size or readability.',
            atsScore: 98,
            tag: '1-Page Fit',
            isFeatured: false,
            layout: 'minimal',
            defaultColor: 'emerald',
            highlights: [
                'Space-efficient horizontal skill bars',
                'Concise bullet spacing system',
                'Zero wasted white-space margin layout',
                'High recruiter scanability index'
            ]
        },
        {
            id: 'fresh-graduate',
            title: 'Academic & Entry Level',
            category: 'entry',
            categoryName: 'Student / Entry Level',
            description: 'Specially structured for university graduates and career switchers. Gives top priority to education, coursework, hackathons, and projects.',
            atsScore: 99,
            tag: 'Graduate',
            isFeatured: false,
            layout: 'standard',
            defaultColor: 'crimson',
            highlights: [
                'Prominent education & honors showcase',
                'Academic projects & coursework slots',
                'Internships & campus leadership highlights',
                'Certification & technical toolkit badges'
            ]
        }
    ];

    // State
    let currentCategory = 'all';
    let searchQuery = '';
    let currentSort = 'popular';
    const activeColors = {}; // Stores chosen color for each template: { templateId: 'blue' }

    // Init active colors
    TEMPLATES_DATA.forEach(t => {
        activeColors[t.id] = t.defaultColor;
    });

    // DOM Elements
    const templatesGrid = document.getElementById('templatesGrid');
    const templateCount = document.getElementById('templateCount');
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('templateSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const sortSelect = document.getElementById('sortSelect');
    const filterPills = document.querySelectorAll('.filter-pill');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    // Modal DOM Elements
    const previewModal = document.getElementById('previewModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalResumePreview = document.getElementById('modalResumePreview');
    const modalTemplateTitle = document.getElementById('modalTemplateTitle');
    const modalTemplateDesc = document.getElementById('modalTemplateDesc');
    const modalCategoryBadge = document.getElementById('modalCategoryBadge');
    const modalScoreText = document.getElementById('modalScoreText');
    const modalScoreCircle = document.getElementById('modalScoreCircle');
    const modalHighlightsList = document.getElementById('modalHighlightsList');
    const modalColorSwatches = document.getElementById('modalColorSwatches');
    const modalUseTemplateBtn = document.getElementById('modalUseTemplateBtn');

    let activeModalTemplateId = null;


    function generateMiniResumeHTML(template, colorKey, isModal = false) {
        const hex = COLOR_PALETTES[colorKey] || COLOR_PALETTES.blue;
        const styleAttr = `style="--card-accent: ${hex};"`;

        if (template.layout === 'sidebar') {
            return `
                <div class="mini-resume layout-sidebar" ${styleAttr}>
                    <div class="mini-left-col">
                        <div class="mini-name">ALEX MORGAN</div>
                        <div class="mini-title">Senior UI/UX Engineer</div>
                        <div class="mini-section-title">CONTACT</div>
                        <div class="mini-bullet">alex@cvinsights.io</div>
                        <div class="mini-bullet">San Francisco, CA</div>
                        <div class="mini-bullet">linkedin.com/in/alex</div>
                        <div class="mini-section-title" style="margin-top: 10px;">SKILLS</div>
                        <div class="mini-skills">
                            <span class="mini-skill-chip" style="background:rgba(255,255,255,0.2);color:#fff">React</span>
                            <span class="mini-skill-chip" style="background:rgba(255,255,255,0.2);color:#fff">TypeScript</span>
                            <span class="mini-skill-chip" style="background:rgba(255,255,255,0.2);color:#fff">Figma</span>
                            <span class="mini-skill-chip" style="background:rgba(255,255,255,0.2);color:#fff">Next.js</span>
                        </div>
                    </div>
                    <div class="mini-right-col">
                        <div class="mini-section-title">EXPERIENCE</div>
                        <div class="mini-block">
                            <div class="mini-row-head">
                                <span>Senior Frontend Lead</span>
                                <span>2022 - Pres</span>
                            </div>
                            <div style="font-size:5.5px;color:#64748B;">TechSphere Innovations</div>
                            <div class="mini-bullet">Engineered reactive dashboard boosting UX engagement by 42%.</div>
                            <div class="mini-bullet">Led team of 6 engineers adopting micro-frontends.</div>
                        </div>
                        <div class="mini-section-title">PROJECTS</div>
                        <div class="mini-block">
                            <div class="mini-row-head">
                                <span>AI ATS Scanner</span>
                                <span>Next.js, Python</span>
                            </div>
                            <div class="mini-bullet">Processed 25k+ resumes with 99% extraction accuracy.</div>
                        </div>
                        <div class="mini-section-title">EDUCATION</div>
                        <div class="mini-block">
                            <div class="mini-row-head">
                                <span>B.S. Computer Science</span>
                                <span>2018 - 2022</span>
                            </div>
                            <div style="font-size:5.5px;color:#64748B;">Stanford University • GPA 3.9</div>
                        </div>
                    </div>
                </div>
            `;
        }

        if (template.layout === 'minimal') {
            return `
                <div class="mini-resume layout-minimal" ${styleAttr}>
                    <div class="mini-header">
                        <div class="mini-name" style="font-size: 13px;">SARAH CONNOR</div>
                        <div class="mini-title">Full Stack Systems Architect</div>
                        <div class="mini-contact" style="justify-content:center;">
                            <span>sarah@domain.com</span> • <span>+1 (555) 349-2041</span> • <span>Austin, TX</span>
                        </div>
                    </div>
                    <div class="mini-section-title">PROFESSIONAL SUMMARY</div>
                    <p style="font-size:6px;color:#475569;margin-bottom:4px;">
                        Results-driven engineer with 6+ years specializing in distributed systems, high-scale microservices, and ATS-friendly architectures.
                    </p>
                    <div class="mini-section-title">WORK EXPERIENCE</div>
                    <div class="mini-block">
                        <div class="mini-row-head">
                            <span>Principal Engineer - CloudScale Corp</span>
                            <span>2021 - Present</span>
                        </div>
                        <div class="mini-bullet">Architected high-throughput API gateway handling 15M+ daily requests.</div>
                        <div class="mini-bullet">Reduced cloud infrastructure costs by 35% via container optimizations.</div>
                    </div>
                    <div class="mini-section-title">TECHNICAL SKILLS</div>
                    <div class="mini-skills">
                        <span class="mini-skill-chip">Python</span>
                        <span class="mini-skill-chip">Golang</span>
                        <span class="mini-skill-chip">Docker</span>
                        <span class="mini-skill-chip">Kubernetes</span>
                        <span class="mini-skill-chip">PostgreSQL</span>
                        <span class="mini-skill-chip">AWS</span>
                    </div>
                    <div class="mini-section-title">EDUCATION</div>
                    <div class="mini-block">
                        <div class="mini-row-head">
                            <span>M.S. Software Engineering • MIT</span>
                            <span>2019 - 2021</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Standard 2-tone header layout
        return `
            <div class="mini-resume" ${styleAttr}>
                <div class="mini-header">
                    <div class="mini-name">JORDAN HAYES</div>
                    <div class="mini-title">Senior Software Engineer & Team Lead</div>
                    <div class="mini-contact">
                        <span>jordan.hayes@email.com</span> • <span>github.com/jordan</span> • <span>New York, NY</span>
                    </div>
                </div>
                <div class="mini-section-title">CORE SKILLS</div>
                <div class="mini-skills">
                    <span class="mini-skill-chip">React</span>
                    <span class="mini-skill-chip">Node.js</span>
                    <span class="mini-skill-chip">TypeScript</span>
                    <span class="mini-skill-chip">Python</span>
                    <span class="mini-skill-chip">GraphQL</span>
                    <span class="mini-skill-chip">AWS</span>
                </div>
                <div class="mini-section-title">PROFESSIONAL EXPERIENCE</div>
                <div class="mini-block">
                    <div class="mini-row-head">
                        <span>Staff Software Engineer - FinTech Labs</span>
                        <span>2021 - Present</span>
                    </div>
                    <div class="mini-bullet">Engineered real-time settlement engine processing $40M+ volume.</div>
                    <div class="mini-bullet">Boosted test automation coverage from 64% to 96%.</div>
                </div>
                <div class="mini-block">
                    <div class="mini-row-head">
                        <span>Software Engineer - WebFlow Corp</span>
                        <span>2018 - 2021</span>
                    </div>
                    <div class="mini-bullet">Developed client-facing portal used by 120,000+ monthly active users.</div>
                </div>
                <div class="mini-section-title">EDUCATION</div>
                <div class="mini-block">
                    <div class="mini-row-head">
                        <span>B.S. in Computer Science - UC Berkeley</span>
                        <span>2014 - 2018</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Render Template Cards
    function renderTemplates() {
        let filtered = TEMPLATES_DATA.filter(t => {
            const matchesCategory = (currentCategory === 'all') || (t.category === currentCategory);
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Sorting
        if (currentSort === 'ats-score') {
            filtered.sort((a, b) => b.atsScore - a.atsScore);
        } else if (currentSort === 'newest') {
            filtered.reverse();
        }

        templateCount.textContent = filtered.length;

        if (filtered.length === 0) {
            templatesGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        templatesGrid.innerHTML = filtered.map(t => {
            const currentColor = activeColors[t.id] || t.defaultColor;
            const featuredClass = t.isFeatured ? 'featured' : '';
            return `
                <div class="template-card" data-id="${t.id}">
                    <div class="card-preview-wrapper" onclick="openPreviewModal('${t.id}')">
                        <div class="top-badges">
                            <span class="tag-badge ${featuredClass}">${t.tag}</span>
                            <span class="ats-score-pill"><i class="fa-solid fa-circle-check"></i> ${t.atsScore}% ATS</span>
                        </div>

                        <div class="mini-resume-container" id="mini-${t.id}">
                            ${generateMiniResumeHTML(t, currentColor)}
                        </div>

                        <div class="card-hover-overlay">
                            <button class="btn-preview" onclick="event.stopPropagation(); openPreviewModal('${t.id}')">
                                <i class="fa-solid fa-eye"></i> Quick Preview
                            </button>
                            <a href="builder.html?template=${t.id}&color=${currentColor}" class="btn-use" onclick="event.stopPropagation();">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Use Template
                            </a>
                        </div>
                    </div>

                    <div class="card-content">
                        <div class="card-header-row">
                            <h3 class="card-title">${t.title}</h3>
                            <span class="card-category-badge">${t.categoryName}</span>
                        </div>
                        <p class="card-desc">${t.description}</p>

                        <div class="card-footer">
                            <div class="color-swatches" data-template="${t.id}">
                                ${Object.keys(COLOR_PALETTES).map(colorKey => `
                                    <span class="color-dot ${currentColor === colorKey ? 'active' : ''}" 
                                          data-color="${colorKey}" 
                                          style="background: ${COLOR_PALETTES[colorKey]};" 
                                          title="${colorKey}"></span>
                                `).join('')}
                            </div>

                            <a href="builder.html?template=${t.id}&color=${currentColor}" class="card-use-btn">
                                Customize <i class="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Attach event listeners for card color swatches
        attachCardColorEvents();
    }

    // Attach Color Swatch click handlers on cards
    function attachCardColorEvents() {
        document.querySelectorAll('.card-footer .color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const swatchContainer = e.target.closest('.color-swatches');
                const templateId = swatchContainer.dataset.template;
                const colorKey = e.target.dataset.color;

                activeColors[templateId] = colorKey;

                // Update active state on dots
                swatchContainer.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');

                // Update Mini Resume DOM
                const miniContainer = document.getElementById(`mini-${templateId}`);
                const templateObj = TEMPLATES_DATA.find(t => t.id === templateId);
                if (miniContainer && templateObj) {
                    miniContainer.innerHTML = generateMiniResumeHTML(templateObj, colorKey);
                }

                // Update "Customize" link
                const card = e.target.closest('.template-card');
                const cardUseBtn = card.querySelector('.card-use-btn');
                const overlayUseBtn = card.querySelector('.btn-use');
                if (cardUseBtn) cardUseBtn.href = `builder.html?template=${templateId}&color=${colorKey}`;
                if (overlayUseBtn) overlayUseBtn.href = `builder.html?template=${templateId}&color=${colorKey}`;
            });
        });
    }

    // Category Filter Pills Click Handler
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.dataset.category;
            renderTemplates();
        });
    });

    // Search input handler
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        renderTemplates();
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        renderTemplates();
    });

    // Sort select handler
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTemplates();
    });

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentCategory = 'all';
            searchQuery = '';
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            filterPills.forEach(p => p.classList.remove('active'));
            filterPills[0].classList.add('active');
            renderTemplates();
        });
    }

  
    window.openPreviewModal = function(templateId) {
        const template = TEMPLATES_DATA.find(t => t.id === templateId);
        if (!template) return;

        activeModalTemplateId = templateId;
        const currentColor = activeColors[templateId] || template.defaultColor;

        modalTemplateTitle.textContent = template.title;
        modalTemplateDesc.textContent = template.description;
        modalCategoryBadge.textContent = template.categoryName;
        modalScoreText.textContent = `${template.atsScore}%`;

        // Stroke dasharray for SVG circle (e.g. "98, 100")
        modalScoreCircle.setAttribute('stroke-dasharray', `${template.atsScore}, 100`);

        // Highlights
        modalHighlightsList.innerHTML = template.highlights.map(h => `
            <li><i class="fa-solid fa-check"></i> ${h}</li>
        `).join('');

        // Modal Color Swatches
        modalColorSwatches.innerHTML = Object.keys(COLOR_PALETTES).map(colorKey => `
            <span class="color-dot ${currentColor === colorKey ? 'active' : ''}" 
                  data-color="${colorKey}" 
                  style="background: ${COLOR_PALETTES[colorKey]};" 
                  title="${colorKey}"></span>
        `).join('');

        // Attach modal color click
        modalColorSwatches.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const colorKey = e.target.dataset.color;
                activeColors[templateId] = colorKey;
                modalColorSwatches.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                e.target.classList.add('active');

                // Re-render modal preview
                modalResumePreview.innerHTML = generateMiniResumeHTML(template, colorKey, true);
                modalUseTemplateBtn.href = `builder.html?template=${templateId}&color=${colorKey}`;

                // Sync with card
                const miniContainer = document.getElementById(`mini-${templateId}`);
                if (miniContainer) {
                    miniContainer.innerHTML = generateMiniResumeHTML(template, colorKey);
                }
            });
        });

        // Large Preview Rendering
        modalResumePreview.innerHTML = generateMiniResumeHTML(template, currentColor, true);

        // CTA Button Link
        modalUseTemplateBtn.href = `builder.html?template=${templateId}&color=${currentColor}`;

        // Show Modal
        previewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        previewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && previewModal.classList.contains('active')) {
            closeModal();
        }
    });

 
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.querySelector('.sidebar');
    const themeBtn = document.getElementById('themeBtn');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }
    loadTheme();

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }

    renderTemplates();
});
