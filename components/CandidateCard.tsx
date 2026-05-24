"use client";
import { useTranslations } from "next-intl";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

import "dayjs/locale/he";
import "dayjs/locale/en";
dayjs.extend(relativeTime);

import { CandidateStatus } from "@/lib/types";
import { StatusBadge } from "./ui/status-badge";
import { User } from "lucide-react";
import { useParams } from "next/navigation";

type CandidateCardProps = {
  img?: any;
  status: CandidateStatus;
  fullName: String;
  createdAt: number;
};

export const CandidateCard = ({
  img,
  status,
  fullName,
  createdAt,
}: CandidateCardProps) => {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();

  dayjs.locale(locale);

  const createdFromNow = dayjs(createdAt).fromNow();

  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <div className="relative w-56 h-56 overflow-hidden rounded-xl bg-gray-200 shadow-sm">
        <StatusBadge status={status} className="absolute top-2 start-2 z-10">
          {t(`STATUS_${status.toUpperCase()}`)}
        </StatusBadge>
        {img ? (
          <img
            src={img}
            alt="Candidate img"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="px-2 text-xs text-start">
        <div className="text-gray-900 text-base font-semibold ">{fullName}</div>
        <div className=" text-gray-700 ">
          {t("CREATED")} {createdFromNow}
        </div>
      </div>
    </div>
  );
};
