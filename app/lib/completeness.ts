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

export function computeCompleteness(values: Partial<ProfileFormInput>): CompletenessResult {
  const filledByField: CompletenessResult["filledByField"] = {
    fullName: isNonEmptyString(values.fullName),
    email: isNonEmptyString(values.email),
    targetRole: isNonEmptyString(values.targetRole),
    yearsOfExperience: isValidYears(values.yearsOfExperience),
    skills: Array.isArray(values.skills) && values.skills.length >= 1,
    shortBio: isNonEmptyString(values.shortBio),
    area: isNonEmptyString(values.area),
    address: isNonEmptyString(values.address),
    preferredWorkType:
      values.preferredWorkType === "onsite" ||
      values.preferredWorkType === "remote" ||
      values.preferredWorkType === "hybrid",
  } as const;

  const total = Object.keys(filledByField).length;
  const filled = Object.values(filledByField).filter(Boolean).length;
  const percent = Math.round((filled / total) * 100);

  return { total, filled, percent, filledByField };
}

