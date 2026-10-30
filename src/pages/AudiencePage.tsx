import { appUrl } from "../lib/site";

type Audience = "parents" | "live-rooms" | "teachers";
const INFO: Record<Audience, { title: string; intro: string; image: string; alt: string; sections: {title:string; body:string; points:string[]}[] }> = {
  parents: {
    title: "For parents and homeschool families",
    intro: "Plan learning, support independent study, and keep your family's academic records in one place. Erudior is an early version intended for supplementary learning until its full homeschool readiness work is completed.",
    image: "/shots/parent-overview.png",
    alt: "Parent overview showing student attendance, subject hours and reminders.",
    sections: [
      { title: "Organize your homeschool", body: "Set up your school year and student profiles, then assign courses and follow learning progress from the parent area.", points: ["Track assignments and completed lessons", "Review practice scores and work requiring your grading", "Keep students working on courses appropriate for their progress"] },
      { title: "Keep the records you need", body: "Erudior includes tools to help assemble school records. Families remain responsible for checking their own jurisdiction's requirements.", points: ["Attendance, study time and activity records", "Grades, progress reports and report cards", "Transcripts, portfolios and exportable documents"] },
      { title: "Your data, on your device", body: "The desktop app stores family records locally rather than uploading them to Erudior's servers.", points: ["Separate learner progress", "Parent-area access controls", "Local backups and exports"] },
    ],
  },
  "live-rooms": {
    title: "Live rooms",
    intro: "Host interactive questions for a family study session or classroom. Players join from their devices using a room code—without creating student accounts.",
    image: "/shots/live-host.png",
    alt: "Live room host screen with join code and participants.",
    sections: [
      { title: "Start a session", body: "A host selects course questions and opens a room. Participants use a short join code from a phone, tablet or computer.", points: ["Questions from lessons, modules and courses", "A shared room code for players", "No student sign-in required to join"] },
      { title: "Teach at your pace", body: "Present one question at a time, with an optional timed format to make review sessions more engaging.", points: ["Host-paced or timed play", "Answer counts after each question", "Host-controlled progression"] },
      { title: "Privacy-conscious participation", body: "Participants see their own results, while the host sees overall session information.", points: ["Players can use nicknames", "Scores remain on the host screen", "Live-room information is temporary rather than a permanent student account"] },
    ],
  },
  teachers: {
    title: "For teachers",
    intro: "Organize classes, assign learning, and review student work with Erudior's classroom mode. Classroom workflows are actively being expanded.",
    image: "/shots/gradebook.png",
    alt: "Classroom gradebook showing assigned courses and learner progress.",
    sections: [
      { title: "Create and organize classes", body: "Manage class rosters and assign available courses with due dates.", points: ["Multiple classes and rosters", "Course assignments with due dates", "Student progress by course"] },
      { title: "Collect and assess work", body: "Students can study on a shared machine or use a class file on their own device and return a hand-in file.", points: ["Import and verify hand-in files", "Follow grades and completed lessons", "Export the gradebook for further work"] },
      { title: "Lead interactive sessions", body: "Use live rooms for group review and class participation.", points: ["Live quizzes from course material", "Participation without student accounts", "Host-controlled question pacing"] },
    ],
  },
};


