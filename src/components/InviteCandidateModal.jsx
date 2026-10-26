import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function InviteCandidateModal({ interview, onClose, onInviteSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('3-5 years');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { showToast } = useToast();

  const interviewId = interview?._id || interview?.id || 'demo';
  const role = interview?.jobRole || interview?.title || 'Technical Role';
  const inviteLink = `${window.location.origin}/interviews/${interviewId}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteLink);
    setCopiedLink(true);
    showToast('Interview link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Please provide both candidate name and email address.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const candidatePayload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience,
        status: 'INVITED',
        notes: notes.trim() || `Invited for ${role}`,
        inviteUrl: inviteLink,
      };

      if (onInviteSuccess) {
        await onInviteSuccess(candidatePayload);
      }
      showToast(`Invitation sent successfully to ${name}!`, 'success');
      onClose();
    } catch (err) {
      console.error('Invite error:', err);
      showToast('Failed to send candidate invitation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="jd-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="invite-modal-card"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        <div className="candidate-modal-header">
          <div>
            <h2 className="candidate-modal-title">Invite Candidate</h2>
            <p className="invite-modal-subtitle">
              Send an AI interview assessment invitation for <strong>{role}</strong>
            </p>
          </div>
          <button
            type="button"
            className="jd-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="invite-form">
          <div className="invite-modal-body">
            {/* Quick Share Link Box */}
            <div className="share-link-box">
              <span className="share-label">Direct Assessment Link</span>
              <div className="share-input-group">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="share-link-input"
                />
                <button
                  type="button"
                  className="share-copy-btn"
                  onClick={handleCopyLink}
                >
                  {copiedLink ? '✓ Copied' : 'Copy Link'}
                </button>
              </div>
            </div>

            <div className="form-group-invite">
              <label className="invite-label">Candidate Full Name *</label>
              <input
                type="text"
                className="invite-input"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group-invite">
              <label className="invite-label">Email Address *</label>
              <input
                type="email"
                className="invite-input"
                placeholder="e.g. jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2col">
              <div className="form-group-invite">
                <label className="invite-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  className="invite-input"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group-invite">
                <label className="invite-label">Experience Level</label>
                <select
                  className="invite-select"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="0-1 years">Junior (0-1 yrs)</option>
                  <option value="1-3 years">Mid-Level (1-3 yrs)</option>
                  <option value="3-5 years">Senior (3-5 yrs)</option>
                  <option value="5-8 years">Lead (5-8 yrs)</option>
                  <option value="8+ years">Principal (8+ yrs)</option>
                </select>
              </div>
            </div>

            <div className="form-group-invite">
              <label className="invite-label">Recruiter Notes (Optional)</label>
              <textarea
                className="invite-textarea"
                rows="2"
                placeholder="Special focus areas, referral notes, or portfolio links..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="invite-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-invite-submit"
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
