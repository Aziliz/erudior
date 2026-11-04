// Terms of Use, Privacy Policy and the general disclaimer, shared by the public site
// (erudior.com/terms, /privacy) and the app (/terms, /privacy, /licenses on app.erudior.com and in
// the desktop app, so they work offline). Courses that need more (professional, exam-prep and AP
// courses) carry their own `disclaimer`. Not reviewed by a lawyer yet.
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

const EngineLicenseText = lazy(() => import("./EngineLicenseText"));

export const TERMS_UPDATED = "October 24, 2026";
export const LEGAL_EMAIL = "legal@erudior.com";

export type LegalPage = "terms" | "privacy" | "licenses" | "engine-license";

/** One line shown in the site footer and the app. */
export const GENERAL_DISCLAIMER =
  "Erudior's courses are for education and information only. They may contain mistakes, and they don't replace a teacher, an accredited school or professional advice.";

/** Renders a link to another legal page (the site and the app navigate differently). */
type LinkTo = (page: LegalPage, label: string) => ReactNode;

const mail = <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>;

export function TermsOfUse({ linkTo }: { linkTo: LinkTo }) {
  return (
    <article className="prose terms-of-use">
      <h1>Terms of Use</h1>
      <p className="muted">Last updated {TERMS_UPDATED}</p>
      <p>
        These terms cover erudior.com, app.erudior.com, the Erudior desktop app and the courses in them (together, "Erudior"). Erudior is run from
        Colorado. By using Erudior you agree to these terms and to the {linkTo("privacy", "Privacy Policy")}. If you don't agree, please don't use it. A
        parent or guardian should read these terms with any child who uses Erudior.
      </p>

      <h2>Educational use only</h2>
      <p>
        Everything in Erudior (lessons, questions, practice problems, notecards, glossaries, reference sheets, community courses and anything else) is
        for educational and informational purposes only. It isn't legal, medical, financial, tax, real estate or other professional advice, and it
        doesn't replace a teacher, an accredited school or a licensed professional. Some courses carry their own disclaimer as well.
      </p>
      <p>
        Erudior is an early version (below 1.0) that is still being written and checked. Courses can contain mistakes, and rules, laws and exams change.
        Check anything important against current official sources. Don't use Erudior to replace homeschool or regular school until it says it's ready
        for that.
      </p>
      <p>
        Erudior is a study tool. It isn't a school, it isn't accredited, and it doesn't grant credit, grades, diplomas or licensing hours. Grades,
        credits and transcripts you make with its homeschool tools are your own records, issued by your home school; check what your state requires.
        Erudior doesn't promise that using it will get you a grade, a credit, a passing exam score, a license or a job. You're responsible for how you
        use what you learn here.
      </p>

      <h2>Using Erudior</h2>
      <ul>
        <li>Erudior's own courses are free to use for personal study, homeschooling and teaching.</li>
        <li>Don't copy Erudior's courses to sell them or to republish them as your own.</li>
        <li>Don't break, overload or misuse the service, try to get into accounts or data that aren't yours, or use it to harass anyone.</li>
        <li>We may change, pause or stop any part of Erudior, and we may remove content or accounts that break these terms.</li>
      </ul>

      <h2>Community courses</h2>
      <p>
        Community courses are written by people who use Erudior. They go live marked "Not reviewed" and may be inaccurate or incomplete even after a
        review; reviewers check them, but can't guarantee them. To report a problem, use the Report button on the course.
      </p>
      <ul>
        <li>
          <b>What belongs here.</b> Community courses teach real, factual subjects: school subjects, skills, languages, professions and exams, history,
          science and the like. Fan wikis, game guides and theories, fictional lore, opinion pieces and similar content aren't allowed (you're free to
          share them elsewhere) and will be removed.
        </li>
        <li>
          <b>Who can publish.</b> Authors must be 18 or older, sign in, and accept the community course terms shown before they write.
        </li>
        <li>
          <b>Ownership.</b> When you publish a community course, you assign to Erudior all rights, including copyright, in what you publish, so the course
          can stay free for everyone and be kept up to date. If that assignment isn't effective for any reason, you give Erudior an exclusive, worldwide,
          perpetual, irrevocable, royalty-free license to use, copy, change, publish and sublicense it. You confirm that you wrote it or have the right to
          publish it. Your name is shown as its author while you look after it.
        </li>
        <li>
          <b>Who can change a course.</b> The course's owner (at first, its author), the editors the owner adds, and Erudior can change, publish or
          unpublish it. Only the owner and Erudior can delete it or change its editors. If the owner hasn't signed in for a year, another author may take
          the course over and become its owner; the previous owner stays on as an editor.
        </li>
        <li>
          <b>Removal.</b> Erudior may take down any community course or close any account that breaks these terms, without notice. Copies that people
          already added stay on their devices.
        </li>
      </ul>

      <h2>Copyright and trademarks</h2>
      <p>
        Erudior's courses, software and design belong to Erudior or its licensors. Erudior uses open-source software under its own licenses; see{" "}
        {linkTo("licenses", "third-party licenses")}.
      </p>
      <p>
        If you believe something on Erudior uses your work without permission, email {mail} with the address of the page, what it copies, your contact
        details, and a statement that you believe in good faith the use isn't authorized. We'll look into it and remove anything that infringes. We close
        the accounts of people who repeatedly post infringing material.
      </p>
      <p>
        Names of exams, organizations and products (for example AP®, a registered trademark of the College Board, and PSI) belong to their owners.
        Erudior isn't affiliated with or endorsed by them.
      </p>

      <h2>No warranty</h2>
      <p>
        Erudior is provided "as is" and "as available", without warranties of any kind, express or implied, including warranties of accuracy,
        completeness, fitness for a particular purpose and non-infringement. We don't promise that Erudior will be available, error-free or secure, or
        that your data will never be lost; keep backups of anything important (the app can save one for you).
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, Erudior and the people who make it aren't liable for any indirect, incidental, special or consequential
        damages, or for any loss of data, grades, credits, exam results, licenses, income or opportunities, arising from your use of Erudior or its
        content, or your inability to use it. Erudior is free, so in any case our total liability to you is limited to the amount you paid us to use
        it, which is zero. Some places don't allow some of these limits; there, they apply as far as the law allows.
      </p>
      <p>
        If you publish a community course and someone makes a claim against Erudior because of it (for example, that it copies their work), you agree to
        cover Erudior's reasonable costs of that claim.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top shows the latest version. If you keep using Erudior after a change, you accept the new terms.
        Community authors are asked to accept important changes before they write again.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by the laws of the State of Colorado, USA, without regard to its conflict-of-law rules, and any dispute about them will
        be handled in the state or federal courts located in Colorado.
      </p>

      <h2>Contact</h2>
      <p>Questions about these terms: {mail}.</p>
    </article>
  );
}

