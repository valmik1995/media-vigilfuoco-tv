// src/components/common/Pagination/Pagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, hasNext, hasPrevious, disabled }) => {
  if (totalPages <= 1) return null; // Non mostriamo nulla se c'è solo una pagina

  return (
    <nav className={styles.pagination} aria-label="Navigazione pagine">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevious || disabled} className={styles.pageBtn} aria-label="Pagina precedente">
        <ChevronLeft size={20} />
      </button>

      <div className={styles.info}>
        <span>Pagina</span>
        <span className={styles.current}>{currentPage}</span>
        <span>di</span>
        <span>{totalPages}</span>
      </div>

      <button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext || disabled} className={styles.pageBtn} aria-label="Pagina successiva">
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default Pagination;
