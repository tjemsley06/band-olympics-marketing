import { useState } from "react";

const questions = [
  {
    id: "role",
    type: "single",
    section: "About You",
    question: "What best describes your role?",
    options: ["Middle School Band Director", "High School Band Director", "Orchestra Director", "Elementary Music Director", "Private Lesson Teacher", "Other"],
  },
  {
    id: "program_size",
    type: "single",
    section: "About You",
    question: "How many students are currently in your program?",
    options: ["Fewer than 50", "50–100", "101–200", "201–300", "301+"],
  },
  {
    id: "current_tracking",
    type: "multi",
    section: "About You",
    question: "How do you currently track student progress? (Select all that apply)",
    options: ["Paper objective/pass-off sheets", "Spreadsheets", "A dedicated software tool", "Grade book only", "I don't formally track it"],
  },
  {
    id: "pain_points",
    type: "multi",
    section: "About You",
    question: "What are your biggest challenges with student assessment? (Select all that apply)",
    options: [
      "Too much paper / hard to organize",
      "No easy way to motivate students",
      "Hard to track individual growth over time",
      "Private lesson teachers can't easily update progress",
      "Generating reports takes too long",
      "Marching pass-offs are difficult to organize",
    ],
  },
  {
    id: "competition_interest",
    type: "scale",
    section: "BandXP Features",
    question: "BandXP lets students compete on leaderboards — earning points for pass-offs, objectives, and practice. Separate leaderboards can be run by grade level or ensemble simultaneously. How interested are you in a competition-based motivation system like this?",
  },
  {
    id: "hidden_objectives",
    type: "scale",
    section: "BandXP Features",
    question: "BandXP lets you create fully hidden objectives — the criteria, the rubric, and the score are all invisible to students. Only you as the director can see them. This is useful for behind-the-scenes assessments like chair placement and data collection. How valuable would this be in your program?",
  },
  {
    id: "objective_sheets",
    type: "scale",
    section: "BandXP Features",
    question: "BandXP lets you build custom objective sheets (scales, rhythms, sight-reading, marching fundamentals, etc.) and track each student's progress on them across their entire time in your program. How useful would this be for you?",
  },
  {
    id: "marching_passoffs",
    type: "scale",
    section: "BandXP Features",
    question: "BandXP provides the ability for a marching pass-off tracker that's fully customizable to your show and program. How important is marching pass-off tracking to you?",
  },
  {
    id: "print_export",
    type: "scale",
    section: "BandXP Features",
    question: "You can print individual scorecards and objective sheets directly from BandXP, and download full program reports with a single click. How often would you use print/export features?",
    scaleLabels: ["Never", "Rarely", "Sometimes", "Often", "All the time"],
  },
  {
    id: "private_lessons",
    type: "scale",
    section: "BandXP Features",
    question: "Private lesson teachers can be added as editors to your program — letting them award points and mark objectives right from their phone during a lesson. How valuable would this be for your program?",
  },
  {
    id: "customization",
    type: "scale",
    section: "BandXP Features",
    question: "Nearly everything in BandXP is customizable — contest names, point values, objective categories, grade-level groupings, and more. How important is deep customization to you?",
  },
  {
    id: "pricing_comfort",
    type: "single",
    section: "Pricing",
    question: "What would you be comfortable paying annually for a tool like BandXP that replaced paper tracking, motivated students, and generated reports automatically?",
    options: ["I'd need it to be free", "Under $100/year", "$100–199/year", "$200–299/year", "$300+/year — if it saves enough time"],
  },
  {
    id: "budget_source",
    type: "multi",
    section: "Pricing",
    question: "Where would the budget most likely come from? (Select all that apply)",
    options: ["Personal / out of pocket", "School / department budget", "Booster organization", "Student activity fee", "Grant funding", "Not sure yet"],
  },
  {
    id: "pilot_interest",
    type: "single",
    section: "Wrap Up",
    question: "Would you be interested in piloting BandXP with your program?",
    options: ["Yes — sign me up!", "Maybe — I'd want to see a demo first", "Probably not right now", "No"],
  },
  {
    id: "contact_info",
    type: "contact",
    section: "Wrap Up",
    question: "Great! Tell us a bit about your school so we can follow up.",
    showWhen: (answers) => answers.pilot_interest === "Yes — sign me up!" || answers.pilot_interest === "Maybe — I'd want to see a demo first",
    fields: [
      { key: "contact_name", label: "Your Name", placeholder: "e.g. Mr. Johnson" },
      { key: "contact_email", label: "Email Address", placeholder: "you@school.edu", inputType: "email" },
      { key: "contact_school", label: "School Name", placeholder: "e.g. Westlake High School" },
      { key: "contact_district", label: "School District", placeholder: "e.g. Eanes ISD" },
    ],
  },
  {
    id: "open_feedback",
    type: "text",
    section: "Wrap Up",
    question: "Is there anything else you'd want a tool like BandXP to do? Any features or concerns we should know about?",
  },
];

