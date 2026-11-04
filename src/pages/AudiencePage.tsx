import "../audience-pages.css";
import { appUrl } from "../lib/site";

export type Audience = "parents" | "live-rooms" | "teachers";
export const INFO: Record<Audience, { title: string; intro: string; image: string; alt: string; sections: {title:string; body:string; points:string[]}[] }> = {
  parents: {
    title: "For parents and homeschool families",
    intro: "Plan learning, support independent study, and keep local family records in the installed Erudior app. Choose a homeschool workspace to show Family navigation. Erudior remains supplementary learning software while its full homeschool-readiness work is completed.",
    image: "/shots/audience/family-overview.webp",
    alt: "Parent overview showing student attendance, subject hours and reminders.",
    sections: [
      { title: "Organize your homeschool", body: "Set up a local school year and learner profiles, then unlock the adult area to plan learning, review courses and follow each learner’s progress.", points: ["Track assignments and completed lessons", "Review practice scores and work requiring your grading", "Keep students working on courses appropriate for their progress"] },
      { title: "Keep the records you need", body: "Erudior includes tools to help assemble school records. Families remain responsible for checking their own jurisdiction's requirements.", points: ["Attendance, study time and activity records", "Grades, progress reports and report cards", "Transcripts, portfolios and exportable documents"] },
      { title: "Your data, on your device", body: "Family records stay in the installed app’s local storage. Make backups and keep exported files safe; a local learner profile is not an online account, and records do not automatically sync between devices.", points: ["Separate learner progress and protected profile switching", "Adult authorization for sensitive actions", "Local exports and passphrase-encrypted backup/recovery"] },
    ],
  },
  "live-rooms": {
    title: "Live rooms",
    intro: "Host course-based quiz sessions from the installed app’s adult area when the live service is enabled. Players join the web app using a room code and nickname, without student accounts. Host and players need an internet connection.",
    image: "/shots/audience/live-host-lobby.webp",
    alt: "Live room host screen with join code and participants.",
    sections: [
      { title: "Start a session", body: "Start a course with supported text-only choice questions, choose a question set, and create a room. Players enter its six-character code and a nickname from a phone, tablet or computer.", points: ["Supported choice questions from lesson, module or random sets", "Individual, team and cooperative modes", "No student sign-in required to join"] },
      { title: "Teach at your pace", body: "The host starts questions, reveals answers and advances the session. Choose untimed play or a per-question time limit; live games do not award course grades or mastery.", points: ["Host-paced or timed play", "Answer counts after each question", "Host-controlled progression"] },
      { title: "Privacy-conscious participation", body: "The host sees participant nicknames and individual scores. Players see their own results and aggregate room or team results, not other players’ names. These live sessions are temporary, not permanent academic records.", points: ["Use non-identifying nicknames and avoid personal information", "Only the host sees named individual scores", "The host can remove participants and close the room"] },
    ],
  },
  teachers: {
    title: "For teachers",
    intro: "Choose a local classroom workspace in the installed app to show Classroom navigation. Organize classes, assign learning, review hand-ins and keep teacher records. Online school accounts, automatic device sync and remote school messaging are separate unfinished capabilities.",
    image: "/shots/audience/classroom-gradebook.webp",
    alt: "Classroom gradebook showing assigned courses and learner progress.",
    sections: [
      { title: "Create and organize classes", body: "Manage class rosters and assign available courses with due dates.", points: ["Multiple classes and rosters", "Course assignments with due dates", "Student progress by course"] },
      { title: "Collect and assess work", body: "Use a shared device or export a class file for learners to use on their own devices. Import returned hand-in files to retain submission history and review exact snapshots; this file-based exchange is not automatic cloud submission.", points: ["Validate hand-ins and retain resubmission history", "Review exact evidence with recorded instructor decisions", "Export the gradebook for further work"] },
      { title: "Lead interactive sessions", body: "Use live rooms for group review and class participation.", points: ["Live quizzes from course material", "Participation without student accounts", "Host-controlled question pacing"] },
    ],
  },
};


