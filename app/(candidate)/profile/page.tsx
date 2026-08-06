"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { APIResponse } from "@/lib/api";
import { ExperienceLevel, AssessmentStatus } from "@/lib/generated/prisma/enums";

interface CandidateMe {
  candidate: {
    id: string;
    title: string | null;
    bio: string | null;
    location: string | null;
    experience: ExperienceLevel | null;
    resumeUrl: string | null;
    trunksScore: number | null;
    subscriptionPlan: string;
    user: { firstName: string; lastName: string; email: string };
  };
  stats: { totalApplications: number; shortlistedCount: number };
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
}

interface Assessment {
  id: string;
  status: AssessmentStatus;
  score: number | null;
  skill: Skill;
}

const EXPERIENCE_OPTIONS = [
  { value: "", label: "Select experience level" },
  { value: ExperienceLevel.ENTRY, label: "Entry" },
  { value: ExperienceLevel.JUNIOR, label: "Junior" },
  { value: ExperienceLevel.MID, label: "Mid" },
  { value: ExperienceLevel.SENIOR, label: "Senior" },
  { value: ExperienceLevel.LEAD, label: "Lead" },
  { value: ExperienceLevel.EXECUTIVE, label: "Executive" },
] as const;

const ASSESSMENT_STATUS_CLASSES: Record<AssessmentStatus, string> = {
  [AssessmentStatus.PENDING]: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-100",
  [AssessmentStatus.IN_PROGRESS]: "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  [AssessmentStatus.COMPLETED]: "bg-gold-100 text-gold-700 dark:bg-gold-500/10 dark:text-gold-400",
  [AssessmentStatus.EXPIRED]: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function ProfilePage() {
  const router = useRouter();

  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [trunksScore, setTrunksScore] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string } | null>(null);

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const meResponse = await fetch("/api/candidates/me");
        const meResult = (await meResponse.json()) as APIResponse<CandidateMe>;

        if (cancelled) return;

        if (!meResult.success) {
          if (meResponse.status === 401) {
            router.push("/login");
            return;
          }
          setLoadError(meResult.error);
          return;
        }

        const { candidate } = meResult.data;
        setCandidateId(candidate.id);
        setTitle(candidate.title ?? "");
        setBio(candidate.bio ?? "");
        setLocation(candidate.location ?? "");
        setExperience(candidate.experience ?? "");
        setResumeUrl(candidate.resumeUrl ?? "");
        setTrunksScore(candidate.trunksScore);
        setUserInfo(candidate.user);

        const [skillsResponse, assessmentsResponse] = await Promise.all([
          fetch("/api/skills"),
          fetch(`/api/candidates/${candidate.id}/skills`),
        ]);
        const skillsResult = (await skillsResponse.json()) as APIResponse<Skill[]>;
        const assessmentsResult = (await assessmentsResponse.json()) as APIResponse<Assessment[]>;

        if (!cancelled) {
          if (skillsResult.success) setAllSkills(skillsResult.data);
          if (assessmentsResult.success) setAssessments(assessmentsResult.data);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Failed to load your profile. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!candidateId) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload: Record<string, unknown> = {};
    if (title.trim()) payload.title = title.trim();
    if (bio.trim()) payload.bio = bio.trim();
    if (location.trim()) payload.location = location.trim();
    if (experience) payload.experience = experience;
    if (resumeUrl.trim()) payload.resumeUrl = resumeUrl.trim();

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as APIResponse<unknown>;

      if (!result.success) {
        setSaveError(result.error);
        return;
      }

      setSaveSuccess(true);
    } catch {
      setSaveError("Failed to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddSkill() {
    if (!candidateId || !selectedSkillId) return;

    setIsAddingSkill(true);

    try {
      const response = await fetch(`/api/candidates/${candidateId}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillIds: [selectedSkillId] }),
      });
      const result = (await response.json()) as APIResponse<Assessment[]>;

      if (result.success) {
        setAssessments(result.data);
        setSelectedSkillId("");
      }
    } finally {
      setIsAddingSkill(false);
    }
  }

  const inputClasses =
    "rounded-lg border border-navy-100 px-3 py-2 text-sm text-navy-950 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-navy-700 dark:bg-navy-950 dark:text-white";
  const labelClasses = "text-sm font-medium text-navy-700 dark:text-navy-100";

  const addedSkillIds = new Set(assessments.map((assessment) => assessment.skill.id));
  const availableSkills = allSkills.filter((skill) => !addedSkillIds.has(skill.id));

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-navy-500 dark:text-navy-100">Loading your profile…</p>
      </div>
    );
  }

  if (loadError || !candidateId) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {loadError ?? "Something went wrong."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="animate-fade-in-up flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-navy-950 dark:text-white">Your Profile</h1>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-100">
              {userInfo?.firstName} {userInfo?.lastName} · {userInfo?.email}
            </p>
          </div>
          {trunksScore !== null && (
            <div className="flex items-center gap-3 rounded-2xl border border-gold-500/30 bg-gold-50 px-4 py-3 dark:bg-gold-500/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-navy-950">
                {Math.round(trunksScore)}
              </div>
              <p className="text-xs font-medium text-navy-700 dark:text-navy-100">TRUNKS Score</p>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900"
        >
          <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Profile details</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="title" className={labelClasses}>
              Headline
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="bio" className={labelClasses}>
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Tell recruiters about your experience…"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="location" className={labelClasses}>
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="e.g. Remote, San Francisco"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={inputClasses}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="experience" className={labelClasses}>
                Experience level
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className={inputClasses}
              >
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="resumeUrl" className={labelClasses}>
              Resume URL
            </label>
            <input
              id="resumeUrl"
              type="url"
              placeholder="https://…"
              value={resumeUrl}
              onChange={(event) => setResumeUrl(event.target.value)}
              className={inputClasses}
            />
          </div>

          {saveError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {saveError}
            </p>
          )}
          {saveSuccess && (
            <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
              Profile saved.
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-2 flex h-11 w-fit items-center justify-center rounded-full bg-teal-500 px-8 text-sm font-medium text-white shadow-sm shadow-teal-500/30 transition-all hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSaving ? "Saving…" : "Save Profile"}
          </button>
        </form>

        <div className="flex flex-col gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900">
          <h2 className="text-lg font-semibold text-navy-950 dark:text-white">Skills</h2>

          {assessments.length === 0 ? (
            <p className="text-sm text-navy-500 dark:text-navy-100">No skills added yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {assessments.map((assessment) => (
                <span
                  key={assessment.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${ASSESSMENT_STATUS_CLASSES[assessment.status]}`}
                >
                  {assessment.skill.name}
                  {assessment.score !== null && <span className="opacity-70">· {Math.round(assessment.score)}</span>}
                </span>
              ))}
            </div>
          )}

          {availableSkills.length > 0 && (
            <div className="flex items-end gap-2 border-t border-navy-100 pt-4 dark:border-navy-800">
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="addSkill" className={labelClasses}>
                  Add a skill
                </label>
                <select
                  id="addSkill"
                  value={selectedSkillId}
                  onChange={(event) => setSelectedSkillId(event.target.value)}
                  className={inputClasses}
                >
                  <option value="">Select a skill</option>
                  {availableSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={!selectedSkillId || isAddingSkill}
                className="flex h-10 items-center justify-center rounded-full border border-teal-500 px-5 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-teal-400 dark:hover:bg-teal-500/10"
              >
                {isAddingSkill ? "Adding…" : "Add"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
