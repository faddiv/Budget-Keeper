import * as React from "react";
import { className } from "react-ext";

interface PagerProps {
  pageSize: number;
  page: number;
  countAll: number;
  onPageSelected: (page: number) => void;
}

export const Pager: React.SFC<PagerProps> = ({ pageSize, page, countAll, onPageSelected, ...rest }) => {
  if (pageSize === 0 || !countAll) {
    return null;
  }
  const pageCount = Math.ceil(countAll / pageSize);
  const pages: number[] = [];
  const pagesFrom = Math.max(page - 5, 1);
  const pagesTo = Math.min(pagesFrom + 10, pageCount + 1);
  for (let index = pagesFrom; index < pagesTo; index++) {
    pages.push(index);
  }
  const pageCallback = (pageNumber: number) => {
    if (pageNumber > pageCount) {
      pageNumber = pageCount;
    }
    onPageSelected(pageNumber);
  };
  const previous = Math.max(page - 1, 1);
  const next = Math.min(page + 1, pageCount);
  return (
    <nav>
      <ul className="pagination justify-content-center">
        {item(1, "First", pageCallback, page !== 1, false)}
        {item(previous, "Previous", pageCallback, page !== 1, false)}
        {
          pages.map(currentPage => item(currentPage, currentPage.toString(), pageCallback, page !== currentPage, page === currentPage))
        }
        {item(next, "Next", pageCallback, page !== pageCount, false)}
        {item(pageCount, "Last", pageCallback, page !== pageCount, false)}
      </ul>
    </nav>
  );
};

function item(page: number, text: string, callback: (number) => void, enabled: boolean, current: boolean) {
  return (
    <li key={text} className={className("page-item", current, "active", !current && !enabled, "disabled")}>
      {link(page, text, callback, enabled)}
    </li>
  );
}

function link(page: number, text: string, callback: (number) => void, enabled: boolean) {
  if (enabled) {
    return <a className="page-link" onClick={evt => { evt.preventDefault(); callback(page); }}>{text}</a>;
  } else {
    return <span className="page-link">{text}</span>;
  }
}

export function dataFrom(page: number, pageSize: number, countAll: number): number {
  if (!countAll) { return 0; }
  return Math.min((page - 1) * pageSize, countAll);
}

export function dataTo(page: number, pageSize: number, countAll: number): number {
  if (!countAll) { return 0; }
  return Math.min(page * pageSize, countAll);
}
