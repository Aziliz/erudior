// The Terms of Use and the general disclaimer, shared by the public site (erudior.com/terms)
// and the app (/terms on app.erudior.com and in the desktop app, so it works offline).
// Courses that need more (professional and exam-prep courses) carry their own `disclaimer`.

export const TERMS_UPDATED = "October 24, 2026";
export const LEGAL_EMAIL = "legal@erudior.com";

/** One line shown in the site footer and the app. */
export const GENERAL_DISCLAIMER =
  "Erudior's courses are for education and information only. They may contain mistakes, and they don't replace a teacher, an accredited school or professional advice.";

export function TermsOfUse() {
  return (
    <article className="prose terms-of-use">
      <h1>Terms of Use</h1>
      <p className="muted">Last updated {TERMS_UPDATED}</p>
      <p>
        These terms cover erudior.com, app.erudior.com, the Erudior desktop app and the courses in them (together, "Erudior"). Erudior is run from
        Colorado. By using Erudior you agree to these terms. If you don't agree, please don't use it. A parent or guardian should read these terms with
        any child who uses Erudior.
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
        You're responsible for how you use what you learn here. Erudior doesn't promise that using it will get you a grade, a credit, a passing exam
        score, a license or a job, and homeschool records you keep with it are your own; check what your state requires.
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
        Community courses are written by other people, not by Erudior. They go live marked "Not reviewed" and may be inaccurate or incomplete even after
        a review. Erudior isn't responsible for them. To report a problem, use the Report button on the course.
      </p>
      <p>
        To publish a course you must be 18 or older and accept the community course terms shown before you write. You keep the copyright in what you
        write and give Erudior permission to host it and show it to everyone without charge. You're responsible for having the right to publish it.
      </p>

      <h2>Your information</h2>
      <ul>
        <li>
          You don't need an account to study. Your progress, records and settings stay on your device (in the desktop app's data folder, or in your
          browser's storage on app.erudior.com). We don't receive them unless you send us a file yourself.
        </li>
        <li>
          Community authors sign in with Google or GitHub. We keep the name and email address that service gives us, your display name, your courses
          and your review history, to run the community site. We don't sell it or use it for advertising.
        </li>
        <li>
          When someone reports a course or opens a live room, we store a one-way scrambled code made from their internet address and the date (not
          the address itself), only to limit spam. Reports keep what the reporter wrote. Live room nicknames and answers are kept only in memory and
          are gone when the room closes.
        </li>
        <li>Erudior has no ads and no third-party trackers.</li>
      </ul>

      <h2>Copyright</h2>
      <p>
        Erudior's courses, software and design belong to Erudior or its licensors. If you believe something on Erudior uses your work without
        permission, email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with the address of the page, what it copies and how to reach you. We'll
        look into it and remove anything that infringes.
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

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top shows the latest version. If you keep using Erudior after a change, you accept the new terms.
      </p>

      <h2>Law</h2>
      <p>
        These terms are governed by the laws of the State of Colorado, USA, without regard to its conflict-of-law rules, and any dispute about them
        will be handled in the state or federal courts located in Colorado.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>.
      </p>
    </article>
  );
}
