import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { QuizQuestion } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateText = (text: string, maxLength: number = 60) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const getQuestionPreview = (question: QuizQuestion | null): string => {
  if (!question) return "";
  const text = question.text || "Empty question";
  return text.length > 50 ? text.substring(0, 50) + "..." : text;
};

/**
 * Generates an array of page numbers to display in pagination controls.
 * Uses ellipsis for gaps to keep the pagination compact.
 *
 * @param currentPage - The current active page (1-indexed)
 * @param totalPages - Total number of pages
 * @returns Array of page numbers and "ellipsis" strings
 *
 * @example
 * getPaginationPages(1, 10) // [1, 2, 3, "ellipsis", 10]
 * getPaginationPages(5, 10) // [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 * getPaginationPages(10, 10) // [1, "ellipsis", 8, 9, 10]
 */
export function getPaginationPages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  // No pagination needed for 0 or 1 pages
  if (totalPages <= 1) {
    return totalPages === 1 ? [1] : [];
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  // Show ellipsis if there's a gap between first page and previous page
  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  // Show previous page (if not too close to start)
  if (currentPage > 2) {
    pages.push(currentPage - 1);
  }

  // Show current page (if it's not first or last)
  if (currentPage !== 1 && currentPage !== totalPages) {
    pages.push(currentPage);
  }

  // Show next page (if not too close to end)
  if (currentPage < totalPages - 1) {
    pages.push(currentPage + 1);
  }

  // Show ellipsis if there's a gap between next page and last page
  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  // Always show last page (if there's more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Calculates the range of items being displayed on the current page.
 *
 * @param currentPage - The current page (1-indexed)
 * @param itemsPerPage - Number of items per page
 * @param totalItems - Total number of items
 * @returns Object with startItem and endItem (1-indexed)
 *
 * @example
 * getPaginationRange(1, 10, 25) // { startItem: 1, endItem: 10 }
 * getPaginationRange(3, 10, 25) // { startItem: 21, endItem: 25 }
 */
export function getPaginationRange(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
): { startItem: number; endItem: number } {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return { startItem, endItem };
}

/**
 * Clamps a page number to a valid range.
 *
 * @param page - The page number to clamp
 * @param totalPages - Total number of pages
 * @returns Valid page number within [1, totalPages]
 *
 * @example
 * clampPage(5, 3) // 3 (clamped to max)
 * clampPage(-1, 10) // 1 (clamped to min)
 * clampPage(5, 10) // 5 (within range)
 */
export function clampPage(page: number, totalPages: number): number {
  if (totalPages === 0) return 1;
  return Math.min(Math.max(1, page), totalPages);
}
