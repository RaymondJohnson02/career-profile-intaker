import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/app/lib/supabase";
import { profileSchema, type ProfileFormValues } from "@/app/lib/profileSchema";

function toRow(values: ProfileFormValues) {
  return {
    full_name: values.fullName,
    email: values.email,
    phone_number: values.phoneNumber,
    target_role: values.targetRole,
    years_of_experience: values.yearsOfExperience,
    current_company: values.currentCompany,
    last_position: values.lastPosition,
    skills: values.skills,
    short_bio: values.shortBio?.trim() ? values.shortBio.trim() : null,
    area: values.area,
    address: values.address?.trim() ? values.address.trim() : null,
    highest_education: values.highestEducation,
    preferred_work_type: values.preferredWorkType,
    expected_salary: values.expectedSalary,
    notice_period: values.noticePeriod,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert(toRow(parsed.data))
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "This email is already registered. Use a different email or contact HR if you need to update your profile.",
            code: "EMAIL_DUPLICATE",
          },
          { status: 409 }
        );
      }
      console.error("[profile POST]", error);
      return NextResponse.json(
        { error: "Could not save your profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    console.error("[profile POST]", e);
    return NextResponse.json(
      { error: "Server configuration error. Check Supabase environment variables." },
      { status: 500 }
    );
  }
}
