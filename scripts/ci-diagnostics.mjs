// GitHub Actions job diagnostic manifest. Metadata and explicit outcome allowlist only.
// Never dump process.env, GitHub step outputs, request headers, or credentials.
import fs from "node:fs";
import path from "node:path";
const stages=(process.env.ERUDIOR_DIAG_STAGES??"").split(",").map(x=>x.trim()).filter(Boolean);
const results=stages.map(label=>{
  const [name,status="unknown"]=label.split(":",2);
  return {stage:name.replace(/[^a-zA-Z0-9_-]/g,"").slice(0,64),outcome:/^(success|failure|cancelled|skipped)$/.test(status)?status:"unknown"};
});
const failed=results.filter(x=>x.outcome==="failure");
const report={
  schema:"erudior.ci-diagnostics.v1",createdAt:new Date().toISOString(),
  workflow:(process.env.GITHUB_WORKFLOW??"").slice(0,100),
  job:(process.env.ERUDIOR_DIAG_JOB??"unknown").slice(0,100),
  runId:process.env.GITHUB_RUN_ID??"",attempt:process.env.GITHUB_RUN_ATTEMPT??"",
  commit:process.env.GITHUB_SHA??"",ref:process.env.GITHUB_REF??"",
  runnerOS:process.env.RUNNER_OS??"",node:process.version,
  stages:results,failedStages:failed.map(x=>x.stage),
  note:"Details remain in native GitHub Actions step logs. No secrets or request payloads are collected."
};
const dir=path.join(process.env.RUNNER_TEMP??".","erudior-ci-diagnostics");
fs.mkdirSync(dir,{recursive:true});
const safe=report.job.replace(/[^a-z0-9_-]/gi,"-");
fs.writeFileSync(path.join(dir,safe+".json"),JSON.stringify(report,null,2)+"\n");
const summary=[
  "### Erudior diagnostics — "+report.job,
  "- Run: "+report.runId+" (attempt "+report.attempt+")",
  "- Commit: "+report.commit,
  "- Runner: "+report.runnerOS+" / Node "+report.node,
  "- Failed stages: "+(failed.map(x=>x.stage).join(", ")||"none recorded"),
  ...results.map(x=>"- `"+x.stage+"`: "+x.outcome),
  "- Download the `erudior-diagnostics-"+safe+"` artifact for structured metadata.",
  "- Full error text, timing, and network events remain in the relevant Actions step logs."
].join("\n")+"\n";
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,summary);
console.log("Erudior diagnostic report written for "+report.job+"; failures="+failed.length);
