/** IDs must match `<section id>` in ProfileForm (order = scroll order). */
export const PROFILE_FORM_SECTIONS = [
  { id: "profile-section-personal", label: "Personal info" },
  { id: "profile-section-experience", label: "Experience" },
  { id: "profile-section-skills", label: "Skills" },
  { id: "profile-section-education", label: "Education" },
  { id: "profile-section-preferences", label: "Preferences" },
] as const;

export type ProfileFormSectionId = (typeof PROFILE_FORM_SECTIONS)[number]["id"];
