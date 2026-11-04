import type { StudyProgram } from "./studyPrograms";

/** Reserved curriculum outlines, not published course packages. */
export const JD_PROGRAM: StudyProgram = {
  "id": "jd-preparation",
  "version": 1,
  "title": "J.D. Preparation",
  "description": "A three-stage program connecting legal study skills, foundational law and upper-level subjects into one reusable learning pathway.",
  "notice": "Independent preparation, not a J.D. degree, university credit, bar eligibility or legal advice. Availability is shown for each course; planned courses become available after authoring, review and publication.",
  "stages": [
    {
      "id": "readiness",
      "title": "Law-school readiness",
      "summary": "Learn how lawyers read, research and explain a legal problem before studying the doctrinal subjects.",
      "milestone": "Build a research portfolio: three case briefs, an authority table, an objective memo and a revised persuasive brief. Use a rubric for accuracy, authority, application, counterarguments and clarity.",
      "courses": [
        {
          "courseId": "law-us-legal-system",
          "title": "Introduction to the U.S. Legal System",
          "recommendedBefore": [],
          "modules": [
            "Sources of law and legal institutions",
            "Federal and state court structures",
            "Precedent, jurisdiction and authority",
            "From client problem to judicial decision"
          ],
          "outcomes": [
            "Identify the institution responsible for a legal rule.",
            "Distinguish binding authority from persuasive authority in a stated forum."
          ],
          "assignment": "Map a fictional dispute through trial and appeal and explain which sources govern."
        },
        {
          "courseId": "law-case-reading",
          "title": "Case Reading and Legal Reasoning",
          "recommendedBefore": [
            "law-us-legal-system"
          ],
          "modules": [
            "Reading an opinion and procedural posture",
            "Issues, holdings, reasoning and dicta",
            "Rule synthesis, analogy and distinction",
            "Statutory interpretation and changed facts"
          ],
          "outcomes": [
            "Write a concise case brief without confusing the holding with dicta.",
            "Synthesize a rule from two cases and apply it to a new fact pattern."
          ],
          "assignment": "Brief three opinions, compare their reasoning and answer a changed-fact hypothetical."
        },
        {
          "courseId": "law-legal-research",
          "title": "Legal Research and Citation",
          "recommendedBefore": [
            "law-case-reading"
          ],
          "modules": [
            "Research plans and secondary sources",
            "Cases, statutes and regulations",
            "Updating authority and jurisdiction checks",
            "Citation, quotations and research logs"
          ],
          "outcomes": [
            "Document a reproducible research trail.",
            "Identify authority that needs currency verification and cite sources accurately."
          ],
          "assignment": "Create an authority table and research log; explain currency checks and any access limitations."
        },
        {
          "courseId": "law-legal-writing-1",
          "title": "Legal Writing I: Objective Analysis",
          "recommendedBefore": [
            "law-case-reading",
            "law-legal-research"
          ],
          "modules": [
            "Issue framing and rule statements",
            "IRAC and CREAC organization",
            "Fact-based application and counteranalysis",
            "Objective memoranda and revision"
          ],
          "outcomes": [
            "Separate rule explanation from fact-specific application.",
            "Present a balanced prediction with uncertainty and counterarguments."
          ],
          "assignment": "Write and revise an objective memorandum using a supplied case and statute packet."
        },
        {
          "courseId": "law-legal-writing-2",
          "title": "Legal Writing II: Persuasion and Advocacy",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Audience, relief and persuasive organization",
            "Fact statements and argument headings",
            "Adverse authority and ethical advocacy",
            "Brief revision and oral explanation"
          ],
          "outcomes": [
            "Develop a supported argument while addressing adverse authority.",
            "Revise a brief for organization, precision and appropriate tone."
          ],
          "assignment": "Prepare a short motion brief and an oral-argument outline, then revise against a rubric."
        }
      ]
    },
    {
      "id": "core",
      "title": "Core J.D. preparation",
      "summary": "Study the shared foundations of a U.S. J.D. through cases, statutory problems and written analysis.",
      "milestone": "Complete an integrated fictional civil case: identify contract, tort and property issues, select a forum, draft a pleading outline and write a timed analysis. Separately complete constitutional, criminal-law and ethics problems.",
      "courses": [
        {
          "courseId": "law-contracts-1",
          "title": "Contracts I: Formation and Interpretation",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Offer and acceptance",
            "Consideration and reliance",
            "Formation defenses and enforceability",
            "Interpretation and introductory sales-law distinctions"
          ],
          "outcomes": [
            "Analyze whether an enforceable agreement exists.",
            "Explain competing interpretations using facts and authority."
          ],
          "assignment": "Analyze a disputed agreement, including formation, reliance and enforceability."
        },
        {
          "courseId": "law-contracts-2",
          "title": "Contracts II: Performance, Breach and Remedies",
          "recommendedBefore": [
            "law-contracts-1"
          ],
          "modules": [
            "Conditions and performance",
            "Breach, repudiation and excuse",
            "Third-party rights",
            "Expectation, reliance, restitution and equitable relief"
          ],
          "outcomes": [
            "Identify the consequences of breach and available arguments for excuse.",
            "Compare remedial measures and their limitations."
          ],
          "assignment": "Write a breach memorandum and calculate alternative damages under supplied assumptions."
        },
        {
          "courseId": "law-torts",
          "title": "Torts",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Intentional torts and privileges",
            "Negligence: duty and breach",
            "Actual and proximate causation; defenses",
            "Strict liability, products and damages"
          ],
          "outcomes": [
            "Apply each element rather than infer liability from harm alone.",
            "Assess causation, defenses and policy arguments."
          ],
          "assignment": "Analyze a multi-party accident from both plaintiff and defendant perspectives."
        },
        {
          "courseId": "law-civil-procedure-1",
          "title": "Civil Procedure I: Courts and Pleadings",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Subject-matter and personal jurisdiction",
            "Notice, service, venue and transfer",
            "Erie and choice of governing law",
            "Pleadings, motions and joinder"
          ],
          "outcomes": [
            "Select and justify a forum for a stated dispute.",
            "Distinguish jurisdictional issues from merits and procedural questions."
          ],
          "assignment": "Prepare a forum analysis and complaint outline for a fictional federal civil action."
        },
        {
          "courseId": "law-civil-procedure-2",
          "title": "Civil Procedure II: Litigation and Judgments",
          "recommendedBefore": [
            "law-civil-procedure-1"
          ],
          "modules": [
            "Discovery, disclosure and privilege",
            "Summary judgment and settlement",
            "Trial, jury and post-trial motions",
            "Appeal, finality and preclusion"
          ],
          "outcomes": [
            "Explain the burdens at successive litigation stages.",
            "Analyze how a prior judgment affects later claims."
          ],
          "assignment": "Build a litigation timeline and argue a summary-judgment problem using a supplied record."
        },
        {
          "courseId": "law-real-property",
          "title": "Real Property",
          "recommendedBefore": [
            "law-contracts-1",
            "law-legal-writing-1"
          ],
          "modules": [
            "Possession, estates and future interests",
            "Co-ownership and landlord-tenant foundations",
            "Transfers, recording and title",
            "Easements, covenants and land-use foundations"
          ],
          "outcomes": [
            "Analyze competing interests in land.",
            "Distinguish general doctrines from jurisdiction-dependent rules."
          ],
          "assignment": "Resolve a fictional chain-of-title, lease and easement dispute with explicit jurisdiction assumptions."
        },
        {
          "courseId": "law-constitutional-law-1",
          "title": "Constitutional Law I: Government Structure",
          "recommendedBefore": [
            "law-us-legal-system",
            "law-legal-writing-1"
          ],
          "modules": [
            "Judicial review and justiciability",
            "Congressional power and federalism",
            "Executive power and separation of powers",
            "Federal-state relations and preemption"
          ],
          "outcomes": [
            "Identify the source and limits of governmental power.",
            "Analyze structural constitutional arguments and threshold justiciability."
          ],
          "assignment": "Write opposing analyses of a fictional federal-state regulatory dispute."
        },
        {
          "courseId": "law-constitutional-law-2",
          "title": "Constitutional Law II: Individual Rights",
          "recommendedBefore": [
            "law-constitutional-law-1"
          ],
          "modules": [
            "State action and incorporation",
            "Due process",
            "Equal protection",
            "Speech, religion and associational rights"
          ],
          "outcomes": [
            "Identify the relevant constitutional right and analytical framework.",
            "Apply the appropriate scrutiny and address competing arguments."
          ],
          "assignment": "Analyze a rights problem, identifying state action, standards and factual uncertainties."
        },
        {
          "courseId": "law-criminal-law",
          "title": "Criminal Law",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Legality, act requirements and mental states",
            "Causation and major offense categories",
            "Attempt, conspiracy and accomplice liability",
            "Justification, excuse and comparative statutory approaches"
          ],
          "outcomes": [
            "Apply each offense element and potential defense.",
            "Distinguish common-law and model-code approaches where specified."
          ],
          "assignment": "Prepare a charge-and-defense matrix from a fictional incident under supplied statutes."
        },
        {
          "courseId": "law-professional-responsibility",
          "title": "Professional Responsibility",
          "recommendedBefore": [
            "law-legal-writing-1"
          ],
          "modules": [
            "Client relationships, competence and communication",
            "Confidentiality and privilege distinctions",
            "Conflicts of interest and loyalty",
            "Candor, fees and professional discipline"
          ],
          "outcomes": [
            "Identify competing duties and needed additional facts.",
            "Distinguish model rules from a jurisdiction’s adopted rules."
          ],
          "assignment": "Analyze a fictional client intake and conflict problem, supporting each proposed response."
        }
      ]
    },
    {
      "id": "upper-level",
      "title": "Upper-level preparation",
      "summary": "Extend the foundation into litigation, business, family, estates and regulation. These are recommended preparation subjects; degree requirements vary by school.",
      "milestone": "Prepare a capstone portfolio with an evidence objection memo, business transaction analysis, family/estate issue map and administrative-law research memo. Revise at least one item after rubric feedback.",
      "courses": [
        {
          "courseId": "law-evidence",
          "title": "Evidence",
          "recommendedBefore": [
            "law-civil-procedure-2",
            "law-criminal-law"
          ],
          "modules": [
            "Relevance and exclusion",
            "Witnesses, impeachment and credibility",
            "Hearsay and its exclusions and exceptions",
            "Authentication, writings and privileges"
          ],
          "outcomes": [
            "Analyze admissibility in a specified procedural setting.",
            "Distinguish an admissibility argument from evidentiary weight."
          ],
          "assignment": "Write an objection-and-response memorandum for a fictional trial record."
        },
        {
          "courseId": "law-criminal-procedure",
          "title": "Criminal Procedure",
          "recommendedBefore": [
            "law-criminal-law",
            "law-constitutional-law-2"
          ],
          "modules": [
            "Searches, seizures and warrants",
            "Interrogation and self-incrimination",
            "Counsel and identification procedures",
            "Suppression, charging and trial protections"
          ],
          "outcomes": [
            "Identify the constitutional protections implicated by investigative acts.",
            "Explain arguments for and against suppression under supplied authority."
          ],
          "assignment": "Analyze an investigation timeline and draft a suppression-motion outline."
        },
        {
          "courseId": "law-business-associations",
          "title": "Business Associations",
          "recommendedBefore": [
            "law-contracts-2",
            "law-real-property"
          ],
          "modules": [
            "Agency and authority",
            "Partnerships and limited liability entities",
            "Corporations and governance",
            "Fiduciary duties and owner remedies"
          ],
          "outcomes": [
            "Compare entity structures and allocation of authority.",
            "Analyze agency and fiduciary-duty disputes."
          ],
          "assignment": "Prepare an entity-choice memo and analyze a fictional manager’s conflict of interest."
        },
        {
          "courseId": "law-family-law",
          "title": "Family Law",
          "recommendedBefore": [
            "law-constitutional-law-2",
            "law-real-property"
          ],
          "modules": [
            "Marriage and relationship recognition",
            "Dissolution, property and support",
            "Parentage, custody and child welfare",
            "Jurisdiction and interstate family disputes"
          ],
          "outcomes": [
            "Identify the legal issues and jurisdictional questions in a family dispute.",
            "Distinguish general principles from state-specific statutory choices."
          ],
          "assignment": "Create a neutral issue map using a fictional family and a supplied jurisdiction pack."
        },
        {
          "courseId": "law-wills-trusts-estates",
          "title": "Wills, Trusts and Estates",
          "recommendedBefore": [
            "law-real-property"
          ],
          "modules": [
            "Intestacy and succession",
            "Will execution, interpretation and contests",
            "Trust creation and administration",
            "Fiduciary duties and estate administration"
          ],
          "outcomes": [
            "Trace distribution under supplied succession rules.",
            "Analyze validity, interpretation and fiduciary questions."
          ],
          "assignment": "Resolve a fictional succession problem and explain competing will and trust claims."
        },
        {
          "courseId": "law-sales",
          "title": "Sales",
          "recommendedBefore": [
            "law-contracts-2"
          ],
          "modules": [
            "Article 2 scope and contract formation",
            "Terms, warranties and disclaimers",
            "Performance, risk and breach",
            "Buyer and seller remedies"
          ],
          "outcomes": [
            "Distinguish a goods transaction from other agreements.",
            "Apply the supplied enacted sales provisions to warranty and remedy disputes."
          ],
          "assignment": "Analyze a defective-goods transaction and compare buyer and seller remedies."
        },
        {
          "courseId": "law-secured-transactions",
          "title": "Secured Transactions",
          "recommendedBefore": [
            "law-contracts-2",
            "law-business-associations",
            "law-sales"
          ],
          "modules": [
            "Collateral and Article 9 scope",
            "Attachment and enforceability",
            "Perfection and priority",
            "Default, enforcement and disposition"
          ],
          "outcomes": [
            "Separate attachment from perfection and priority.",
            "Rank competing claims under supplied enacted rules."
          ],
          "assignment": "Prepare a collateral and priority matrix for a fictional financing transaction."
        },
        {
          "courseId": "law-remedies",
          "title": "Remedies",
          "recommendedBefore": [
            "law-contracts-2",
            "law-torts",
            "law-real-property",
            "law-civil-procedure-2"
          ],
          "modules": [
            "Compensatory relief and limitations",
            "Restitution and unjust enrichment",
            "Injunctions and equitable defenses",
            "Declaratory and provisional relief"
          ],
          "outcomes": [
            "Match a remedy to the underlying claim and proof.",
            "Compare damages and equitable relief without double recovery."
          ],
          "assignment": "Write a remedies memorandum and explain an alternative damages calculation."
        },
        {
          "courseId": "law-administrative-law",
          "title": "Administrative Law",
          "recommendedBefore": [
            "law-constitutional-law-1",
            "law-civil-procedure-2",
            "law-legal-research"
          ],
          "modules": [
            "Agency authority and delegation",
            "Rulemaking and public participation",
            "Adjudication and procedural fairness",
            "Judicial review and remedies"
          ],
          "outcomes": [
            "Identify the agency action and review route.",
            "Research current review standards rather than assume superseded doctrine."
          ],
          "assignment": "Analyze a fictional agency decision using a dated statute, rule and case packet."
        }
      ]
    }
  ],
  "sources": [
    {
      "title": "University of Hawaiʻi: online J.D. sample curriculum",
      "url": "https://www.uhonline.hawaii.edu/sample-schedule-jd"
    },
    {
      "title": "St. Mary’s: online J.D. curriculum",
      "url": "https://law.stmarytx.edu/academics/programs/jd/online-j-d-program/"
    },
    {
      "title": "Southwestern: online J.D. required courses",
      "url": "https://www.swlaw.edu/jd-llm-programs/online-jd-program/online-jd-program-curriculum-glance"
    },
    {
      "title": "Case Western Reserve: online J.D. requirements",
      "url": "https://bulletin.case.edu/law/programs/law-jd-online/"
    }
  ],
  "reviewedOn": "2026-11-03"
};
