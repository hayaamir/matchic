import { useTranslations } from "next-intl";

import { CandidateStatus } from "@/shared/types";
import { StatusBadge } from "./ui/status-badge";
import { User } from "lucide-react";

type CandidateCardProps = {
  img?: any;
  status: CandidateStatus;
  full_name: String;
};

export const CandidateCard = ({
  img,
  status,
  full_name,
}: CandidateCardProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <div className="relative w-48 h-48 overflow-hidden rounded-xl bg-gray-200">
        <StatusBadge variant={status} className="absolute top-2 start-2 z-10">
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
        <div className="text-gray-900 text-base font-semibold ">
          {full_name}
        </div>
        {/* <div className=" text-gray-700 ">{age}</div> */}
      </div>
    </div>
  );
};
