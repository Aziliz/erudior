import { coreOutline } from "./collegeCoreProgram";
import { CALCULUS, DIFFERENTIAL_EQUATIONS, LINEAR_ALGEBRA, MULTIVARIABLE, PROBABILITY_STATISTICS, UNIVERSITY_PHYSICS_1, UNIVERSITY_PHYSICS_2 } from "./catalogOutlines";
import { ELECTRICAL_ENGINEERING_PROGRAM } from "./engineeringPrograms";
import { PRE_MED_PROGRAM } from "./medicalPrograms";
import { ENGINEERING_EDUCATION_PROGRAMS } from "./professionalPrograms";
import { PHYSICAL_CHEMISTRY_1 } from "./majorsScience";
import { findOutline, m, majorProgram, stage } from "./programBuilder";

const LABS = "Labs are simulations and analysis; hands-on lab and design-build work happens at your school.";
const GEN_CHEM_1 = coreOutline("college-general-chemistry-1"), GEN_CHEM_2 = coreOutline("college-general-chemistry-2");
const INTRO_ENGINEERING = findOutline(ELECTRICAL_ENGINEERING_PROGRAM, "ee-intro-engineering");
const PROGRAMMING = findOutline(ELECTRICAL_ENGINEERING_PROGRAM, "ee-programming-for-engineers");
const PROFESSIONAL_PRACTICE = findOutline(ELECTRICAL_ENGINEERING_PROGRAM, "ee-professional-practice");
const CIRCUITS = findOutline(ELECTRICAL_ENGINEERING_PROGRAM, "ee-circuit-analysis-1");
const SURVEYING = findOutline(ENGINEERING_EDUCATION_PROGRAMS, "survey-measurement");
const ORGO_1 = findOutline(PRE_MED_PROGRAM, "pre-med-organic-chemistry-1");

/** Engineering science courses shared across engineering majors (one outline each). */
const GRAPHICS = m("eng-graphics-cad", "Engineering Graphics and CAD", "Sketching and projection; Dimensioning and tolerances; Section and auxiliary views; 3D solid modeling; Assemblies; Drawings for manufacturing",
  ["Communicate designs in standard drawings.", "Model parts and assemblies in CAD."], "Model and fully document a multi-part assembly.");
const STATICS = m("eng-statics", "Statics", "Forces and vectors; Equilibrium of particles; Rigid bodies and moments; Trusses and frames; Friction; Centroids and moments of inertia",
  ["Analyze forces in structures at rest.", "Draw correct free-body diagrams."], "Analyze a real truss or frame and check it in software.", ["science-uphys1", "math-calculus"]);
const DYNAMICS = m("eng-dynamics", "Dynamics", "Particle kinematics; Particle kinetics; Work and energy; Impulse and momentum; Rigid-body kinematics; Rigid-body kinetics",
  ["Analyze moving particles and bodies.", "Choose force, energy or momentum methods."], "Model a mechanism's motion and verify it with simulation.", ["eng-statics"]);
const MECHANICS_OF_MATERIALS = m("eng-mechanics-of-materials", "Mechanics of Materials", "Stress and strain; Axial loading; Torsion; Bending; Shear and combined stresses; Deflection and buckling",
  ["Compute stresses and deflections.", "Size members against failure."], "Size the members of a small structure and justify the safety factors.", ["eng-statics"]);
const MATERIALS_SCIENCE = m("eng-materials-science", "Materials Science", "Atomic structure and bonding; Crystal structures and defects; Mechanical properties; Phase diagrams; Metals, ceramics and polymers; Failure and corrosion",
  ["Relate structure to material properties.", "Select materials for a design."], "Select materials for a product and justify the choices.", ["college-general-chemistry-1"]);
const THERMODYNAMICS = m("eng-thermodynamics", "Engineering Thermodynamics", "Properties and states; The first law; Control volumes; The second law and entropy; Power cycles; Refrigeration cycles",
  ["Apply the laws of thermodynamics to devices.", "Analyze power and refrigeration cycles."], "Analyze a real power plant or engine cycle and suggest improvements.", ["science-uphys1", "math-calculus"]);
