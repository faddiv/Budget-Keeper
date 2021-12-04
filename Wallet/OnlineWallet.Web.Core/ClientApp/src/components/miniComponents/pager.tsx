import { FunctionComponent } from "react";
import { Pagination } from "react-bootstrap";

interface PagerProps {
  pageSize: number;
  page: number;
  countAll: number;
  onPageSelected: (page: number) => void;
}

export const Pager: FunctionComponent<PagerProps> = ({ pageSize, page, countAll, onPageSelected }) => {
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
      <Pagination className="justify-content-center">
        {item(1, "First", pageCallback, page !== 1, false)}
        {item(previous, "Previous", pageCallback, page !== 1, false)}
        {pages.map((currentPage) => item(currentPage, currentPage.toString(), pageCallback, page !== currentPage, page === currentPage))}
        {item(next, "Next", pageCallback, page !== pageCount, false)}
        {item(pageCount, "Last", pageCallback, page !== pageCount, false)}
      </Pagination>
    </nav>
  );
};

function item(page: number, text: string, callback: (number: number) => void, enabled: boolean, current: boolean) {
  return (
    <Pagination.Item
      key={text}
      active={current}
      disabled={!current && !enabled}
      onClick={(evt) => {
        evt.preventDefault();
        if (enabled) {
          callback(page);
        }
      }}
    >
      {text}
    </Pagination.Item>
  );
}

export function dataFrom(page: number, pageSize: number, countAll: number): number {
  if (!countAll) {
    return 0;
  }
  return Math.min((page - 1) * pageSize, countAll);
}

export function dataTo(page: number, pageSize: number, countAll: number): number {
  if (!countAll) {
    return 0;
  }
  return Math.min(page * pageSize, countAll);
}
