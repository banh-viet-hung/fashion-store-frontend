import React from "react"
import { Pagination } from "react-bootstrap"
import Icon from "./Icon"

const PaginationComponent = ({ totalPages, currentPage, onPageChange }) => {
  const maxPagesToShow = 5 // Số trang tối đa được hiển thị cùng một lúc
  const startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2))
  const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber)
  }

  const pageItems = []

  // Nút chuyển tới trang đầu tiên
  if (startPage > 0) {
    pageItems.push(
      <Pagination.Item key="first" onClick={() => handlePageClick(0)}>
        First
      </Pagination.Item>
    )
  }

  // Hiển thị các trang trong phạm vi giới hạn
  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handlePageClick(i)}
      >
        {i + 1}
      </Pagination.Item>
    )
  }

  // Nút chuyển tới trang cuối cùng
  if (endPage < totalPages - 1) {
    pageItems.push(
      <Pagination.Item
        key="last"
        onClick={() => handlePageClick(totalPages - 1)}
      >
        Last
      </Pagination.Item>
    )
  }

  return (
    <Pagination
      aria-label="Page navigation example"
      className="d-flex justify-content-center mb-5 mt-3"
    >
      <Pagination.Item
        className="page-arrow"
        onClick={() => handlePageClick(Math.max(currentPage - 1, 0))}
        disabled={currentPage === 0}
      >
        <span aria-hidden="true">
          <Icon icon="angle-left-1" className="page-icon" />
        </span>
        <span className="sr-only">Previous</span>
      </Pagination.Item>

      {pageItems}

      <Pagination.Item
        className="page-arrow"
        onClick={() =>
          handlePageClick(Math.min(currentPage + 1, totalPages - 1))
        }
        disabled={currentPage === totalPages - 1}
      >
        <span aria-hidden="true">
          <Icon icon="angle-right-1" className="page-icon" />
        </span>
        <span className="sr-only">Next</span>
      </Pagination.Item>
    </Pagination>
  )
}

export default PaginationComponent
