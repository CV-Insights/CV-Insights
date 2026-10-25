// Canonical skill names recognized in resumes and job descriptions.
const SKILL_TERMS = [
  "accessibility",
  "agile",
  "ai",
  "amazon web services",
  "angular",
  "api",
  "apis",
  "aws",
  "azure",
  "bash",
  "big data",
  "c",
  "c#",
  "c++",
  "ci/cd",
  "cloud",
  "communication",
  "computer vision",
  "css",
  "customer service",
  "data analysis",
  "data analytics",
  "data engineering",
  "data science",
  "database",
  "deep learning",
  "django",
  "docker",
  "express",
  "figma",
  "firebase",
  "flask",
  "git",
  "github",
  "go",
  "google cloud",
  "graphql",
  "html",
  "java",
  "javascript",
  "jenkins",
  "julia",
  "kotlin",
  "kubernetes",
  "leadership",
  "machine learning",
  "mongodb",
  "mongoose",
  "mysql",
  "next.js",
  "node.js",
  "nosql",
  "numpy",
  "pandas",
  "php",
  "postgresql",
  "power bi",
  "problem solving",
  "product management",
  "project management",
  "python",
  "pytorch",
  "r",
  "react",
  "redis",
  "rest",
  "rest api",
  "rust",
  "salesforce",
  "scikit-learn",
  "scrum",
  "security",
  "snowflake",
  "software development",
  "sql",
  "statistics",
  "swift",
  "teamwork",
  "tensorflow",
  "typescript",
  "ui/ux",
  "user experience",
  "visualization",
  "vue",
  "webpack",
];

// Common job-description words are ignored when finding repeated terms.
const STOP_WORDS = new Set([
  "ability",
  "able",
  "about",
  "after",
  "also",
  "and",
  "are",
  "based",
  "been",
  "being",
  "between",
  "build",
  "built",
  "can",
  "candidate",
  "company",
  "create",
  "created",
  "develop",
  "developed",
  "development",
  "essential",
  "experience",
  "expertise",
  "for",
  "from",
  "have",
  "help",
  "including",
  "into",
  "looking",
  "intern",
  "interns",
  "internship",
  "internships",
  "location",
  "locations",
  "located",
  "city",
  "cities",
  "state",
  "states",
  "country",
  "countries",
  "region",
  "regions",
  "remote",
  "hybrid",
  "onsite",
  "on-site",
  "relocate",
  "relocation",
  "mandatory",
  "minimum",
  "more",
  "must",
  "our",
  "over",
  "preferred",
  "proficient",
  "proficiency",
  "qualification",
  "qualifications",
  "requirement",
  "requirements",
  "required",
  "responsibilities",
  "responsibility",
  "role",
  "should",
  "skills",
  "strong",
  "such",
  "team",
  "their",
  "they",
  "this",
  "through",
  "using",
  "various",
  "want",
  "what",
  "will",
  "with",
  "work",
  "years",
  "you",
  "your",
]);

const MIN_REPEATED_WORD_COUNT = 2;
const MAX_REPEATED_KEYWORDS = 10;
const MAX_IMPORTANT_KEYWORDS = 10;
const CRITICAL_KEYWORD_WEIGHT = 4;
const SKILL_KEYWORD_WEIGHT = 2;
const STANDARD_KEYWORD_WEIGHT = 1;
const NORMALIZED_SKILL_TERMS = new Set(SKILL_TERMS.map((term) => term.trim()));
// Aliases are normalized so equivalent skills compare as the same keyword.
const SKILL_ALIAS_GROUPS = [
  ["aws", "amazon web services"],
  ["javascript", "js"],
  ["node.js", "nodejs", "node js"],
  ["react", "react.js", "reactjs"],
  ["postgresql", "postgres"],
  ["kubernetes", "k8s"],
];
const REQUIRED_CONTEXT_PATTERNS = [
  /\b(required|requirement)\b/i,
  /\bmust(?:-have)?\b/i,
  /\bminimum qualifications?\b/i,
  /\b(essential|mandatory)\b/i,
  /\bproficiency in\b/i,
  /\bproficient in\b/i,
  /\bexpertise in\b/i,
  /\bat least\b/i,
];
const PREFERRED_CONTEXT_PATTERNS = [
  /\bpreferred\b/i,
  /\bnice to have\b/i,
  /\bbonus\b/i,
  /\ba plus\b/i,
  /\bdesirable\b/i,
];
const REQUIRED_SECTION_HEADINGS = new Set([
  "requirements",
  "requirement",
  "qualifications",
  "qualification",
  "required",
  "required skills",
  "required qualifications",
  "required experience",
  "minimum requirements",
  "minimum qualifications",
  "essential skills",
  "mandatory skills",
  "must-have",
  "must-have skills",
  "basic qualifications",
  "what you bring",
]);
const PREFERRED_SECTION_HEADINGS = new Set([
  "preferred",
  "preferred skills",
  "preferred qualifications",
  "nice to have",
  "desired qualifications",
  "bonus",
]);
const OTHER_SECTION_HEADINGS = new Set([
  "responsibilities",
  "what you'll do",
  "what you will do",
  "about the role",
  "benefits",
  "what we offer",
  "role overview",
]);
const CANONICAL_SKILL_BY_ALIAS = new Map();
const SKILL_ALIASES_BY_CANONICAL = new Map();