type TabGuide = { tab: string; description: string; image?: string; alt?: string };
const TAB_GUIDES: Record<Audience, TabGuide[]> = {
  parents: [
    { tab: "Overview", description: "Review school-year progress, student attendance, accumulated study hours and reminders.", image: "/shots/parent-overview.png", alt: "Actual Erudior parent overview showing attendance and school-year progress." },
    { tab: "Attendance and hours", description: "Review proposed school days, confirm attendance, record additional time and compare study totals against the selected jurisdiction's requirements." },
    { tab: "Courses", description: "Assign courses to individual children and track progress through lessons." },
    { tab: "Grades", description: "Review assessments and manually graded work using the family's grading setup." },
    { tab: "Student work", description: "Inspect writing, assignments and other submitted learning evidence." },
    { tab: "Reading and activities", description: "Record reading, physical education, arts and other educational activities." },
    { tab: "Documents", description: "Organize supporting documents and portfolio evidence." },
    { tab: "Reports", description: "Prepare school records, progress reports, report cards and transcripts." },
    { tab: "Students", description: "Manage each student's profile and course access." },
    { tab: "State rules", description: "Review location-specific homeschooling requirements and configuration; requirements must be verified independently." },
    { tab: "Live room", description: "Host an interactive course-based quiz session when live rooms are enabled.", image: "/shots/live-host.png", alt: "Actual Erudior live quiz host screenshot." },
    { tab: "Settings and backup", description: "Manage family settings, access controls, backups and recovery." },
  ],
  teachers: [
    { tab: "Overview", description: "Review classroom activity and school information." },
    { tab: "Classes", description: "Create class rosters, add learners and set course assignments and due dates." },
    { tab: "Gradebook", description: "Review learners and assigned courses together, see results and export gradebook data.", image: "/shots/gradebook.png", alt: "Actual Erudior classroom gradebook screenshot." },
    { tab: "Hand-ins", description: "Import student hand-in files, verify classroom assignment and review submitted progress. Submission history and review workflows are evolving." },
    { tab: "Student work", description: "Inspect evidence and activity records associated with learners' work." },
    { tab: "Grades", description: "Review graded results and teacher-assessed work." },
    { tab: "Reports", description: "Generate classroom reports using available student records." },
    { tab: "Students", description: "Maintain classroom learner profiles and roster details." },
    { tab: "Live room", description: "Host course review games with join codes and question pacing.", image: "/shots/live-host.png", alt: "Actual Erudior live room host screenshot." },
    { tab: "Settings and backup", description: "Configure classroom information and export or restore local records." },
  ],
  "live-rooms": [
    { tab: "Host / Create room", description: "Choose course material, open a live session and share its join code.", image: "/shots/live-host.png", alt: "Actual Erudior host live room and join code screenshot." },
    { tab: "Join room", description: "Learners join from a separate device using the supplied code, without a student account.", image: "/shots/live-player.png", alt: "Actual Erudior learner live quiz screenshot." },
    { tab: "Questions and pacing", description: "Advance questions at the host's pace or run a timed game." },
    { tab: "Answers and results", description: "View answer counts at the host screen; learners see only their own responses and results." },
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
      <div className="home-feature-text"><h2>Learn more</h2><p>Explore what Erudior offers today and the tools being developed for complete family and classroom use.</p></div>
      <div className="home-shot"><img src={info.image} alt={info.alt} loading="lazy" width={1280} height={800}/></div>
    </section>
    {info.sections.map(section => <section className="home-feature-row audience-section" key={section.title}>
      <div className="home-feature-text">
        <h2>{section.title}</h2><p>{section.body}</p>
        <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>
      </div>
    </section>)}
    <section className="roadmap-group audience-tab-guide" aria-labelledby="audience-tabs">
      <h2 id="audience-tabs">{kind === "live-rooms" ? "Live room walkthrough" : "Explore every tab"}</h2>
      <p className="muted">Tab labels and behavior are based on the current Erudior desktop application source. Pictures are existing genuine Erudior screenshots; tabs without a picture are documented without a simulated image.</p>
      {TAB_GUIDES[kind].map((item, index) => <article key={item.tab} className="home-feature-row audience-section">
        <div className="home-feature-text">
          <p className="home-kicker">{kind === "live-rooms" ? "Step" : "Tab"} {index + 1}</p>
          <h3>{item.tab}</h3><p>{item.description}</p>
        </div>
        {item.image && <div className="home-shot"><img src={item.image} alt={item.alt || item.tab} loading="lazy" width={1280} height={800}/></div>}
      </article>)}
    </section>
    <section className="home-final"><h2>Explore more Erudior tools</h2><p><a href="/roadmap">Read the development roadmap</a> to see what is complete and what remains in progress.</p></section>
  </div>;
}
