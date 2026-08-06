import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Pencil,
  Save,
  Mail,
  Phone,
  MapPin,
  Link2,
  FileText,
  UploadCloud,
  X,
  Plus,
  GraduationCap,
  Briefcase,
  Download,
} from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { candidateProfile } from '../data/mockData'

export default function CandidateProfile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(candidateProfile)
  const [skillInput, setSkillInput] = useState('')
  const [resumeName, setResumeName] = useState(candidateProfile.resumeFileName)

  const update = (field, value) => setProfile((p) => ({ ...p, [field]: value }))

  const addSkill = (e) => {
    e.preventDefault()
    const val = skillInput.trim()
    if (val && !profile.skills.includes(val)) {
      update('skills', [...profile.skills, val])
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => update('skills', profile.skills.filter((s) => s !== skill))

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setResumeName(file.name)
  }

  return (
    <DashboardLayout
      role="candidate"
      title="My Profile"
      subtitle="Keep your profile fresh — recruiters are 3x more likely to reach out to complete profiles."
    >
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setEditing((e) => !e)}
          className={editing ? 'btn-primary px-5 py-2.5 text-sm' : 'btn-outline px-5 py-2.5 text-sm'}
        >
          {editing ? (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" /> Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Header card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-navy-700 font-display text-2xl font-bold text-white">
                {profile.avatarInitials}
                {editing && (
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-card hover:bg-teal-600">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {editing ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={profile.name}
                      onChange={(e) => update('name', e.target.value)}
                      className="input-field py-2 text-sm font-bold"
                    />
                    <input
                      value={profile.title}
                      onChange={(e) => update('title', e.target.value)}
                      className="input-field py-2 text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-xl font-bold text-navy-800">{profile.name}</h2>
                    <p className="text-navy-500">{profile.title}</p>
                  </>
                )}
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-navy-400">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-7">
            <h3 className="font-display font-bold text-navy-800">About</h3>
            {editing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => update('bio', e.target.value)}
                rows={4}
                className="input-field mt-3 resize-none text-sm"
              />
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{profile.bio}</p>
            )}
          </motion.div>

          {/* Experience */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-7">
            <h3 className="flex items-center gap-2 font-display font-bold text-navy-800">
              <Briefcase className="h-4.5 w-4.5 text-teal-500" /> Experience
            </h3>
            <div className="mt-5 space-y-6 border-l-2 border-navy-100 pl-5">
              {profile.experience.map((exp) => (
                <div key={exp.role + exp.company} className="relative">
                  <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white bg-teal-500" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-navy-800">{exp.role}</p>
                    <span className="text-xs font-semibold text-navy-400">{exp.period}</span>
                  </div>
                  <p className="text-sm font-medium text-teal-600">{exp.company}</p>
                  <p className="mt-1.5 text-sm text-navy-500">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-7">
            <h3 className="flex items-center gap-2 font-display font-bold text-navy-800">
              <GraduationCap className="h-4.5 w-4.5 text-teal-500" /> Education
            </h3>
            <div className="mt-5 space-y-4">
              {profile.education.map((ed) => (
                <div key={ed.school} className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-navy-800">{ed.school}</p>
                    <p className="text-sm text-navy-500">{ed.degree}</p>
                  </div>
                  <span className="text-xs font-semibold text-navy-400">{ed.period}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {/* Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <h3 className="font-display font-bold text-navy-800">Contact Info</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-navy-400" />
                {editing ? (
                  <input value={profile.email} onChange={(e) => update('email', e.target.value)} className="input-field py-1.5 text-sm" />
                ) : (
                  <span className="truncate text-navy-600">{profile.email}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-navy-400" />
                {editing ? (
                  <input value={profile.phone} onChange={(e) => update('phone', e.target.value)} className="input-field py-1.5 text-sm" />
                ) : (
                  <span className="text-navy-600">{profile.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 shrink-0 text-navy-400" />
                <a href="#" className="truncate text-teal-600 hover:underline">{profile.links.portfolio}</a>
              </div>
              <div className="flex items-center gap-3">
                <Link2 className="h-4 w-4 shrink-0 text-navy-400" />
                <a href="#" className="truncate text-teal-600 hover:underline">{profile.links.linkedin}</a>
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
            <h3 className="font-display font-bold text-navy-800">Skills</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="badge gap-1.5 bg-teal-50 text-teal-700"
                >
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {editing && (
              <form onSubmit={addSkill} className="mt-4 flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  className="input-field py-2 text-sm"
                />
                <button type="submit" className="btn-outline px-3 py-2">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            )}
          </motion.div>

          {/* Resume */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="font-display font-bold text-navy-800">Resume</h3>
            <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-navy-100 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-500">
                <FileText className="h-5 w-5" />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-navy-700">{resumeName}</p>
              <button className="shrink-0 text-navy-400 hover:text-teal-600">
                <Download className="h-4.5 w-4.5" />
              </button>
            </div>

            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 px-4 py-8 text-center transition-colors hover:border-teal-400 hover:bg-teal-50/40">
              <UploadCloud className="h-7 w-7 text-navy-300" />
              <p className="text-sm font-semibold text-navy-600">Click to upload a new resume</p>
              <p className="text-xs text-navy-400">PDF, DOCX up to 5MB</p>
              <input type="file" onChange={onFileChange} className="hidden" accept=".pdf,.doc,.docx" />
            </label>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
