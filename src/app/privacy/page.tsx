import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <section className="article">
      <p className="eyebrow"><time dateTime="2026-10-17">Updated 17 October 2026</time></p>
      <h1>Privacy</h1>
      <p className="lead">
        Basic connection data is used to deliver this website and its market quotes.
      </p>
      <div className="article-body">
        <h2>Running the website</h2>
        <p>
          Our hosting and security providers process connection data, such as
          your IP address, browser information, requested page and request time,
          to deliver the site, diagnose problems and prevent abuse. Bitpunk
          does not add advertising trackers or run its own audience analytics.
        </p>
        <h2>TradingView market data</h2>
        <p>
          The market ticker connects your browser directly to TradingView.
          TradingView receives your IP address, the embedding page&apos;s URL,
          widget type and displayed symbols to provide and secure the widget.
          TradingView states that its widgets do not set cookies. See its{" "}
          <a href="https://www.tradingview.com/widget-docs/faq/general/" target="_blank" rel="noopener noreferrer">widget FAQ</a>{" "}
          and{" "}
          <a href="https://www.tradingview.com/privacy-policy/" target="_blank" rel="noopener noreferrer">privacy policy</a>.
        </p>
        <h2>External links</h2>
        <p>
          Opening an external link takes you to another service. Information
          you share there is handled under that service&apos;s privacy policy.
        </p>
        <h2>Retention and location</h2>
        <p>
          Hosting logs are retained under the provider&apos;s configured limits
          for site operation and security. TradingView describes widget IP
          retention as short-term for security. Providers may process data in
          countries other than your own.
        </p>
        <h2>Your rights</h2>
        <p>
          Depending on applicable law, you may request access, correction,
          deletion or restrictions on the use of your personal data, object to
          processing, and complain to your local data protection authority.
        </p>
      </div>
    </section>
  );
}