export function PrivacyPolicy({ linkTo }: { linkTo: LinkTo }) {
  return (
    <article className="prose terms-of-use">
      <h1>Privacy Policy</h1>
      <p className="muted">Last updated {TERMS_UPDATED}</p>
      <p>
        Erudior is built so that we learn as little about you as possible. This policy explains what we do and don't collect. It's part of the{" "}
        {linkTo("terms", "Terms of Use")}.
      </p>

      <h2>Studying: no account, nothing sent to us</h2>
      <p>
        You don't need an account to study. Your progress, answers, notes, homeschool or classroom records and settings stay on your device: in the
        desktop app's data folder on your computer, or in your browser's storage on app.erudior.com. We don't receive them. They reach someone else only
        when you send a file yourself (for example a backup, a class file or a student's hand-in file).
      </p>
      <p>
        When you open a course, the app downloads it from our servers. Like any website, our hosting provider (Cloudflare) handles your internet address
        to deliver the page; we don't use it to identify you. The first time you run Python code in a lesson or exercise, the app downloads Python
        (Pyodide) from jsDelivr, a public service for open-source files, which handles your internet address the same way. Your code itself runs on
        your device and isn't sent anywhere.
      </p>

      <h2>Community authors</h2>
      <p>
        To write community courses you sign in with Google or GitHub, and you must be 18 or older. We keep the name and verified email address that
        service gives us, the display name you choose, when you last signed in, your courses and their history, the editors you add, and reviewers'
        notes. We use this only to run the community site: to show your name on your courses, let you and your editors work on them, let people take
        over courses whose owner has been away for a year, and handle reports. Your email isn't shown publicly; a course owner who adds you as an
        editor already knows it.
      </p>

      <h2>Reports and live rooms</h2>
      <p>
        When someone reports a course or opens a live room, we store a one-way scrambled code made from their internet address and the date (not the
        address itself), only to limit spam. Reports keep what the reporter wrote. Live room nicknames and answers are kept only in memory and are gone
        when the room closes; students should use a nickname, not their full name.
      </p>

      <h2>Children</h2>
      <p>
        Children can study without an account, and we don't collect personal information from them. Only adults can sign in. If you believe a child has
        given us personal information, email {mail} and we'll delete it.
      </p>

      <h2>Schools and teachers</h2>
      <p>
        Classroom mode keeps students' names, work and grades on the teacher's computer and in the files the teacher and students exchange. Erudior's
        servers don't receive student records.
      </p>

      <h2>What we don't do</h2>
      <ul>
        <li>No ads, no third-party trackers or analytics, and no selling or sharing of personal information.</li>
        <li>We share information only if the law requires it, or to protect people from harm.</li>
      </ul>

      <h2>Your choices</h2>
      <p>
        You can erase your progress in the app at any time (Courses → Study tools, skill evidence, and data), or delete the app's data folder or your browser's site data. Community
        authors can delete their courses, and can ask us to delete their account by emailing {mail}.
      </p>

      <h2>Changes and contact</h2>
      <p>We'll post any change here with a new date. Questions: {mail}.</p>
    </article>
  );
}

/** The open-source licenses file (public/third-party-licenses.txt, made by scripts/third-party-licenses.mjs). */
export function ThirdPartyLicenses() {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    fetch("/third-party-licenses.txt").then(
      (r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))).then(setText),
      () => setText("The license list couldn't be loaded."),
    );
  }, []);
  return (
    <article className="prose terms-of-use">
      <h1>Third-party licenses</h1>
      <p>Erudior is built with open-source software. These are the packages it includes and their licenses.</p>
      <p>
        Python in code exercises is Pyodide (Mozilla Public License 2.0, source at github.com/pyodide/pyodide), downloaded from jsDelivr the first time
        Python runs; it isn't part of the app download.
      </p>
      {text === null ? <p className="muted">Loading…</p> : <pre className="licenses-text" tabIndex={0} aria-label="License texts">{text}</pre>}
    </article>
  );
}

