import z from "zod";
import type { Candidate } from "@prisma/client";
import { zCandidatesTable, zCandidateStatus, zGender, zSector } from "@/lib/schema";

export const candidateFormSchema = zCandidatesTable
  .pick({
    firstName: true,
    lastName: true,
  })
  .extend({
    gender: zGender.optional(),
    idNumber: z.string().optional(),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    sector: zSector.optional(),
    status: zCandidateStatus.optional(),
  });

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;

export type CandidateWizardProps = {
  candidateData?: Candidate | null;
};
