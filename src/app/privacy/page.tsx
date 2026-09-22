export default function PrivacyPage() {
  return (
    <section className="page-section article">
      <p className="eyebrow">Privacy</p>
      <h1>Your account data has a clear purpose.</h1>
      <p className="lead">
        Bitpunk is in pre-launch. This notice describes the limited account data
        used during testing. A complete privacy policy will be published before
        paid checkout opens.
      </p>
      <div className="article-body">
        <h2>What we receive</h2>
        <p>
          When you sign in, the provider sends an account identifier and may
          send your name, email address and profile image. If you add an email
          or connect another provider, we store the information needed to
          maintain that connection.
        </p>
        <h2>How we use it</h2>
        <p>
          We use account data to sign you in, secure your account, show
          connection status, provide support and prepare future paid
          access. We do not use it to make trading decisions or sell personal
          advertising.
        </p>
        <h2>Who operates the systems</h2>
        <p>
          Authentication and account data are hosted with Supabase. The website
          is hosted with Vercel. Each provider you choose also processes the
          sign-in under its own privacy terms.
        </p>
        <h2>Stablecoin payment data</h2>
        <p>
          Before checkout opens, the final policy will explain which payment
          provider processes an order and which order, wallet, network and
          transaction information Bitpunk keeps for access, accounting,
          security and support. Blockchain transactions are public and cannot
          be deleted by Bitpunk.
        </p>
        <h2>Before launch</h2>
        <p>
          The final policy will identify the operating entity, contact route,
          legal bases, retention periods, international transfers and the
          process for exercising applicable data rights.
        </p>
      </div>
    </section>
  );
}
