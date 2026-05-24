"use client";
import { useState, useEffect, useActionState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BasicDetails } from "./BasicDetails";
import { ImageUpload } from "../ui/Imageupload";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { createCandidateAction } from "@/lib/actions/candidates.actions";
import {
  candidateFormSchema,
  CandidateFormValues,
  CandidateWizardProps,
} from "./types";

export const CandidateWizard = ({ candidateData }: CandidateWizardProps) => {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [state, dispatch, isPending] = useActionState(createCandidateAction, null);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      firstName: candidateData?.firstName ?? "",
      lastName: candidateData?.lastName ?? "",
      gender: candidateData?.gender ?? undefined,
      dateOfBirth: candidateData?.dateOfBirth ?? "",
      phone: candidateData?.phone ?? "",
      sector: candidateData?.sector ?? undefined,
      status: candidateData?.status ?? "active",
      idNumber: candidateData?.idNumber ?? "",
    },
  });

  useEffect(() => {
    if (!state) return;
    if (state.success && state.id) {
      setCandidateId(state.id as string);
      setCurrentStep(1);
      form.reset();
    } else if (state.error) {
      if (typeof state.error === "string") {
        toast.error(t("TOAST_ERROR_TITLE"), { description: state.error });
      } else if (typeof state.error === "object" && "idNumber" in state.error) {
        form.setError("idNumber", {
          message: (state.error.idNumber as string[])[0],
        });
      }
    }
  }, [state]);

  const submitCandidate = (data: CandidateFormValues) => {
    const formData = new FormData();
    const payload = {
      ...data,
      sector: data.sector ?? "chabad",
      status: data.status ?? "active",
    };
    Object.entries(payload).forEach(([k, v]) =>
      formData.append(k, String(v ?? ""))
    );
    startTransition(() => dispatch(formData));
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (candidateId) {
        setCurrentStep(1);
        return;
      }
      form.handleSubmit(submitCandidate)();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = [
    {
      id: 1,
      title: t("BASIC_INFO"),
      component: (
        <FormProvider {...form}>
          <BasicDetails onSubmit={submitCandidate} />
        </FormProvider>
      ),
    },
    {
      id: 2,
      title: t("UPLOAD_IMAGES"),
      component: <ImageUpload candidateId={candidateId!} />,
    },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={`h-2 flex-1 rounded ${
              idx === currentStep ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="min-h-1">{steps[currentStep]?.component}</div>

      <div className="flex gap-2 justify-between pt-4 border-t">
        <Button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 0}
          variant="outline"
        >
          {t("PREV")}
        </Button>
        <Button type="button" onClick={handleNext} disabled={isPending}>
          {t("NEXT")}
        </Button>
      </div>
    </div>
  );
};
