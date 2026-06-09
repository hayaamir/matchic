import { ImageUpload } from "@/components/ui/Imageupload";
import { FormSection } from "../FormSection";
import { PhotoUploaderPlaceholder } from "../PhotoUploaderPlaceholder";

type PhotosSectionProps = {
  phase: "form" | "photos";
  candidateId: string | null;
  sectionRef: React.RefObject<HTMLDivElement | null>;
};

export const PhotosSection = ({ phase, candidateId, sectionRef }: PhotosSectionProps) => (
  <FormSection
    number="08"
    title="תמונות"
    subtitle="אופציונלי · אפשר להוסיף מאוחר יותר"
    sectionRef={sectionRef}
  >
    {phase === "form" ? (
      <PhotoUploaderPlaceholder />
    ) : (
      <ImageUpload candidateId={candidateId!} />
    )}
  </FormSection>
);
