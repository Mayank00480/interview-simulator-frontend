import React from 'react';

/**
 * Horizontal stepper.
 * steps: [{ key, title, description }]
 * activeKey: key of the step being shown
 * isComplete(key) / isLocked(key): step state helpers
 * onStepClick(key): called when an unlocked step is clicked
 */
export default function Stepper({ steps, activeKey, isComplete = () => false, isLocked = () => false, onStepClick }) {
  return (
    <ol className="stp" role="tablist" aria-label="Progress">
      {steps.map((step, i) => {
        const active = step.key === activeKey;
        const done = isComplete(step.key);
        const locked = isLocked(step.key);
        const state = active ? 'is-active' : done ? 'is-done' : locked ? 'is-locked' : '';
        const nextDone = i < steps.length - 1 && done;

        return (
          <li key={step.key} className={`stp-item ${state}`}>
            <button
              type="button"
              role="tab"
              aria-selected={active}
              aria-current={active ? 'step' : undefined}
              className="stp-btn"
              disabled={locked}
              onClick={() => !locked && onStepClick?.(step.key)}
              title={locked ? 'Complete the previous step first' : step.title}
            >
              <span className="stp-dot">
                {done && !active ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className="stp-text">
                <span className="stp-title">{step.title}</span>
                {step.description && <span className="stp-desc">{step.description}</span>}
              </span>
            </button>
            {i < steps.length - 1 && <span className={`stp-line ${nextDone ? 'is-done' : ''}`} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
