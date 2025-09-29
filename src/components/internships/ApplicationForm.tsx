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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Application Form</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input disabled={disabled} value={form.personal.fullName} onChange={e => handleChange('personal', { ...form.personal, fullName: e.target.value })} placeholder="Full name" className="border rounded px-3 py-2 text-sm" />
              <input disabled={disabled} value={form.personal.email} onChange={e => handleChange('personal', { ...form.personal, email: e.target.value })} placeholder="Email" className="border rounded px-3 py-2 text-sm" />
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="font-medium">Education</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input disabled={disabled} value={form.education.level} onChange={e => handleChange('education', { ...form.education, level: e.target.value })} placeholder="Level (e.g. BSc)" className="border rounded px-3 py-2 text-sm" />
              <input disabled={disabled} value={form.education.institution} onChange={e => handleChange('education', { ...form.education, institution: e.target.value })} placeholder="Institution" className="border rounded px-3 py-2 text-sm" />
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="font-medium">Skills</h3>
            <input disabled={disabled} value={form.skills} onChange={e => handleChange('skills', e.target.value)} placeholder="Comma separated skills" className="border rounded w-full px-3 py-2 text-sm" />
          </section>
          <section className="space-y-2">
            <h3 className="font-medium">Availability</h3>
            <input disabled={disabled} value={form.availability} onChange={e => handleChange('availability', e.target.value)} placeholder="e.g. 20 hrs/week" className="border rounded w-full px-3 py-2 text-sm" />
          </section>
          <section className="space-y-2">
            <h3 className="font-medium">Resume URL</h3>
            <input disabled={disabled} value={form.resume_url} onChange={e => handleChange('resume_url', e.target.value)} placeholder="https://..." className="border rounded w-full px-3 py-2 text-sm" />
          </section>
          <section className="space-y-2">
            <h3 className="font-medium">Motivation</h3>
            <textarea disabled={disabled} value={form.motivation} onChange={e => handleChange('motivation', e.target.value)} placeholder="Why are you a good fit?" className="border rounded w-full px-3 py-2 text-sm h-24" />
          </section>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-xs text-slate-500">Status: {application.status}</div>
          <div className="flex gap-2">
            {application.status === 'Draft' && (
              <>
                <button onClick={saveDraft} disabled={saving} className="px-4 py-2 text-sm border rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50">{saving ? 'Saving...' : 'Save draft'}</button>
                <button onClick={submit} disabled={submitting} className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit'}</button>
              </>
            )}
            <button onClick={onClose} className="px-4 py-2 text-sm rounded border">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
