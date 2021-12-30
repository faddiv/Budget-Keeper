import { PropsBase } from "../../services/helpers";
import styles from "./CommandLine.module.scss";

export function CommandLine({ children }: PropsBase) {
  return <div className={styles.cmdBtnLine}>{children}</div>;
}
