import React, { useState } from 'react';
import { ApplicationUpdatePayload, InternshipApplication } from '../../services/internshipService';
import { useInternshipStore } from '../../store/internshipStore';

interface Props { application: InternshipApplication; onClose: () => void; }

const ApplicationForm: React.FC<Props> = ({ application, onClose }) => {
  const { updateApplication, submitApplication } = useInternshipStore();
  const [form, setForm] = useState({
    personal: application.personal ? JSON.parse(application.personal) : { fullName: '', email: '' },
    education: application.education ? JSON.parse(application.education) : { level: '', institution: '' },
    skills: application.skills || '',
    availability: application.availability || '',
    resume_url: application.resume || '',
    motivation: application.motivation || ''
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const saveDraft = async () => {
    setSaving(true);
    const payload: ApplicationUpdatePayload = {
      personal: form.personal,
      education: form.education,
      skills: form.skills,
      availability: form.availability,
      resume_url: form.resume_url,
      motivation: form.motivation
    };
    await updateApplication(application.id, payload);
    setSaving(false);
  };

  const submit = async () => {
    if (!window.confirm('Submit application? You cannot edit after submitting.')) return;
    setSubmitting(true);
    // Auto-save latest edits before submission to avoid null fields
    const payload: ApplicationUpdatePayload = {
      personal: form.personal,
      education: form.education,
      skills: form.skills,
      availability: form.availability,
      resume_url: form.resume_url,
      motivation: form.motivation
    };
    await updateApplication(application.id, payload);
    await submitApplication(application.id);
    setSubmitting(false);
    onClose();
  };

  const disabled = application.status !== 'Draft';

  return (
    <div className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/60 p-8 overflow-y-auto max-h-[90vh] transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">Application Form</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-lg leading-none">✕</button>
        </div>
        <div className="space-y-8">
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input disabled={disabled} value={form.personal.fullName} onChange={e => handleChange('personal', { ...form.personal, fullName: e.target.value })} placeholder="Full name" className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
              <input disabled={disabled} value={form.personal.email} onChange={e => handleChange('personal', { ...form.personal, email: e.target.value })} placeholder="Email" className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input disabled={disabled} value={form.education.level} onChange={e => handleChange('education', { ...form.education, level: e.target.value })} placeholder="Level (e.g. BSc)" className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
              <input disabled={disabled} value={form.education.institution} onChange={e => handleChange('education', { ...form.education, institution: e.target.value })} placeholder="Institution" className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
            </div>
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Skills</h3>
            <input disabled={disabled} value={form.skills} onChange={e => handleChange('skills', e.target.value)} placeholder="Comma separated skills" className="border border-slate-300 dark:border-slate-600 rounded-lg w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Availability</h3>
            <input disabled={disabled} value={form.availability} onChange={e => handleChange('availability', e.target.value)} placeholder="e.g. 20 hrs/week" className="border border-slate-300 dark:border-slate-600 rounded-lg w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Resume URL</h3>
            <input disabled={disabled} value={form.resume_url} onChange={e => handleChange('resume_url', e.target.value)} placeholder="https://..." className="border border-slate-300 dark:border-slate-600 rounded-lg w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
          </section>
          <section className="space-y-3">
            <h3 className="font-medium text-base text-slate-700 dark:text-slate-300">Motivation</h3>
            <textarea disabled={disabled} value={form.motivation} onChange={e => handleChange('motivation', e.target.value)} placeholder="Why are you a good fit?" className="border border-slate-300 dark:border-slate-600 rounded-lg w-full px-4 py-2.5 text-sm h-28 resize-y bg-white dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:focus:ring-blue-400/50 disabled:opacity-60 transition" />
          </section>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Status: <span className="uppercase tracking-wide text-slate-700 dark:text-slate-300">{application.status}</span></div>
          <div className="flex gap-3 flex-wrap">
            {application.status === 'Draft' && (
              <>
                <button onClick={saveDraft} disabled={saving} className="px-5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition">{saving ? 'Saving…' : 'Save draft'}</button>
                <button onClick={submit} disabled={submitting} className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 disabled:opacity-50 transition">{submitting ? 'Submitting…' : 'Submit'}</button>
              </>
            )}
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