for (const [canonical, ...aliases] of SKILL_ALIAS_GROUPS) {
  const variants = [canonical, ...aliases];
  SKILL_ALIASES_BY_CANONICAL.set(canonical, variants);
  for (const variant of variants) {
    CANONICAL_SKILL_BY_ALIAS.set(variant, canonical);
    NORMALIZED_SKILL_TERMS.add(variant);
  }
}

const CANONICAL_SKILL_TERMS = [
  ...new Set(
    SKILL_TERMS.map((term) => CANONICAL_SKILL_BY_ALIAS.get(term) || term)
  ),
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesExactTerm(text, term) {
  const escaped = escapeRegex(term.trim());
  const expression = new RegExp(
    `(^|[^a-z0-9+#.])${escaped}($|[^a-z0-9+#.])`,
    "i"
  );

  return expression.test(text);
}

function includesTerm(text, term) {
  const variants = SKILL_ALIASES_BY_CANONICAL.get(term) || [term];
  return variants.some((variant) => matchesExactTerm(text, variant));
}

function removeLocationMetadata(text) {
  return text
    .split(/\r?\n/)
    .map((line) =>
      line.replace(
        /\b(?:work\s+|office\s+|job\s+)?location\s*[:-]\s*[^;|]+/i,
        " "
      )
    )
    .join(" ");
}

function extractKeywords(text) {
  // Job posts often repeat city, state, or country details in a location field.
  // Remove that metadata before extracting terms so places do not look like skills.
  const normalized = removeLocationMetadata(text).toLowerCase();
  const knownTerms = CANONICAL_SKILL_TERMS.filter((term) =>
    includesTerm(normalized, term)
  );

  const wordCounts = new Map();
  for (const word of normalized.match(/[a-z][a-z0-9+#.-]{2,}/g) || []) {
    if (!STOP_WORDS.has(word) && !NORMALIZED_SKILL_TERMS.has(word)) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
  }

  const frequentWords = [...wordCounts.entries()]
    .filter(([, count]) => count >= MIN_REPEATED_WORD_COUNT)
    .sort((first, second) => second[1] - first[1])
    .slice(0, MAX_REPEATED_KEYWORDS)
    .map(([word]) => word);

  return [...new Set([...knownTerms, ...frequentWords])].sort();
}

function countOccurrences(text, term) {
  const variants = SKILL_ALIASES_BY_CANONICAL.get(term) || [term];
  return variants.reduce((total, variant) => {
    const escaped = escapeRegex(variant.trim());
    const expression = new RegExp(
      `(^|[^a-z0-9+#.])${escaped}($|[^a-z0-9+#.])`,
      "gi"
    );
    return total + [...text.matchAll(expression)].length;
  }, 0);
}

function splitIntoContextLines(text) {
  return text
    .split(/(?:\r?\n|[;!?]+|(?<=\.)\s+)/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeHeading(line) {
  return line
    .toLowerCase()
    .replace(/^[^a-z]+/i, "")
    .replace(/[:\s]+$/, "")
    .trim();
}

function getSectionImportance(contextLines, lineIndex) {
  for (let index = lineIndex - 1; index >= 0; index -= 1) {
    const heading = normalizeHeading(contextLines[index]);

    if (
      REQUIRED_SECTION_HEADINGS.has(heading) ||
      heading.startsWith("required ") ||
      heading.startsWith("minimum ")
    ) {
      return "critical";
    }

    if (
      PREFERRED_SECTION_HEADINGS.has(heading) ||
      heading.startsWith("preferred ") ||
      heading.startsWith("desired ")
    ) {
      return "preferred";
    }

    if (OTHER_SECTION_HEADINGS.has(heading)) {
      return null;
    }
  }

  return null;
}

function getKeywordImportance(keyword, contextLines) {
  const keywordLines = contextLines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => includesTerm(line, keyword));
  const appearsInRequiredContext = keywordLines.some(
    ({ line, index }) =>
      REQUIRED_CONTEXT_PATTERNS.some((pattern) => pattern.test(line)) ||
      getSectionImportance(contextLines, index) === "critical"
  );
  const appearsInPreferredContext = keywordLines.some(
    ({ line, index }) =>
      PREFERRED_CONTEXT_PATTERNS.some((pattern) => pattern.test(line)) ||
      getSectionImportance(contextLines, index) === "preferred"
  );

  if (appearsInRequiredContext) {
    return {
      importance: "critical",
      weight: CRITICAL_KEYWORD_WEIGHT,
    };
  }

  const isRecognizedSkill = CANONICAL_SKILL_TERMS.includes(keyword);
  if (isRecognizedSkill && !appearsInPreferredContext) {
    return {
      importance: "high",
      weight: SKILL_KEYWORD_WEIGHT,
    };
  }

  return {
    importance: "standard",
    weight: STANDARD_KEYWORD_WEIGHT,
  };
}

function calculateWeightedScore(keywordDetails) {
  const totalWeight = keywordDetails.reduce(
    (total, keyword) => total + keyword.weight,
    0
  );
  const matchedWeight = keywordDetails.reduce(
    (total, keyword) => total + (keyword.matched ? keyword.weight : 0),
    0
  );

  if (totalWeight === 0) {
    return 0;
  }

  return Math.round((matchedWeight / totalWeight) * 100);
}

function createKeywordDetails(jobKeywords, resumeKeywordSet, resumeText, jobText) {
  const contextLines = splitIntoContextLines(jobText);

  return jobKeywords.map((keyword) => {
    const { importance, weight } = getKeywordImportance(keyword, contextLines);

    return {
      term: keyword,
      importance,
      weight,
      matched: resumeKeywordSet.has(keyword),
      jobMentions: countOccurrences(jobText, keyword),
      resumeMentions: countOccurrences(resumeText, keyword),
    };
  });
}

function sortKeywordsByImportance(keywordDetails) {
  const importanceOrder = {
    critical: 0,
    high: 1,
    standard: 2,
  };

  return [...keywordDetails].sort((first, second) => {
    const importanceDifference =
      importanceOrder[first.importance] - importanceOrder[second.importance];

    if (importanceDifference !== 0) {
      return importanceDifference;
    }

    const mentionDifference = second.jobMentions - first.jobMentions;
    if (mentionDifference !== 0) {
      return mentionDifference;
    }

    return first.term.localeCompare(second.term);
  });
}

function getImportantKeywords(prioritizedDetails) {
  const highPriorityKeywords = prioritizedDetails
    .filter((keyword) => keyword.importance !== "standard")
    .slice(0, MAX_IMPORTANT_KEYWORDS)
    .map((keyword) => keyword.term);

  if (highPriorityKeywords.length > 0) {
    return highPriorityKeywords;
  }

  return prioritizedDetails
    .slice(0, 5)
    .map((keyword) => keyword.term);
}

function analyzeResume(resumeText, jobDescription) {
  const normalizedResume = resumeText.toLowerCase();
  const normalizedJobDescription = jobDescription.toLowerCase();
  const resumeKeywords = extractKeywords(normalizedResume);
  const jobKeywords = extractKeywords(normalizedJobDescription);
  const resumeKeywordSet = new Set(resumeKeywords);
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeKeywordSet.has(keyword)
  );
  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeKeywordSet.has(keyword)
  );
  const keywordDetails = createKeywordDetails(
    jobKeywords,
    resumeKeywordSet,
    normalizedResume,
    normalizedJobDescription
  );
  const score = calculateWeightedScore(keywordDetails);
  const prioritizedDetails = sortKeywordsByImportance(keywordDetails);
  const importantKeywords = getImportantKeywords(prioritizedDetails);

  return {
    score,
    resumeKeywords,
    jobKeywords,
    matchedKeywords,
    missingKeywords,
    keywordDetails,
    importantKeywords,
  };
}

module.exports = { analyzeResume };
