"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import type { Doc, Id } from "../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { useCreateCandidate } from "@/hooks/candidate/useCandidates";
import { InputFormField, SelectFormField } from "./form-fields";
import {
  zCandidatesTable,
  zCandidateStatus,
  zGender,
  zSector,
} from "@/shared/schema";
import { zodUnionToOptions } from "@/lib/zodUnionToOptions";

export const candidateFormSchema = zCandidatesTable
  .pick({
    firstName: true,
    lastName: true,
    gender: true,
    idNumber: true,
    phone: true,
    dateOfBirth: true,
    status: true,
  })
  .extend({
    sector: zSector.optional(),
    status: zCandidateStatus.optional(),
  });

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

type Props = {
  candidateData: Doc<"candidates"> | null;
  candidateId: Id<"candidates"> | null;
};

export function CandidateForm({ candidateData, candidateId }: Props) {
  const t = useTranslations();
  const createCandidate = useCreateCandidate();

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

  const onSubmit = async (data: CandidateFormValues) => {
    try {
      const newCandidateId = await createCandidate({
        ...data,
        sector: data.sector ?? "chabad",
        status: data.status ?? "active",
      });

      toast.success(t("SUCCESS_CANDIDATE_CREATED"), {
        description: t("CANDIDATE_CREATED_DESCRIPTION", {
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      form.reset();
    } catch (error) {
      console.error("שגיאה בשמירת מועמד:", error);

      toast.error(t("TOAST_ERROR_TITLE"), {
        description: t("TRY_LATER"),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>{t("PERSONAL_DETAILS")}</div>

        <InputFormField
          control={form.control}
          name="firstName"
          label={t("FIRST_NAME")}
          placeholder={t("FIRST_NAME_PLACEHOLDER")}
        />

        <InputFormField
          control={form.control}
          name="lastName"
          label={t("LAST_NAME")}
          placeholder={t("LAST_NAME_PLACEHOLDER")}
        />

        <InputFormField
          control={form.control}
          name="dateOfBirth"
          label={t("DATE_OF_BIRTH")}
          type="date"
        />

        <InputFormField
          control={form.control}
          name="idNumber"
          label={t("ID")}
          placeholder={t("ID_PLACEHOLDER")}
          type="text"
        />

        <SelectFormField
          control={form.control}
          name="gender"
          label={t("GENDER")}
          placeholder={t("GENDER_PLACEHOLDER")}
          options={zodUnionToOptions(zGender)}
        />

        <div>
          <div>{t("CONTACT_DETAILS")}</div>

          <InputFormField
            control={form.control}
            name="phone"
            label={t("PHONE")}
            placeholder={t("PHONE_PLACEHOLDER")}
            type="tel"
          />
        </div>

        <div>{t("ADDITIONAL_INFO")}</div>
        <div>
          <SelectFormField
            control={form.control}
            name="sector"
            label={t("SECTOR")}
            placeholder={t("SECTOR_PLACEHOLDER")}
            options={zodUnionToOptions(zSector)}
          />
        </div>

        <Button type="submit">{t("ADD_CANDIDATE_BUTTON")}</Button>
      </form>
    </Form>
  );
}