const FLUID_MECHANICS = m("eng-fluid-mechanics", "Fluid Mechanics", "Fluid properties and statics; Fluid kinematics; Bernoulli and energy equations; Momentum analysis; Pipe flow; Boundary layers and drag",
  ["Analyze fluid systems.", "Size pipes, pumps and flow devices."], "Design a piping system with a pump and justify it with calculations.", ["eng-dynamics"]);
const HEAT_TRANSFER = m("eng-heat-transfer", "Heat Transfer", "Conduction; Transient conduction; Convection; Heat exchangers; Radiation; Numerical heat transfer",
  ["Analyze conduction, convection and radiation.", "Design heat exchangers."], "Design a heat exchanger and verify it numerically.", ["eng-thermodynamics", "eng-fluid-mechanics"]);
const NUMERICAL_METHODS = m("eng-numerical-methods", "Numerical Methods for Engineers", "Errors and roots; Linear systems; Curve fitting; Numerical calculus; ODE solvers; Engineering applications",
  ["Solve engineering problems numerically.", "Judge numerical accuracy."], "Solve an engineering problem numerically and validate the result.", ["ee-programming-for-engineers", "math-diffeq"]);
const SYSTEM_DYNAMICS = m("eng-system-dynamics-control", "System Dynamics and Control", "Modeling mechanical and electrical systems; Transfer functions; Time response; Frequency response; Feedback and stability; PID control",
  ["Model and analyze dynamic systems.", "Design feedback controllers."], "Model a physical system and design a controller in simulation.", ["eng-dynamics", "math-diffeq"]);

const ENGINEERING_SOURCES = (society: string, url: string) => [
  { title: "ABET: criteria for accrediting engineering programs", url: "https://www.abet.org/accreditation/accreditation-criteria/" },
  { title: society, url },
];