/** Proposed Engine license, clearly distinguished from an adopted software license. */
export function EngineLicenseDraft() {
  return <article className="prose terms-of-use">
    <h1>Erudior Engine license proposal</h1>
    <p><strong>Nonbinding draft for rights-holder and legal review. Not adopted and not effective.</strong></p>
    <p>Publication grants no permissions and imposes no obligations. Using Erudior or displaying a splash does not accept or activate this proposal. Adoption requires a separate approved change.</p>
    <p>This proposed custom source-available license outlines Engine reuse, startup attribution, and sharing modifications to distributed or publicly hosted versions. It is not an OSI-approved open-source license. Independent course content and learner records are excluded from its contribution-back requirement.</p>
    <p>Read the <a href="https://github.com/Aziliz/erudior/blob/main/LICENSE-DRAFT.md">draft in the GitHub repository</a> and the <a href="https://github.com/Aziliz/erudior/blob/main/docs/ENGINE_LICENSING.md">licensing explanation</a>. Read the separate <a href="/licenses">third-party software notices</a>; those materials retain their own terms. The licensing explanation lists the remaining ownership, contributor, trademark, compatibility and legal decisions.</p>
    <p><a href="/engine-license-draft.txt" download>Download the nonbinding draft text</a></p>
    <Suspense fallback={<p className="muted">Loading proposed license…</p>}><EngineLicenseText /></Suspense>
  </article>;
}

/** The right page for a legal page name. */
export function LegalView({ page, linkTo }: { page: LegalPage; linkTo: LinkTo }) {
  return page === "terms" ? <TermsOfUse linkTo={linkTo} /> : page === "privacy" ? <PrivacyPolicy linkTo={linkTo} /> : page === "engine-license" ? <EngineLicenseDraft /> : <ThirdPartyLicenses />;
}

export const LEGAL_TITLES: Record<LegalPage, string> = { terms: "Terms of Use", privacy: "Privacy Policy", licenses: "Third-party licenses", "engine-license": "Erudior Engine license proposal" };
