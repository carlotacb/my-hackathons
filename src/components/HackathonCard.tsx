import type { Hackathon } from '../data/types';
import { CATEGORY_COLORS } from '../data/types';

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  return (
    <article className="card" style={{ '--card-color': CATEGORY_COLORS[hackathon.category] } as React.CSSProperties}>
      <div className="card-head">
        <h3>{hackathon.name}</h3>
        <div className="card-links">
          {hackathon.websiteUrl && (
            <a href={hackathon.websiteUrl} target="_blank" rel="noreferrer" aria-label="Hackathon website" title="Hackathon website">
              🌐
            </a>
          )}
          {hackathon.devpostUrl && (
            <a href={hackathon.devpostUrl} target="_blank" rel="noreferrer" aria-label="Hackathon projects" title="Hackathon projects">
              🔗
            </a>
          )}
        </div>
      </div>
      <p className="card-meta">
        {hackathon.date} · {hackathon.duration} · {hackathon.place}
      </p>
      <p className="card-description">{hackathon.description}</p>
      {hackathon.projectName && (
        <p className="card-project">
          Project:{' '}
          {hackathon.projectUrl ? (
            <a href={hackathon.projectUrl} target="_blank" rel="noreferrer">
              {hackathon.projectName}
            </a>
          ) : (
            hackathon.projectName
          )}
        </p>
      )}
    </article>
  );
}
