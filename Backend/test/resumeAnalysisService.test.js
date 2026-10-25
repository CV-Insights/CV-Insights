const test = require("node:test");
const assert = require("node:assert/strict");
const { analyzeResume } = require("../src/services/resumeAnalysisService");

test("matches resume skills against recognized job keywords", () => {
  const result = analyzeResume(
    "Built React and Node.js applications with SQL databases. Used React across products.",
    "Seeking React, Node.js, SQL, and AWS experience."
  );

  assert.deepEqual(result.matchedKeywords, ["node.js", "react", "sql"]);
  assert.deepEqual(result.missingKeywords, ["aws"]);
  assert.equal(result.score, 75);
});

test("returns zero when no recognized job keywords match", () => {
  const result = analyzeResume(
    "Managed customer support and delivery operations.",
    "Seeking Python, Kubernetes, and AWS experience."
  );

  assert.equal(result.score, 0);
  assert.equal(result.matchedKeywords.length, 0);
  assert.deepEqual(result.missingKeywords, ["aws", "kubernetes", "python"]);
});

test("extracts repeated non-dictionary terms as keyword candidates", () => {
  const result = analyzeResume(
    "Terraform deployment work. Terraform modules. Kubernetes rollout.",
    "Terraform deployment skills. Terraform infrastructure experience."
  );

  assert.ok(result.resumeKeywords.includes("terraform"));
  assert.ok(result.jobKeywords.includes("terraform"));
  assert.ok(result.matchedKeywords.includes("terraform"));
});
