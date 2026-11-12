export const PAGE_SIZE = 6;

export function getPagination(total: number): number[] {
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

export function renderPagination(total: number, currentPage: number): void {
  const pages = getPagination(total);
  const pagination = document.querySelector(".pagination");

  if (!pagination) return;

  pagination.innerHTML = "";
  pagination.classList.toggle(
    "hidden",
    pages.length <= 1 || currentPage > pages.length,
  );

  pages.forEach((page) => {
    const button = document.createElement("button");

    button.textContent = String(page);
    button.dataset.page = String(page);
    button.classList.toggle("active", page === currentPage);

    pagination.append(button);
  });
}
