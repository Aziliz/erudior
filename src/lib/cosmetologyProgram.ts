import type { ProgramCourse, StudyProgram } from "./studyPrograms";

const course = (courseId: string, title: string, modules: string[], outcomes: string[], assignment: string, recommendedBefore: string[] = []): ProgramCourse =>
  ({ courseId, title, recommendedBefore, modules, outcomes, assignment });

/** Cosmetology theory: what a licensing school teaches in class, before and alongside practice. */
export const COSMETOLOGY_PROGRAM: StudyProgram = {
  id: "cosmetology-theory",
  version: 1,
  title: "Cosmetology Theory",
  description: "The classroom theory of a cosmetology program: safety and science, then hair, skin and nail services, then state laws and the written licensing exam.",
  notice: "Theory only, as preparation for cosmetology school. Licensing requires supervised practice hours at a licensed school, and requirements differ by state. This program does not count toward those hours.",
  stages: [
    { id: "foundations", title: "Safety, science and professional practice",
      summary: "Infection control, the science of skin, hair and nails, and the chemistry and electricity behind salon services.",
      milestone: "Write a salon safety and sanitation plan covering every service you will study.",
      courses: [
        course("cosmo-infection-control", "Infection Control and Safety",
          ["Microorganisms and how infection spreads", "Cleaning, disinfection and sterilization", "Standard precautions and blood exposure", "Chemical safety and safety data sheets", "Workplace safety and ergonomics", "Regulatory agencies"],
          ["Choose the right cleaning or disinfection step for each tool and surface.", "Explain the rules that protect clients and workers."],
          "Write a step-by-step disinfection procedure for a full station and an exposure-incident plan."),
        course("cosmo-anatomy-physiology", "Anatomy and Physiology for Cosmetologists",
          ["Cells and tissues", "Bones and muscles of the head, face, neck, arms and hands", "Nerves and circulation", "The integumentary system", "Body systems overview", "Contraindications for services"],
          ["Identify the structures involved in each salon service.", "Recognize conditions that rule out or change a service."],
          "Build an illustrated guide to the muscles and bones used in facials and hand massage."),
        course("cosmo-skin-hair-nail-science", "Skin, Hair and Nail Science",
          ["Skin structure and function", "Skin disorders and diseases", "Hair structure and growth", "Hair and scalp disorders", "Nail structure and growth", "Nail disorders and diseases"],
          ["Describe the structure and growth of skin, hair and nails.", "Recognize disorders that need referral to a doctor."],
          "Write client-analysis guides for skin, hair and nails, including when to refer.", ["cosmo-anatomy-physiology"]),
        course("cosmo-chemistry-electricity", "Chemistry and Electricity for Cosmetology",
          ["Matter, elements and compounds", "pH, acids and alkalis", "Chemistry of salon products", "Electricity basics and safety", "Electrotherapy and light therapy", "Product safety and labels"],
          ["Explain how pH and chemical reactions drive salon services.", "Use electrical equipment safely."],
          "Explain the chemistry of three salon products from their ingredient labels.", ["cosmo-infection-control"]),
        course("cosmo-professional-practice", "Professional Practice and Client Communication",
          ["Professional image and ethics", "Client consultation", "Communication and difficult situations", "Career paths", "Time management", "Lifelong learning"],
          ["Run a structured client consultation.", "Apply professional ethics to salon situations."],
          "Write and role-play a consultation script and a plan for three difficult client situations."),
      ] },
    { id: "services", title: "Service theory",
      summary: "The theory behind hair, skin and nail services: principles, products, procedures and safety, ready for hands-on practice at school.",
      milestone: "Assemble a service theory binder with one procedure card per service, including safety checks.",
      courses: [
        course("cosmo-haircutting-styling", "Haircutting and Styling Theory",
          ["Head form, sections and elevation", "Cutting techniques and tools", "Haircut design principles", "Wet styling and blow-drying", "Thermal styling", "Braiding and extensions"],
          ["Explain how angles, elevation and guides create a haircut.", "Plan a style suited to the client's hair and face shape."],
          "Design three haircuts on paper with sections, elevations and guides, and explain each choice.", ["cosmo-skin-hair-nail-science"]),
        course("cosmo-hair-color", "Hair Coloring Theory",
          ["Color theory and the level system", "Types of hair color", "Hair lightening", "Color formulation", "Color correction", "Safety and patch tests"],
          ["Formulate color using level, tone and developer.", "Plan safe color services and corrections."],
          "Write color formulations for five fictional clients, including one correction.", ["cosmo-chemistry-electricity", "cosmo-skin-hair-nail-science"]),
        course("cosmo-chemical-texture", "Chemical Texture Services Theory",
          ["Hair chemistry and bonds", "Permanent waving", "Chemical relaxers", "Keratin and smoothing treatments", "Curl re-forming", "Safety and client protection"],
          ["Explain how chemical services change the hair's bonds.", "Choose and sequence texture services safely."],
          "Write a texture-service plan, including strand tests and safety steps, for three fictional clients.", ["cosmo-chemistry-electricity", "cosmo-skin-hair-nail-science"]),
        course("cosmo-skin-care-makeup", "Skin Care and Makeup Theory",
          ["Skin analysis", "Facial procedures", "Hair removal", "Makeup color theory", "Makeup application principles", "Product ingredients and safety"],
          ["Plan facials and hair removal suited to the client's skin.", "Apply color theory to makeup design."],
          "Design a facial plan and a makeup look for two fictional clients with written rationale.", ["cosmo-skin-hair-nail-science"]),
        course("cosmo-nail-care", "Nail Care Theory",
          ["Manicuring", "Pedicuring", "Nail tips, wraps and acrylics", "Gels and light-cured systems", "Nail art", "Safety and ventilation"],
          ["Plan nail services suited to the client's nails.", "Explain the chemistry and safety of enhancement products."],
          "Write procedure cards for a manicure, a pedicure and one enhancement service.", ["cosmo-skin-hair-nail-science", "cosmo-chemistry-electricity"]),
      ] },
    { id: "licensing-business", title: "Licensing and business",
      summary: "State laws, the written licensing exam, and running a salon business.",
      milestone: "Prepare a licensing checklist for your state and a written exam study plan.",
      courses: [
        course("cosmo-state-laws-exam", "State Laws and Written Exam Preparation",
          ["How state licensing works", "Scope of practice and rules", "Sanitation and safety rules review", "Science and services review", "Practice exams by topic", "Exam-day strategies"],
          ["Answer written-exam questions across safety, science and services.", "Find and apply your own state's rules."],
          "Complete timed practice exams and an error log with a final review plan.",
          ["cosmo-haircutting-styling", "cosmo-hair-color", "cosmo-chemical-texture", "cosmo-skin-care-makeup", "cosmo-nail-care"]),
        course("cosmo-salon-business", "Salon Business",
          ["Career and business options", "Booth rental and employment", "Pricing and retail", "Marketing and client retention", "Bookkeeping and taxes", "Building a clientele"],
          ["Compare ways to work in the industry and their finances.", "Plan pricing and marketing for a small business."],
          "Write a one-year business plan for a booth rental or small salon.", ["cosmo-professional-practice"]),
      ] },
  ],
  sources: [
    { title: "NIC cosmetology national theory exam bulletin (Mississippi board)", url: "https://www.msbcb.ms.gov/wp-content/uploads/2025/02/cosmetology_national_theory_english.pdf" },
  ],
  reviewedOn: "2026-11-09",
};

/** Shared outline from Cosmetology Theory, reused by barbering, esthetics and nail technology. */
export function cosmetologyOutline(courseId: string): ProgramCourse {
  const found = COSMETOLOGY_PROGRAM.stages.flatMap(item => item.courses).find(item => item.courseId === courseId);
  if (!found) throw new Error(`No Cosmetology Theory outline for ${courseId}`);
  return found;
}
