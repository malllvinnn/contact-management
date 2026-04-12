/** Nomor halaman + ellipsis untuk total besar (maks ~7 segmen). */
export function buildPaginationItems(
    current: number,
    total: number
): (number | "ellipsis")[] {
    if (total <= 0) return [];
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (current > 4) pages.push("ellipsis");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let p = start; p <= end; p++) {
        pages.push(p);
    }
    if (current < total - 3) pages.push("ellipsis");
    if (total > 1) pages.push(total);
    return pages;
}
