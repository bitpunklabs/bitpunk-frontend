import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <section className="article">
      <p className="eyebrow">Privacy / This website</p>
      <h1>
        JUST HERE
        <br />
        TO EXPLORE.
      </h1>
      <p className="lead">
        This version of Bitpunk is a public research showcase. It has no account
        registration, checkout or newsletter form.
      </p>
      <div className="article-body">
        <h2>Browsing the site</h2>
        <p>
          The site does not add advertising trackers or analytics scripts. Fonts
          and artwork are served with the website. Hosting infrastructure may
          process ordinary request information needed to deliver and secure the
          pages.
        </p>
        <h2>External destinations</h2>
        <p>
          Links to external publications and GitHub take you to independent
          services. Their privacy practices apply when you visit them. This site
          does not receive information you submit on those services.
        </p>
        <h2>Previous account features</h2>
        <p>
          Account features are not available in this version. Closing those
          website routes does not delete data previously stored by an earlier
          version of the service.
        </p>
      </div>
    </section>
  );
}