type TabGuide = { tab: string; description: string; image?: string; alt?: string };
export const TAB_GUIDES: Record<Audience, TabGuide[]> = {
  "parents": [
    {"tab": "Overview", "description": "Review the selected school year, learner attendance, recorded subject hours and reminders.", "image": "/shots/audience/family-overview.webp", "alt": "Erudior Family: Overview section with synthetic demonstration data."},
    {"tab": "Homeschool planning", "description": "Build yearly and longer-term plans, placement notes, materials and field trips. Review a specific community-course version before approving it for a child’s plan.", "image": "/shots/audience/family-planning.webp", "alt": "Erudior Family: Homeschool planning section with synthetic demonstration data."},
    {"tab": "Learning paths", "description": "Review stable skills, prerequisites and exact-source evidence across courses. Make adult-supervised placement decisions without presenting manual placement as assessed mastery.", "image": "/shots/audience/family-learning-paths.webp", "alt": "Erudior Family: Learning paths section with synthetic demonstration data."},
    {"tab": "Learning diagnostics", "description": "Inspect observed learning patterns and select targeted practice, support plans and follow-up reviews. These are educational observations, not clinical diagnoses.", "image": "/shots/audience/family-diagnostics.webp", "alt": "Erudior Family: Learning diagnostics section with synthetic demonstration data."},
    {"tab": "Content exchange", "description": "Import and export supported CASE, QTI and Common Cartridge content with explicit mappings and validation. External content does not gain trust or grades automatically; LTI requires separate approved registration.", "image": "/shots/audience/family-interoperability.webp", "alt": "Erudior Family: Content exchange section with synthetic demonstration data."},
    {"tab": "Document cases", "description": "Prepare versioned educational documents and case files, approve exact source versions, and review annotations, submitted evidence and revisions.", "image": "/shots/audience/family-document-cases.webp", "alt": "Erudior Family: Document cases section with synthetic demonstration data."},
    {"tab": "Advanced assessment", "description": "Build and review structured assessment activities and evidence using supported formats. Review and grading remain tied to the selected source and learner work.", "image": "/shots/audience/family-advanced-assessment.webp", "alt": "Erudior Family: Advanced assessment section with synthetic demonstration data."},
    {"tab": "Scientific workspaces", "description": "Prepare measurement, graphing, uncertainty and design activities, then inspect learner submissions and provide feedback.", "image": "/shots/audience/family-scientific.webp", "alt": "Erudior Family: Scientific workspaces section with synthetic demonstration data."},
    {"tab": "Branching scenarios", "description": "Author decisions, state changes and timelines, assign a reviewed version, and review the learner’s choices and resulting evidence.", "image": "/shots/audience/family-branching.webp", "alt": "Erudior Family: Branching scenarios section with synthetic demonstration data."},
    {"tab": "Transaction practice", "description": "Use fictional transaction cases, document revisions, deadlines and ledger reconciliation. These educational simulations do not perform real transactions or establish legal compliance.", "image": "/shots/audience/family-transactions.webp", "alt": "Erudior Family: Transaction practice section with synthetic demonstration data."},
    {"tab": "Workload evidence", "description": "Review instructional-workload plans and observed or explicitly attested learning evidence. Totals are educational records, not automatically approved regulatory hours.", "image": "/shots/audience/family-instructional-evidence.webp", "alt": "Erudior Family: Workload evidence section with synthetic demonstration data."},
    {"tab": "Credential evidence", "description": "Prepare and review local completion-evidence packets. This tab does not issue an official certificate, verify professional enrollment or establish issuer authority.", "image": "/shots/audience/family-credential-evidence.webp", "alt": "Erudior Family: Credential evidence section with synthetic demonstration data."},
    {"tab": "Learner privacy", "description": "Review local learner-data inventory, exports and cleanup options with the required adult authorization. These tools do not replace verified guardian consent or server account-deletion workflows.", "image": "/shots/audience/family-learner-privacy.webp", "alt": "Erudior Family: Learner privacy section with synthetic demonstration data."},
    {"tab": "Attendance and hours", "description": "Review proposed study days, confirm attendance and add manual learning time. Compare local records with your chosen settings; independently verify applicable requirements.", "image": "/shots/audience/family-attendance.webp", "alt": "Erudior Family: Attendance and hours section with synthetic demonstration data."},
    {"tab": "Courses", "description": "Assign installed courses to learners, inspect progress and review community-course provenance before adding a version to a child’s plan.", "image": "/shots/audience/family-courses.webp", "alt": "Erudior Family: Courses section with synthetic demonstration data."},
    {"tab": "Grades", "description": "Review assessment results and teacher-assessed work using your configured grading weights and cutoffs.", "image": "/shots/audience/family-grades.webp", "alt": "Erudior Family: Grades section with synthetic demonstration data."},
    {"tab": "Student work", "description": "Inspect writing, assignments and submitted learning evidence, and record the supported adult feedback or grading actions.", "image": "/shots/audience/family-work.webp", "alt": "Erudior Family: Student work section with synthetic demonstration data."},
    {"tab": "Reading and activities", "description": "Keep reading logs and records for physical education, arts and other educational activities alongside course study.", "image": "/shots/audience/family-reading.webp", "alt": "Erudior Family: Reading and activities section with synthetic demonstration data."},
    {"tab": "Documents", "description": "Organize supporting files and portfolio evidence in the local family workspace.", "image": "/shots/audience/family-documents.webp", "alt": "Erudior Family: Documents section with synthetic demonstration data."},
    {"tab": "Reports", "description": "Prepare printable progress reports, report cards, transcripts and portfolios from the available local records. Families remain responsible for any official submission.", "image": "/shots/audience/family-reports.webp", "alt": "Erudior Family: Reports section with synthetic demonstration data."},
    {"tab": "Academic records", "description": "Configure graduation goals, review credit and evidence audits, and preview portable record imports or exports. These are family records, not verified institutional credentials.", "image": "/shots/audience/family-academic-records.webp", "alt": "Erudior Family: Academic records section with synthetic demonstration data."},
    {"tab": "Students", "description": "Manage local learner profiles and course access. Profile switching is adult-protected; a profile does not create an independent online child account.", "image": "/shots/audience/family-students.webp", "alt": "Erudior Family: Students section with synthetic demonstration data."},
    {"tab": "State rules", "description": "Read the app’s jurisdiction summaries and configure your local school-year expectations. The summaries are not legal advice or a guarantee of current requirements.", "image": "/shots/audience/family-state.webp", "alt": "Erudior Family: State rules section with synthetic demonstration data."},
    {"tab": "Learning games", "description": "Run installed-content review boards, bingo, memory and matching, with classroom tools such as timers, polls and random selection. Games do not award academic credit.", "image": "/shots/audience/family-games.webp", "alt": "Erudior Family: Learning games section with synthetic demonstration data."},
    {"tab": "Interactive presentations", "description": "Create and review decks from installed content, then use teacher-paced or student-paced presentation. Local delivery and enabled live sessions are distinct; this is not video conferencing.", "image": "/shots/audience/family-presentations.webp", "alt": "Erudior Family: Interactive presentations section with synthetic demonstration data."},
    {"tab": "Live room", "description": "Host supported course-choice quizzes with a room code, optional timer, teams or cooperative scoring. This tab appears only when the live service is enabled and requires internet access.", "image": "/shots/audience/family-live.webp", "alt": "Erudior Family: Live room section with synthetic demonstration data."},
    {"tab": "Settings and backup", "description": "Configure the local family or classroom, grading and adult access controls. Export backups, use passphrase-encrypted recovery, and verify restored records before relying on them.", "image": "/shots/audience/family-settings.webp", "alt": "Erudior Family: Settings and backup section with synthetic demonstration data."},
  ],
  "teachers": [
    {"tab": "Overview", "description": "Review local classroom, school and learner activity.", "image": "/shots/audience/classroom-overview.webp", "alt": "Erudior Classroom: Overview section with synthetic demonstration data."},
    {"tab": "Learning paths", "description": "Review stable skills, prerequisites and exact-source evidence across courses. Make adult-supervised placement decisions without presenting manual placement as assessed mastery.", "image": "/shots/audience/classroom-learning-paths.webp", "alt": "Erudior Classroom: Learning paths section with synthetic demonstration data."},
    {"tab": "Learning diagnostics", "description": "Inspect observed learning patterns and select targeted practice, support plans and follow-up reviews. These are educational observations, not clinical diagnoses.", "image": "/shots/audience/classroom-diagnostics.webp", "alt": "Erudior Classroom: Learning diagnostics section with synthetic demonstration data."},
    {"tab": "Content exchange", "description": "Import and export supported CASE, QTI and Common Cartridge content with explicit mappings and validation. External content does not gain trust or grades automatically; LTI requires separate approved registration.", "image": "/shots/audience/classroom-interoperability.webp", "alt": "Erudior Classroom: Content exchange section with synthetic demonstration data."},
    {"tab": "Document cases", "description": "Prepare versioned educational documents and case files, approve exact source versions, and review annotations, submitted evidence and revisions.", "image": "/shots/audience/classroom-document-cases.webp", "alt": "Erudior Classroom: Document cases section with synthetic demonstration data."},
    {"tab": "Advanced assessment", "description": "Build and review structured assessment activities and evidence using supported formats. Review and grading remain tied to the selected source and learner work.", "image": "/shots/audience/classroom-advanced-assessment.webp", "alt": "Erudior Classroom: Advanced assessment section with synthetic demonstration data."},
    {"tab": "Scientific workspaces", "description": "Prepare measurement, graphing, uncertainty and design activities, then inspect learner submissions and provide feedback.", "image": "/shots/audience/classroom-scientific.webp", "alt": "Erudior Classroom: Scientific workspaces section with synthetic demonstration data."},
    {"tab": "Branching scenarios", "description": "Author decisions, state changes and timelines, assign a reviewed version, and review the learner’s choices and resulting evidence.", "image": "/shots/audience/classroom-branching.webp", "alt": "Erudior Classroom: Branching scenarios section with synthetic demonstration data."},
    {"tab": "Transaction practice", "description": "Use fictional transaction cases, document revisions, deadlines and ledger reconciliation. These educational simulations do not perform real transactions or establish legal compliance.", "image": "/shots/audience/classroom-transactions.webp", "alt": "Erudior Classroom: Transaction practice section with synthetic demonstration data."},
    {"tab": "Workload evidence", "description": "Review instructional-workload plans and observed or explicitly attested learning evidence. Totals are educational records, not automatically approved regulatory hours.", "image": "/shots/audience/classroom-instructional-evidence.webp", "alt": "Erudior Classroom: Workload evidence section with synthetic demonstration data."},
    {"tab": "Credential evidence", "description": "Prepare and review local completion-evidence packets. This tab does not issue an official certificate, verify professional enrollment or establish issuer authority.", "image": "/shots/audience/classroom-credential-evidence.webp", "alt": "Erudior Classroom: Credential evidence section with synthetic demonstration data."},
    {"tab": "Learner privacy", "description": "Review local learner-data inventory, exports and cleanup options with the required adult authorization. These tools do not replace verified guardian consent or server account-deletion workflows.", "image": "/shots/audience/classroom-learner-privacy.webp", "alt": "Erudior Classroom: Learner privacy section with synthetic demonstration data."},
    {"tab": "Classes", "description": "Create local classes and rosters, assign available courses with due dates, and export class files for learner devices.", "image": "/shots/audience/classroom-classes.webp", "alt": "Erudior Classroom: Classes section with synthetic demonstration data."},
    {"tab": "Class collaboration", "description": "Coordinate local peer feedback, group projects, conferences, notices and field-trip reflections. Teacher and learner views support reviewed feedback; this is not remote school messaging or video calling.", "image": "/shots/audience/classroom-classroom-workflows.webp", "alt": "Erudior Classroom: Class collaboration section with synthetic demonstration data."},
    {"tab": "Gradebook", "description": "Compare learners and assigned courses, inspect available results and export gradebook data.", "image": "/shots/audience/classroom-gradebook.webp", "alt": "Erudior Classroom: Gradebook section with synthetic demonstration data."},
    {"tab": "Hand-ins", "description": "Import and validate learner hand-in files, retain immutable submission history, and make recorded review decisions against exact submitted snapshots.", "image": "/shots/audience/classroom-handins.webp", "alt": "Erudior Classroom: Hand-ins section with synthetic demonstration data."},
    {"tab": "Student work", "description": "Inspect learner assignments and evidence, then use the relevant review or feedback workflow.", "image": "/shots/audience/classroom-work.webp", "alt": "Erudior Classroom: Student work section with synthetic demonstration data."},
    {"tab": "Grades", "description": "Review assessment results and teacher-graded work using the workspace’s grading configuration.", "image": "/shots/audience/classroom-grades.webp", "alt": "Erudior Classroom: Grades section with synthetic demonstration data."},
    {"tab": "Reports", "description": "Generate printable reports from available local student records; separately verify any institutional reporting requirements.", "image": "/shots/audience/classroom-reports.webp", "alt": "Erudior Classroom: Reports section with synthetic demonstration data."},
    {"tab": "Academic records", "description": "Review configurable credit requirements and evidence, preserve correction history, and preview portable record exchanges. Local statements are not automatically institution-verified.", "image": "/shots/audience/classroom-academic-records.webp", "alt": "Erudior Classroom: Academic records section with synthetic demonstration data."},
    {"tab": "Students", "description": "Maintain local learner profiles used by classroom rosters and assignments. Online school identity and multi-device account provisioning are not enabled by this tab.", "image": "/shots/audience/classroom-students.webp", "alt": "Erudior Classroom: Students section with synthetic demonstration data."},
    {"tab": "Learning games", "description": "Run installed-content review boards, bingo, memory and matching, with classroom tools such as timers, polls and random selection. Games do not award academic credit.", "image": "/shots/audience/classroom-games.webp", "alt": "Erudior Classroom: Learning games section with synthetic demonstration data."},
    {"tab": "Interactive presentations", "description": "Create and review decks from installed content, then use teacher-paced or student-paced presentation. Local delivery and enabled live sessions are distinct; this is not video conferencing.", "image": "/shots/audience/classroom-presentations.webp", "alt": "Erudior Classroom: Interactive presentations section with synthetic demonstration data."},
    {"tab": "Live room", "description": "Host supported course-choice quizzes with a room code, optional timer, teams or cooperative scoring. This tab appears only when the live service is enabled and requires internet access.", "image": "/shots/audience/classroom-live.webp", "alt": "Erudior Classroom: Live room section with synthetic demonstration data."},
    {"tab": "Settings and backup", "description": "Configure the local family or classroom, grading and adult access controls. Export backups, use passphrase-encrypted recovery, and verify restored records before relying on them.", "image": "/shots/audience/classroom-settings.webp", "alt": "Erudior Classroom: Settings and backup section with synthetic demonstration data."},
  ],
  "live-rooms": [
    {"tab": "Host / Create room", "description": "Open Live room in the installed app’s adult area. Choose an installed course and supported question set, select individual, team or cooperative play, then create the room.", "image": "/shots/audience/live-host-lobby.webp", "alt": "Live host lobby after creating a room with synthetic course questions."},
    {"tab": "Join room", "description": "Share the six-character code. Learners open the web app’s Join room screen and enter the code plus a nickname; they do not need a student account.", "image": "/shots/audience/live-player-question.webp", "alt": "Player view after joining the isolated live room and starting a question."},
    {"tab": "Lobby and teams", "description": "Check who has joined, remove unsuitable nicknames and, in team mode, assign or randomize balanced teams before starting.", "image": "/shots/audience/live-host-lobby.webp", "alt": "Host lobby showing synthetic demonstration participants."},
    {"tab": "Questions and pacing", "description": "Start a question, let players answer, then reveal the answer and response counts. Untimed and timed formats keep progression under host control.", "image": "/shots/audience/live-player-question.webp", "alt": "Player question screen during a genuine isolated live session."},
    {"tab": "Answers and results", "description": "Players see their own results and aggregate response or team totals. The host alone sees named individual scores. These quiz results do not award grades or mastery.", "image": "/shots/audience/live-player-results.webp", "alt": "Player results in a genuine isolated live session with synthetic participants."},
    {"tab": "Finish and close", "description": "Review the session summary and close the room when finished. The session is temporary and is not a permanent learner record.", "image": "/shots/audience/live-host-results.webp", "alt": "Host summary after completing a genuine isolated live session."},
  ],
};