export const ENGINEERING_MAJORS = [
  majorProgram({
    id: "major-mechanical-engineering", title: "Mechanical Engineering", category: "Engineering and technology", extra: LABS,
    description: "A mechanical engineering major: math and physics, engineering mechanics and thermal sciences, then design and manufacturing.",
    stages: [
      stage("foundations", "Math, science and engineering tools", "The math, physics, chemistry and tools every mechanical engineer uses.", "Keep an engineering notebook of worked problems.",
        [CALCULUS, MULTIVARIABLE, DIFFERENTIAL_EQUATIONS, LINEAR_ALGEBRA, UNIVERSITY_PHYSICS_1, UNIVERSITY_PHYSICS_2, GEN_CHEM_1, INTRO_ENGINEERING, PROGRAMMING, GRAPHICS]),
      stage("core", "Engineering science", "Mechanics, materials, thermal-fluid sciences and circuits.", "Analyze one real device per course.",
        [STATICS, DYNAMICS, MECHANICS_OF_MATERIALS, MATERIALS_SCIENCE, THERMODYNAMICS, FLUID_MECHANICS, HEAT_TRANSFER, CIRCUITS, NUMERICAL_METHODS]),
      stage("design", "Design and systems", "Machine design, manufacturing, vibrations, control and professional practice.", "Complete a design project from requirements to drawings.",
        [SYSTEM_DYNAMICS,
          m("me-machine-design", "Machine Design", "Design process and failure theories; Fatigue; Shafts and keys; Bearings; Gears; Fasteners, springs and welds",
            ["Design machine elements against failure.", "Apply design codes and factors of safety."], "Design a gearbox with calculations and drawings.", ["eng-mechanics-of-materials"]),
          m("me-manufacturing", "Manufacturing Processes", "Casting and molding; Forming; Machining; Joining; Additive manufacturing; Design for manufacturing",
            ["Choose manufacturing processes.", "Design parts for manufacture and cost."], "Plan the manufacture of a product with process choices and cost.", ["eng-materials-science"]),
          m("me-vibrations", "Mechanical Vibrations", "Free vibration; Damping; Forced vibration; Multi-degree-of-freedom systems; Modal analysis; Vibration control",
            ["Analyze vibrating systems.", "Design to avoid resonance."], "Analyze and fix a vibration problem in a machine model.", ["eng-dynamics", "math-diffeq"]),
          m("me-instrumentation", "Measurement and Instrumentation", "Measurement systems and uncertainty; Sensors; Signal conditioning; Data acquisition; Statistics of data; Experimental design",
            ["Design measurement systems.", "Quantify measurement uncertainty."], "Design a data acquisition system for an experiment with an uncertainty budget.", ["ee-circuit-analysis-1"]),
          m("me-finite-element", "Finite Element Analysis", "Element formulation; Trusses and beams; 2D and 3D solids; Meshing; Thermal analysis; Validation",
            ["Run and interpret finite element analyses.", "Validate results against theory."], "Analyze a part with FEA and validate against hand calculations.", ["eng-mechanics-of-materials", "eng-numerical-methods"]),
          m("me-thermal-fluid-design", "Thermal-Fluid Systems Design", "System requirements; Piping and pumps; Heat exchangers; HVAC systems; Energy systems; Optimization",
            ["Design thermal-fluid systems.", "Optimize for cost and efficiency."], "Design a complete thermal-fluid system with a report.", ["eng-heat-transfer"]),
          PROFESSIONAL_PRACTICE]),
    ],
    sources: ENGINEERING_SOURCES("ASME: education", "https://www.asme.org/"),
  }),
  majorProgram({
    id: "major-civil-engineering", title: "Civil Engineering", category: "Engineering and technology", extra: LABS,
    description: "A civil engineering major: math, physics and mechanics, then structures, geotechnical, water, transportation and construction.",
    stages: [
      stage("foundations", "Math, science and engineering tools", "The math, science and tools civil engineers use.", "Keep an engineering notebook of worked problems.",
        [CALCULUS, MULTIVARIABLE, DIFFERENTIAL_EQUATIONS, LINEAR_ALGEBRA, UNIVERSITY_PHYSICS_1, UNIVERSITY_PHYSICS_2, GEN_CHEM_1, PROBABILITY_STATISTICS, INTRO_ENGINEERING, PROGRAMMING, GRAPHICS, SURVEYING]),
      stage("core", "Engineering science", "Mechanics, materials and fluids.", "Analyze one real structure or system per course.",
        [STATICS, DYNAMICS, MECHANICS_OF_MATERIALS, FLUID_MECHANICS, NUMERICAL_METHODS,
          m("civil-construction-materials", "Civil Engineering Materials", "Aggregates; Portland cement concrete; Asphalt; Steel; Wood and masonry; Testing and specifications",
            ["Select and specify construction materials.", "Interpret material test results."], "Design a concrete mix for given requirements and justify it.", ["eng-mechanics-of-materials"])]),
      stage("specialties", "Civil engineering practice", "Structures, geotechnical, water, environment, transportation and construction.", "Complete an integrated design of a small site.",
        [m("civil-structural-analysis", "Structural Analysis", "Loads and load paths; Determinate structures; Influence lines; Deflections; Indeterminate structures; Matrix and computer methods",
            ["Analyze structures under loads.", "Use computer structural analysis."], "Analyze a building frame by hand and in software and compare.", ["eng-mechanics-of-materials"]),
          m("civil-steel-design", "Steel Design", "Design philosophy and codes; Tension members; Compression members; Beams; Connections; Building systems",
            ["Design steel members to code.", "Design connections."], "Design the steel framing for a small building.", ["civil-structural-analysis"]),
          m("civil-concrete-design", "Reinforced Concrete Design", "Concrete behavior; Flexure; Shear; Columns; Slabs and footings; Serviceability",
            ["Design reinforced concrete members to code.", "Check serviceability."], "Design the concrete members of a small building.", ["civil-structural-analysis", "civil-construction-materials"]),
          m("civil-geotechnical", "Geotechnical Engineering", "Soil classification; Compaction; Seepage; Effective stress; Consolidation; Shear strength",
            ["Characterize soils.", "Predict settlement and strength."], "Interpret a soil report and predict settlement for a building.", ["eng-mechanics-of-materials"]),
          m("civil-foundation", "Foundation Engineering", "Site investigation; Shallow foundations; Deep foundations; Retaining walls; Slope stability; Ground improvement",
            ["Design foundations and retaining walls.", "Assess slope stability."], "Design the foundations for a building from a soil report.", ["civil-geotechnical"]),
          m("civil-hydraulics-hydrology", "Hydraulics and Hydrology", "The hydrologic cycle; Rainfall and runoff; Open channel flow; Culverts and storm sewers; Detention; Flood analysis",
            ["Estimate runoff and floods.", "Design drainage structures."], "Design stormwater drainage for a small development.", ["eng-fluid-mechanics"]),
          m("civil-environmental", "Environmental Engineering", "Water quality; Water treatment; Wastewater treatment; Air quality; Solid waste; Regulations",
            ["Design treatment processes.", "Apply environmental regulations."], "Size a water or wastewater treatment process for a town.", ["college-general-chemistry-1", "eng-fluid-mechanics"]),
          m("civil-transportation", "Transportation Engineering", "Traffic flow; Highway geometry; Intersections and signals; Pavement design; Transportation planning; Safety",
            ["Analyze traffic and design roads.", "Plan transportation systems."], "Redesign a real intersection with traffic analysis.", ["math-probstats"]),
          m("civil-construction-management", "Construction Engineering and Management", "Project delivery; Estimating; Scheduling; Contracts; Safety; Quality and sustainability",
            ["Estimate and schedule construction projects.", "Manage contracts and safety."], "Estimate and schedule a small construction project.", ["civil-construction-materials"]),
          PROFESSIONAL_PRACTICE]),
    ],
    sources: ENGINEERING_SOURCES("ASCE: education", "https://www.asce.org/"),
  }),
  majorProgram({
    id: "major-aerospace-engineering", title: "Aerospace Engineering", category: "Engineering and technology", extra: LABS,
    description: "An aerospace engineering major: math, physics and engineering science, then aerodynamics, propulsion, structures, flight and spacecraft.",
    stages: [
      stage("foundations", "Math, science and engineering tools", "The math, physics and tools aerospace engineers use.", "Keep an engineering notebook of worked problems.",
        [CALCULUS, MULTIVARIABLE, DIFFERENTIAL_EQUATIONS, LINEAR_ALGEBRA, UNIVERSITY_PHYSICS_1, UNIVERSITY_PHYSICS_2, GEN_CHEM_1, INTRO_ENGINEERING, PROGRAMMING, GRAPHICS]),
      stage("core", "Engineering science", "Mechanics, materials, thermodynamics, fluids and control.", "Analyze one real aircraft or spacecraft system per course.",
        [STATICS, DYNAMICS, MECHANICS_OF_MATERIALS, MATERIALS_SCIENCE, THERMODYNAMICS, FLUID_MECHANICS, NUMERICAL_METHODS, SYSTEM_DYNAMICS]),
      stage("aerospace", "Aerospace engineering", "Aerodynamics, propulsion, structures, flight and orbits, then design.", "Complete an aircraft or spacecraft conceptual design.",
        [m("aero-aerodynamics", "Aerodynamics", "Airfoils and wings; Potential flow; Thin airfoil theory; Finite wings; Viscous effects; Computational aerodynamics",
            ["Predict lift and drag.", "Analyze airfoils and wings."], "Analyze a wing's aerodynamics and compare to published data.", ["eng-fluid-mechanics"]),
          m("aero-compressible-flow", "Compressible Flow", "Speed of sound and Mach number; Normal shocks; Oblique shocks and expansions; Nozzle flow; Supersonic airfoils; Hypersonic flow introduction",
            ["Analyze compressible and supersonic flows.", "Design nozzles."], "Design a supersonic nozzle and predict its performance.", ["aero-aerodynamics", "eng-thermodynamics"]),
          m("aero-flight-mechanics", "Flight Mechanics", "Aircraft performance; Range and endurance; Static stability; Dynamic stability; Equations of motion; Handling qualities",
            ["Predict aircraft performance.", "Analyze stability and control."], "Predict the performance and stability of a real aircraft.", ["eng-dynamics", "aero-aerodynamics"]),
          m("aero-propulsion", "Aerospace Propulsion", "Thrust and efficiency; Gas turbine cycles; Inlets, compressors and turbines; Combustors and nozzles; Rocket propulsion; Electric propulsion",
            ["Analyze jet and rocket engines.", "Compare propulsion options for missions."], "Size a propulsion system for a given mission.", ["aero-compressible-flow"]),
          m("aero-structures", "Aerospace Structures", "Loads on aircraft and spacecraft; Thin-walled beams; Shear flow; Stability of structures; Composites; Fatigue and damage tolerance",
            ["Analyze lightweight aerospace structures.", "Design with composites."], "Analyze a wing box under flight loads.", ["eng-mechanics-of-materials"]),
          m("aero-orbital-mechanics", "Orbital Mechanics", "Two-body problem; Orbital elements; Orbital maneuvers; Interplanetary transfers; Perturbations; Rendezvous",
            ["Compute orbits and maneuvers.", "Plan transfers and rendezvous."], "Plan the maneuvers for a satellite mission with delta-v budget.", ["eng-dynamics"]),
          m("aero-spacecraft-design", "Spacecraft Systems Design", "Mission design; Power; Thermal control; Attitude determination and control; Communications; Systems engineering",
            ["Design spacecraft subsystems.", "Trade off subsystems against requirements."], "Complete a conceptual design of a small satellite.", ["aero-orbital-mechanics", "aero-structures"]),
          m("aero-aircraft-design", "Aircraft Design", "Requirements and sizing; Configuration layout; Aerodynamic design; Propulsion integration; Weight and balance; Performance and cost",
            ["Carry an aircraft from requirements to concept.", "Trade off design choices."], "Complete a conceptual design of an aircraft for a mission.", ["aero-flight-mechanics", "aero-propulsion", "aero-structures"]),
          PROFESSIONAL_PRACTICE]),
    ],
    sources: ENGINEERING_SOURCES("AIAA: education", "https://www.aiaa.org/"),
  }),
  majorProgram({
    id: "major-chemical-engineering", title: "Chemical Engineering", category: "Engineering and technology", extra: LABS,
    description: "A chemical engineering major: chemistry, math and physics, then balances, thermodynamics, transport, reactions, separations and process design.",
    stages: [
      stage("foundations", "Math, science and engineering tools", "Chemistry, math, physics and engineering tools.", "Keep an engineering notebook of worked problems.",
        [CALCULUS, MULTIVARIABLE, DIFFERENTIAL_EQUATIONS, LINEAR_ALGEBRA, UNIVERSITY_PHYSICS_1, UNIVERSITY_PHYSICS_2, GEN_CHEM_1, GEN_CHEM_2, ORGO_1, INTRO_ENGINEERING, PROGRAMMING]),
      stage("core", "Chemical engineering science", "Balances, thermodynamics and transport.", "Solve one process problem per course end to end.",
        [m("chee-material-energy-balances", "Material and Energy Balances", "Process variables; Material balances; Reacting systems; Multiphase systems; Energy balances; Process simulation",
            ["Write and solve process balances.", "Use process simulation software."], "Balance a full process flowsheet by hand and in a simulator.", ["college-general-chemistry-2"]),
          PHYSICAL_CHEMISTRY_1,
          m("chee-thermodynamics", "Chemical Engineering Thermodynamics", "Properties of fluids; Equations of state; Phase equilibrium; Solution thermodynamics; Chemical reaction equilibrium; Process applications",
            ["Predict phase and reaction equilibria.", "Use equations of state."], "Predict the equilibrium of a real separation or reaction system.", ["chee-material-energy-balances"]),
          m("chee-fluid-transport", "Fluid Flow and Momentum Transport", "Fluid statics; Viscous flow; Pipe flow; Pumps and compressors; Flow measurement; Non-Newtonian fluids",
            ["Analyze fluid flow in processes.", "Size pumps and piping."], "Design the piping and pumps for a process unit.", ["chee-material-energy-balances", "math-diffeq"]),
          m("chee-heat-mass-transfer", "Heat and Mass Transfer", "Conduction and convection; Heat exchangers; Diffusion; Convective mass transfer; Interphase transfer; Analogies",
            ["Analyze heat and mass transfer.", "Design heat exchangers and transfer equipment."], "Design a heat exchanger and a gas absorber.", ["chee-fluid-transport"]),
          NUMERICAL_METHODS]),
      stage("process", "Processes and design", "Separations, reactions, control, safety and plant design.", "Complete a plant design with economics.",
        [m("chee-separations", "Separation Processes", "Equilibrium stages; Distillation; Absorption and stripping; Extraction; Membranes and adsorption; Crystallization and drying",
            ["Design separation equipment.", "Choose separations for a process."], "Design a distillation column for a real mixture.", ["chee-thermodynamics", "chee-heat-mass-transfer"]),
          m("chee-reaction-engineering", "Chemical Reaction Engineering", "Rate laws; Batch reactors; Continuous reactors; Multiple reactions; Nonisothermal reactors; Catalysis",
            ["Design chemical reactors.", "Analyze rate data."], "Size a reactor for a real reaction from rate data.", ["chee-thermodynamics", "math-diffeq"]),
          m("chee-process-control", "Process Dynamics and Control", "Process dynamics; Transfer functions; Feedback control; Controller tuning; Stability; Advanced control strategies",
            ["Model process dynamics.", "Design and tune controllers."], "Design and tune a control system for a process unit in simulation.", ["chee-reaction-engineering"]),
          m("chee-process-safety", "Process Safety", "Toxicology and exposure; Fires and explosions; Relief systems; Hazard identification; Risk assessment; Safety management",
            ["Identify and assess process hazards.", "Design safety systems."], "Run a hazard study of a process and recommend safeguards.", ["chee-material-energy-balances"]),
          m("chee-unit-operations-lab", "Unit Operations Analysis", "Experimental planning; Fluid and heat transfer operations; Separations operations; Reactors; Data analysis; Technical reporting",
            ["Analyze unit operations data.", "Write professional technical reports."], "Analyze published or simulated data from three unit operations.", ["chee-heat-mass-transfer", "chee-separations"]),
          m("chee-process-design", "Process Design and Economics", "Process synthesis; Flowsheet simulation; Equipment sizing; Cost estimation; Profitability; Sustainability",
            ["Design a chemical process.", "Evaluate its economics and sustainability."], "Design a plant with flowsheet, sizing and economics.", ["chee-separations", "chee-reaction-engineering"]),
          PROFESSIONAL_PRACTICE]),
    ],
    sources: ENGINEERING_SOURCES("AIChE: education", "https://www.aiche.org/"),
  }),
  majorProgram({
    id: "major-industrial-engineering", title: "Industrial and Systems Engineering", category: "Engineering and technology",
    description: "An industrial and systems engineering major: math, probability and programming, then operations research, production, quality, human factors and supply chains.",
    stages: [
      stage("foundations", "Math, science and engineering tools", "Math, probability, physics and programming.", "Keep an engineering notebook of worked problems.",
        [CALCULUS, MULTIVARIABLE, LINEAR_ALGEBRA, PROBABILITY_STATISTICS, UNIVERSITY_PHYSICS_1, INTRO_ENGINEERING, PROGRAMMING, STATICS]),
      stage("core", "Industrial engineering science", "Optimization, stochastic models, statistics, economics and work design.", "Solve one real operations problem per course.",
        [m("ie-operations-research", "Operations Research: Optimization", "Linear programming; The simplex method; Duality and sensitivity; Network models; Integer programming; Modeling software",
            ["Formulate and solve optimization models.", "Interpret sensitivity results."], "Optimize a real scheduling or allocation problem and present the results.", ["math-linear-algebra"]),
          m("ie-stochastic-models", "Stochastic Models", "Random processes; Markov chains; Poisson processes; Queueing models; Reliability; Decision analysis",
            ["Model systems with randomness.", "Analyze queues and reliability."], "Model a real service queue and recommend staffing.", ["math-probstats"]),
          m("ie-engineering-statistics", "Engineering Statistics", "Data and estimation; Hypothesis testing; Regression; Design of experiments; Statistical process control; Measurement systems",
            ["Analyze engineering data.", "Design experiments."], "Design and analyze an experiment to improve a process.", ["math-probstats"]),
          m("ie-engineering-economy", "Engineering Economy", "Time value of money; Cash flow analysis; Comparing alternatives; Depreciation and taxes; Replacement; Risk and uncertainty",
            ["Compare projects economically.", "Account for taxes and risk."], "Evaluate an investment decision for a real organization.", ["math-calculus"]),
          m("ie-work-design-ergonomics", "Work Design and Ergonomics", "Methods analysis; Time study; Workstation design; Physical ergonomics; Cognitive workload; Safety",
            ["Design efficient, safe work.", "Measure and improve work methods."], "Redesign a real job or workstation with measurements."),
          m("ie-simulation", "Simulation Modeling", "Simulation concepts; Random number generation; Discrete-event simulation; Input modeling; Output analysis; Simulation software",
            ["Build discrete-event simulations.", "Analyze simulation output statistically."], "Simulate a real system and recommend changes.", ["ie-stochastic-models", "ee-programming-for-engineers"])]),
      stage("systems", "Production and systems", "Production, quality, facilities, supply chains, human factors and systems engineering.", "Complete a process improvement project.",
        [m("ie-production-systems", "Production Planning and Control", "Forecasting; Aggregate planning; Inventory models; Material requirements planning; Scheduling; Lean production",
            ["Plan and control production.", "Apply lean principles."], "Build a production plan and inventory policy for a factory.", ["ie-operations-research"]),
          m("ie-quality-engineering", "Quality Engineering", "Quality philosophy; Control charts; Process capability; Acceptance sampling; Six Sigma; Reliability",
            ["Monitor and improve quality.", "Run a Six Sigma project."], "Complete a DMAIC improvement project on a real process.", ["ie-engineering-statistics"]),
          m("ie-facilities-design", "Facilities Planning and Design", "Product and process analysis; Flow and layout; Material handling; Warehouse design; Location analysis; Layout software",
            ["Design facility layouts.", "Plan material handling."], "Design the layout of a small factory or warehouse.", ["ie-production-systems"]),
          m("ie-supply-chain-logistics", "Supply Chain and Logistics Engineering", "Supply chain design; Network optimization; Transportation; Inventory across the chain; Risk; Analytics",
            ["Optimize supply chain networks.", "Model logistics decisions."], "Optimize a distribution network with real or realistic data.", ["ie-operations-research"]),
          m("ie-human-factors", "Human Factors Engineering", "Human capabilities; Displays and controls; Usability; Human error; Automation; Evaluation methods",
            ["Design for human capabilities.", "Evaluate systems with users."], "Run a usability study and redesign an interface.", ["ie-work-design-ergonomics"]),
          m("ie-systems-engineering", "Systems Engineering", "Systems thinking; Requirements; Architecture; Trade studies; Verification and validation; Life-cycle management",
            ["Apply systems engineering to complex projects.", "Run trade studies."], "Write a systems engineering plan with requirements and a trade study.", ["ie-engineering-economy"]),
          PROFESSIONAL_PRACTICE]),
    ],
    sources: ENGINEERING_SOURCES("IISE: education", "https://www.iise.org/"),
  }),
];
