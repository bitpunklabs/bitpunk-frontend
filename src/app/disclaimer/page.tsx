import type { Metadata } from "next";
import { riskNotice } from "@/lib/disclaimer";

export const metadata: Metadata = {
  title: "Disclaimer",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <section className="article">
      <p className="eyebrow"><time dateTime="2026-10-24">Updated 24 October 2026</time></p>
      <h1>Disclaimer</h1>
      <p className="lead">
        {riskNotice} You can lose all the money you invest, and
        leveraged positions can create losses beyond your initial deposit.
      </p>
      <div className="article-body">
        <h2>Research, not personal advice</h2>
        <p>
          Our research, indicators and open-source tools provide general
          information, not personal investment advice or an offer to buy or sell
          an investment. They do not consider your finances, objectives or risk
          tolerance. Make your own assessment and seek qualified independent
          advice when needed.
        </p>
        <h2>Manage risk before trading</h2>
        <p>
          Decide what you can afford to lose, limit position size and leverage,
          and plan how you will exit. Account for fees, slippage and liquidity.
          Stop-loss orders may not execute at the intended price, especially
          during gaps or fast markets. Risk controls cannot eliminate losses.
        </p>
        <h2>Know the limits of the tools</h2>
        <p>
          Indicators can produce false signals. Past performance does not
          guarantee future results. Backtests and simulations are hypothetical,
          depend on assumptions and may not reflect live execution, costs or
          liquidity. No tool or strategy guarantees a profit.
        </p>
        <h2>Verify prices and context</h2>
        <p>
          Content and market data may be delayed, incomplete or incorrect.
          Some displayed quotes are CFD references rather than the underlying
          cash index. Verify the instrument, current information and executable
          price with your broker before acting.
        </p>
        <h2>Our commercial interest</h2>
        <p>
          Bitpunk develops paid indicators and has a commercial interest in
          those products. Payment does not guarantee investment results.
        </p>
      </div>
    </section>
  );
}
