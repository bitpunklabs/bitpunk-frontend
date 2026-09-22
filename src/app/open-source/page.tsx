import type { Metadata } from "next";
import { projects } from "@/lib/open-source";

export const metadata: Metadata = {
  title: "Open Source",
  description:
    "Tools, schemas and agent utilities published openly under the Bitpunk organisation.",
};

export default function OpenSourcePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Open Source</p>
        <h1>Read the tools.</h1>
        <p className="hero-copy">
          The parts of Bitpunk that are more useful in the open than behind an
          account.
        </p>
      </section>

      <section className="block">
        {projects.length > 0 ? (
          <ul className="project-list">
            {projects.map((project) => (
              <li key={project.repo}>
                <div>
                  <h2>{project.name}</h2>
                  <p className="repo">{project.repo}</p>
                </div>
                <p>{project.description}</p>
                <div className="project-links">
                  <span className="is-muted">{project.language}</span>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                  {project.docsHref ? (
                    <a href={project.docsHref}>
                      Docs <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Nothing published yet</p>
            <p>
              Repositories are listed here once they are public. A project that
              cannot be cloned does not belong on this page.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