const sections = [...new Set(questions.map((q) => q.section))];

const scaleDefault = ["Not at all", "Slightly", "Somewhat", "Very", "Extremely"];

export default function BandXPSurvey() {
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredScale, setHoveredScale] = useState({});

  const sectionQuestions = questions.filter((q) => {
    if (q.section !== sections[currentSection]) return false;
    if (q.showWhen && !q.showWhen(answers)) return false;
    return true;
  });

  const handleSingle = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));
  const handleMulti = (id, val) => {
    setAnswers((a) => {
      const current = a[id] || [];
      return {
        ...a,
        [id]: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
      };
    });
  };
  const handleScale = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));
  const handleText = (id, val) => setAnswers((a) => ({ ...a, [id]: val }));
  const handleContact = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const isComplete = sectionQuestions.every((q) => {
    if (q.type === "text" || q.type === "contact") return true;
    return answers[q.id] !== undefined && answers[q.id] !== "";
  });

  const progress = ((currentSection) / sections.length) * 100;

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "2rem",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 540 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #FF00EA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2rem", fontSize: "2rem",
          }}>🎺</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.2rem", color: "#fff", marginBottom: "1rem" }}>
            Thank you!
          </h1>
          <p style={{ color: "#a0a0b0", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Your responses help shape BandXP into the tool band directors actually need. We'll be in touch soon.
          </p>
          <div style={{
            marginTop: "2.5rem", padding: "1rem 2rem",
            background: "linear-gradient(135deg, #7c3aed22, #FF00EA11)",
            border: "1px solid #7c3aed44", borderRadius: 12,
            color: "#c4b5fd", fontSize: "0.9rem",
          }}>
            Own Your Practice. Earn Your Medal.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      fontFamily: "'DM Sans', sans-serif",
      color: "#e8e8f0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #1A1A2E 0%, #0A0A0A 100%)",
        borderBottom: "1px solid #ffffff11",
        padding: "1.5rem 2rem",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="/bandxp-logo.png" alt="BandXP.Live" style={{ height: 36 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "-0.025em" }}>
              <span style={{ color: "#fff" }}>Band</span>
              <span style={{ color: "#FF00EA" }}>XP</span>
              <span style={{ color: "#fff" }}>.</span>
              <span style={{ color: "#00E5FF" }}>Live</span>
            </span>
          </div>
          <span style={{ color: "#666", fontSize: "0.85rem" }}>
            {currentSection + 1} of {sections.length}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: 680, margin: "1rem auto 0" }}>
          <div style={{ height: 3, background: "#ffffff11", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #7c3aed, #FF00EA)",
              width: `${progress + (100 / sections.length)}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
            {sections.map((s, i) => (
              <span key={s} style={{
                fontSize: "0.7rem",
                color: i <= currentSection ? "#c4b5fd" : "#444",
                transition: "color 0.3s",
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem 6rem" }}>

        {/* Section title */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-block",
            padding: "0.3rem 0.8rem",
            background: "#7c3aed22",
            border: "1px solid #7c3aed44",
            borderRadius: 20,
            fontSize: "0.75rem",
            color: "#c4b5fd",
            marginBottom: "0.75rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            {sections[currentSection]}
          </div>
          {currentSection === 0 && (
            <p style={{ color: "#888", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              We're building BandXP for directors like you. This 3-minute survey helps us understand what matters most in your program.
            </p>
          )}
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {sectionQuestions.map((q, qi) => (
            <div key={q.id} style={{
              background: "#111118",
              border: "1px solid #ffffff0d",
              borderRadius: 16,
              padding: "1.75rem",
              transition: "border-color 0.2s",
            }}>
              <p style={{
                fontSize: "1rem", fontWeight: 500, lineHeight: 1.6,
                color: "#e8e8f0", marginBottom: "1.25rem", margin: "0 0 1.25rem",
              }}>
                <span style={{
                  display: "inline-block",
                  width: 24, height: 24, borderRadius: 6,
                  background: "linear-gradient(135deg, #7c3aed, #FF00EA)",
                  fontSize: "0.7rem", fontWeight: 700, color: "#fff",
                  textAlign: "center", lineHeight: "24px",
                  marginRight: "0.6rem", verticalAlign: "middle",
                }}>
                  {qi + 1}
                </span>
                {q.question}
              </p>

              {/* Single select */}
              {q.type === "single" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button key={opt} onClick={() => handleSingle(q.id, opt)} style={{
                        textAlign: "left", padding: "0.75rem 1rem",
                        borderRadius: 10, cursor: "pointer",
                        border: selected ? "1px solid #7c3aed" : "1px solid #ffffff11",
                        background: selected ? "#7c3aed22" : "#0A0A0A",
                        color: selected ? "#c4b5fd" : "#a0a0b0",
                        fontSize: "0.9rem", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: "0.75rem",
                      }}>
                        <span style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: selected ? "5px solid #7c3aed" : "2px solid #444",
                          flexShrink: 0, transition: "all 0.15s",
                        }} />
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Multi select */}
              {q.type === "multi" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {q.options.map((opt) => {
                    const selected = (answers[q.id] || []).includes(opt);
                    return (
                      <button key={opt} onClick={() => handleMulti(q.id, opt)} style={{
                        textAlign: "left", padding: "0.75rem 1rem",
                        borderRadius: 10, cursor: "pointer",
                        border: selected ? "1px solid #FF00EA" : "1px solid #ffffff11",
                        background: selected ? "#FF00EA11" : "#0A0A0A",
                        color: selected ? "#f9a8d4" : "#a0a0b0",
                        fontSize: "0.9rem", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: "0.75rem",
                      }}>
                        <span style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: selected ? "2px solid #FF00EA" : "2px solid #444",
                          background: selected ? "#FF00EA" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.65rem", color: "#0A0A0A", fontWeight: 700,
                          transition: "all 0.15s",
                        }}>
                          {selected ? "✓" : ""}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                  <p style={{ color: "#555", fontSize: "0.75rem", margin: "0.25rem 0 0 0.25rem" }}>Select all that apply</p>
                </div>
              )}

              {/* Scale */}
              {q.type === "scale" && (
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
                    {(q.scaleLabels || scaleDefault).map((label, i) => {
                      const val = i + 1;
                      const selected = answers[q.id] === val;
                      const hovered = hoveredScale[q.id] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleScale(q.id, val)}
                          onMouseEnter={() => setHoveredScale((h) => ({ ...h, [q.id]: val }))}
                          onMouseLeave={() => setHoveredScale((h) => ({ ...h, [q.id]: undefined }))}
                          style={{
                            flex: 1, padding: "0.75rem 0.25rem",
                            borderRadius: 10, cursor: "pointer",
                            border: selected ? "1px solid #7c3aed" : "1px solid #ffffff0d",
                            background: selected
                              ? "linear-gradient(135deg, #7c3aed, #FF00EA)"
                              : hovered ? "#ffffff08" : "#0A0A0A",
                            color: selected ? "#fff" : "#888",
                            fontSize: "0.75rem", fontWeight: selected ? 600 : 400,
                            transition: "all 0.15s",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "0.3rem",
                          }}>
                          <span style={{ fontSize: "1rem", fontWeight: 700 }}>{val}</span>
                          <span style={{ fontSize: "0.65rem", lineHeight: 1.2, textAlign: "center" }}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text */}
              {q.type === "text" && (
                <textarea
                  value={answers[q.id] || ""}
                  onChange={(e) => handleText(q.id, e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "#0A0A0A", border: "1px solid #ffffff11",
                    borderRadius: 10, padding: "0.85rem 1rem",
                    color: "#e8e8f0", fontSize: "0.9rem",
                    resize: "vertical", outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.6,
                  }}
                />
              )}

              {/* Contact info */}
              {q.type === "contact" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {q.fields.map((field) => (
                    <div key={field.key}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#888", marginBottom: "0.35rem" }}>
                        {field.label}
                      </label>
                      <input
                        type={field.inputType || "text"}
                        value={answers[field.key] || ""}
                        onChange={(e) => handleContact(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%", boxSizing: "border-box",
                          background: "#0A0A0A", border: "1px solid #ffffff11",
                          borderRadius: 10, padding: "0.75rem 1rem",
                          color: "#e8e8f0", fontSize: "0.9rem",
                          outline: "none", fontFamily: "'DM Sans', sans-serif",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: "2.5rem",
        }}>
          <button
            onClick={() => setCurrentSection((s) => Math.max(0, s - 1))}
            style={{
              padding: "0.75rem 1.5rem", borderRadius: 10,
              border: "1px solid #ffffff11", background: "transparent",
              color: currentSection === 0 ? "#333" : "#888",
              cursor: currentSection === 0 ? "default" : "pointer",
              fontSize: "0.9rem", transition: "all 0.15s",
            }}
            disabled={currentSection === 0}
          >
            ← Back
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={() => { if (isComplete) setCurrentSection((s) => s + 1); }}
              style={{
                padding: "0.75rem 2rem", borderRadius: 10,
                border: "none", cursor: isComplete ? "pointer" : "not-allowed",
                background: isComplete
                  ? "linear-gradient(135deg, #7c3aed, #FF00EA)"
                  : "#1a1a2e",
                color: isComplete ? "#fff" : "#444",
                fontSize: "0.9rem", fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              style={{
                padding: "0.75rem 2rem", borderRadius: 10,
                border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #7c3aed, #FF00EA)",
                color: "#fff", fontSize: "0.9rem", fontWeight: 600,
              }}
            >
              Submit Survey ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
