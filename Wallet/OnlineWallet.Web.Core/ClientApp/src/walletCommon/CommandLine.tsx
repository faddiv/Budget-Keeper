import { PropsBase } from "../react-ext";
import styles from "./CommandLine.module.scss";

export function CommandLine({ children }: PropsBase) {
  return <div className={styles.cmdBtnLine}>{children}</div>;
}
