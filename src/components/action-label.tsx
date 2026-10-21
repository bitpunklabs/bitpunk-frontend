import type { ReactNode } from "react";
import styles from "./action-label.module.css";

export { default as actionStyles } from "./action-label.module.css";

const paths = {
  arrow: "M6 18 18 6M6 6h12v12",
  expand: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
  close: "M6 6l12 12M18 6 6 18",
};

export function ActionLabel({ children, icon = "arrow" }: {
  children: ReactNode;
  icon?: keyof typeof paths;
}) {
  return (
    <span className={styles.label}>
      <span>{children}</span>
      <svg className={styles.icon} data-icon={icon} width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" focusable="false">
        <path d={paths[icon]} />
      </svg>
    </span>
  );
}
