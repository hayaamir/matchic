import { CandidateWizard } from "@/components/CandidateForm/CandidateWizard";

const Questionnaire = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--mc-bg-alt)",
        fontFamily: "var(--font-heebo, 'Heebo', sans-serif)",
        direction: "rtl",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "40px 56px 140px",
        }}
      >
        <CandidateWizard />
      </div>
    </div>
  );
};

export default Questionnaire;
