import type { ProfileFormInput } from "./profileSchema";

export type CompletenessFieldKey = keyof ProfileFormInput;

export type CompletenessResult = {
  total: number;
  filled: number;
  percent: number;
  filledByField: Record<CompletenessFieldKey, boolean>;
};

function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidYears(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 40;
}

function isValidSalary(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function computeCompleteness(values: Partial<ProfileFormInput>): CompletenessResult {
  const filledByField: CompletenessResult["filledByField"] = {
    fullName: isNonEmptyString(values.fullName),
    email: isNonEmptyString(values.email),
    phoneNumber: isNonEmptyString(values.phoneNumber),
    area: isNonEmptyString(values.area),
    address: isNonEmptyString(values.address),
    shortBio: isNonEmptyString(values.shortBio),

    targetRole: isNonEmptyString(values.targetRole),
    yearsOfExperience: isValidYears(values.yearsOfExperience),
    currentCompany: isNonEmptyString(values.currentCompany),
    lastPosition: isNonEmptyString(values.lastPosition),

    skills: Array.isArray(values.skills) && values.skills.length >= 1,

    highestEducation: isNonEmptyString(values.highestEducation),
    preferredWorkType:
      values.preferredWorkType === "onsite" ||
      values.preferredWorkType === "remote" ||
      values.preferredWorkType === "hybrid",

    expectedSalary: isValidSalary(values.expectedSalary),
    noticePeriod: isNonEmptyString(values.noticePeriod),
  } as const;

  const total = Object.keys(filledByField).length;
  const filled = Object.values(filledByField).filter(Boolean).length;
  const percent = Math.round((filled / total) * 100);

  return { total, filled, percent, filledByField };
}