export default function AudiencePage({ kind }: { kind: Audience }) {
  const info = INFO[kind];
  return <div className="page home audience-page">
    <section className="home-hero">
      <p className="home-kicker">Erudior</p>
      <h1>{info.title}</h1>
      <p className="home-lede">{info.intro}</p>
      <div className="row home-ctas">
        <a className="btn primary" href="/download">Download Erudior</a>
        <a className="btn" href={appUrl("/")}>Open the web app</a>
      </div>
    </section>
    <section className="home-feature-row">
      <div className="home-feature-text"><h2>Learn more</h2><p>Explore the installed app’s family, classroom and live-session tools. The public website is an account-free guide; it does not hold your private family or classroom records.</p></div>
      <figure className="home-shot"><img src={info.image} alt={info.alt} loading="lazy" width={1280} height={800}/><figcaption className="small muted">Actual app interface in a browser with synthetic demonstration data. Not a native-device capture; installed previews may differ. <a href="/shots/audience/manifest.json">Capture build and source details</a>.</figcaption></figure>
    </section>
    {info.sections.map(section => <section className="home-feature-row audience-section" key={section.title}>
      <div className="home-feature-text">
        <h2>{section.title}</h2><p>{section.body}</p>
        <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>
      </div>
    </section>)}
    <section className="roadmap-group audience-tab-guide" aria-labelledby="audience-tabs">
      <h2 id="audience-tabs">{kind === "live-rooms" ? "Live room walkthrough" : "Explore every tab"}</h2>
      <p className="muted">Expand a section to see its purpose and app view. The guide follows the current app’s Family and Classroom sections. Availability depends on workspace setup, installed version and enabled services; recent features may require a newer installer. The public web app provides account-free learning and joining live rooms, not these private management workspaces. Captures and their build details are identified alongside the images.</p>
      {TAB_GUIDES[kind].map((item, index) => <details key={item.tab} className="audience-tab-details">
        <summary><span>{kind === "live-rooms" ? "Step" : "Tab"} {index + 1}: {item.tab}</span></summary>
        <div className="home-feature-row audience-section">
          <div className="home-feature-text"><h3>{item.tab}</h3><p>{item.description}</p></div>
          {item.image && <figure className="home-shot">
            <img src={item.image} alt={item.alt || item.tab} loading="lazy" width={1280} height={800}/>
            <figcaption className="small muted">{kind === "live-rooms" ? "Actual Erudior live-room interface using an isolated test service and synthetic participants, not a production classroom or native-device capture." : "Actual Erudior app interface rendered in a browser with synthetic demonstration records, not a mockup or native-device capture. Newer source features may not be in your installed preview until the next release."}</figcaption>
          </figure>}
        </div>
      </details>)}
    </section>
    <section className="home-final"><h2>Explore more Erudior tools</h2><p><a href="/roadmap">Read the development roadmap</a> to see what is complete and what remains in progress.</p></section>
  </div>;
}
