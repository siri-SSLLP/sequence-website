import { useState } from "react";
import "./Career.css";

const jobListings = [
  {
    id: 1,
    title: "Creative Director",
    description:
      "You will be responsible in assisting marketing and sales teams on all key initiatives.",
    type: "Full Time",
    location: "Bangalore",
    details: `We're looking for a visionary Creative Director to lead our brand identity and visual storytelling. 
You will collaborate with cross-functional teams to develop campaigns, oversee design systems, and ensure our premium laminate brand is represented consistently across all touchpoints.`,
  },
  {
    id: 2,
    title: "Customer Success Associate",
    description:
      "You'll collaborate closely with clients, helping them navigate through their purchasing journey.",
    type: "Full Time",
    location: "Bangalore",
    details: `As a Customer Success Associate, you'll be the primary point of contact for our clients — from first inquiry to post-installation support. 
You'll build lasting relationships, resolve concerns, and ensure every customer experiences the Sequence Surface standard of excellence.`,
  },
  {
    id: 3,
    title: "Experience Center (EC) Manager",
    description:
      "We are looking for a dynamic leader to oversee client experience, operations, and team management.",
    type: "Full Time",
    location: "Bangalore",
    details: `You will manage day-to-day operations of our Experience Center, curate in-store journeys, lead a team of associates, and maintain the highest standards of presentation and client engagement. 
A background in interior design, retail management, or luxury goods is a plus.`,
  },
  {
    id: 4,
    title: "Finance Manager",
    description:
      "You will be responsible for Compliance, Reporting, and Strategic Budgeting for Optimal Business Operations.",
    type: "Full Time",
    location: "Bangalore",
    details: `As Finance Manager, you'll oversee financial planning, reporting, and compliance across business units. 
You'll work closely with leadership to drive budgeting strategy, manage cash flow, and ensure adherence to regulatory requirements. CA/CPA qualification preferred.`,
  },
  {
    id: 5,
    title: "HR Recruiter Intern",
    description:
      "You will be responsible for Compliance, Reporting, and Strategic Budgeting for Optimal Business Operations.",
    type: "Full Time",
    location: "Bangalore",
    details: `As Finance Manager, you'll oversee financial planning, reporting, and compliance across business units. 
You'll work closely with leadership to drive budgeting strategy, manage cash flow, and ensure adherence to regulatory requirements. CA/CPA qualification preferred.`,
  },
];

function ChevronRight({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Modal({ job, onClose }) {
  if (!job) return null;
  return (
    <div className="career-overlay" onClick={onClose}>
      <div className="career-modal" onClick={(e) => e.stopPropagation()}>
        <button className="career-close-btn" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="career-modal-tags">
          <span className="career-badge">{job.type}</span>
          <span className="career-badge">{job.location}</span>
        </div>
        <h2 className="career-modal-title">{job.title}</h2>
        <p className="career-modal-desc">{job.description}</p>
        <div className="career-divider" />
        <p className="career-modal-details">{job.details}</p>
        <button className="career-apply-btn-modal">
          Apply Now <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function JobCard({ job, onViewDetails }) {
  return (
    <div className="career-card">
      <div className="career-card-left">
        <h3 className="career-job-title">{job.title}</h3>
        <p className="career-job-desc">{job.description}</p>
        <div className="career-tag-row">
          <span className="career-tag">{job.type}</span>
          <span className="career-tag">{job.location}</span>
        </div>
      </div>
      <div className="career-card-actions">
        <button className="career-view-btn" onClick={() => onViewDetails(job)}>
          View Details
        </button>
        <button className="career-apply-btn">
          Apply <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

export default function Career() {
  const [activeJob, setActiveJob] = useState(null);

  return (
    <div className="career-page">
      <div className="career-container">
        <div className="career-header">
          <div className="career-header-left">
            <p className="career-eyebrow">We're hiring</p>
            <h1 className="career-heading">Join our Team</h1>
            <p className="career-subtext">
              {jobListings.length} Open Position{jobListings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="career-header-tagline">
            Be part of a team that's redefining premium surfaces in India.
          </p>
        </div>

        <div className="career-list">
          {jobListings.map((job) => (
            <JobCard key={job.id} job={job} onViewDetails={setActiveJob} />
          ))}
        </div>
      </div>

      <Modal job={activeJob} onClose={() => setActiveJob(null)} />
    </div>
  );
}