import engineLicenseDraft from "../../LICENSE-DRAFT.md?raw";

/** Bundled canonical draft; no remote text request or separate runtime copy. */
export default function EngineLicenseText() {
  return <pre className="licenses-text" tabIndex={0} aria-label="Nonbinding proposed license text">{engineLicenseDraft}</pre>;
}
