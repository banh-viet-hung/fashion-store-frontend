import React, { useState } from "react"
import Filters from "./Filters"
import Icon from "./Icon"
import SortBy from "./SortBy"
import { Row, Button, Collapse } from "react-bootstrap"

const CategoryTopBar = ({ filter, slug, child, onFilterChange }) => {
  const [collapse, setCollapse] = useState(false)
  const [filtersKey, setFiltersKey] = useState(Date.now()) // State quản lý key của Filters
  const [sortByKey, setSortByKey] = useState(Date.now()) // State quản lý key của SortBy

  // Hàm đặt lại bộ lọc về mặc định
  const resetFilters = () => {
    // Tạo bộ lọc mặc định
    let defaultFilters = {}

    if (slug) {
      if (child) {
        defaultFilters = {
          sizeNames: [],
          colorNames: [],
          minPrice: 0,
          maxPrice: 5000000,
          sortBy: null,
          categorySlugs: [slug, child], // Duy trì slug hiện tại
        }
      } else {
        defaultFilters = {
          sizeNames: [],
          colorNames: [],
          minPrice: 0,
          maxPrice: 5000000,
          sortBy: null,
          categorySlugs: [slug], // Duy trì slug hiện tại
        }
      }
    } else {
      defaultFilters = {
        sizeNames: [],
        colorNames: [],
        minPrice: 0,
        maxPrice: 5000000,
        sortBy: null,
        categorySlugs: [], // Không truyền slug ở đây, vì có thể có nhiều danh mục con
      }
    }

    // Gọi onFilterChange để cập nhật lại bộ lọc ở parent component
    onFilterChange(defaultFilters)

    // Thay đổi key để trigger lại mount component Filters và SortBy
    setFiltersKey(Date.now()) // Sử dụng thời gian hiện tại để tạo key mới cho Filters
    setSortByKey(Date.now()) // Tạo key mới cho SortBy
  }

  return (
    <header className="product-grid-header">
      {filter && (
        <div className="me-3 mb-3">
          <Button
            variant="link"
            className="text-dark ps-0 dropdown-toggle text-decoration-none"
            data-toggle="collapse"
            aria-expanded={collapse}
            onClick={() => setCollapse(!collapse)}
          >
            Bộ lọc
          </Button>
        </div>
      )}

      <div className="mb-3 d-flex align-items-center">
        <span className="d-inline-block me-2">Sắp xếp theo</span>
        {/* Đặt key để khi reset bộ lọc sẽ mount lại SortBy */}
        <SortBy key={sortByKey} onFilterChange={onFilterChange} />
      </div>

      {filter && (
        <Collapse in={collapse} className="w-100">
          <div className="py-4 mb-5">
            <Row>
              {/* Đặt key để khi reset bộ lọc sẽ mount lại Filters */}
              <Filters
                key={filtersKey} // Thay đổi key mỗi khi nhấn "Đặt lại mặc định"
                top
                slug={slug}
                child={child}
                onFilterChange={onFilterChange}
              />
            </Row>

            {/* Nút đặt lại mặc định */}
            <Button
              variant="link"
              className="d-flex align-items-center ps-0 ms-n3"
              onClick={resetFilters} // Gọi hàm resetFilters khi bấm
            >
              <Icon icon="close-1" className="w-3rem h-3rem me-n1" />
              Đặt lại mặc định
            </Button>
          </div>
        </Collapse>
      )}
    </header>
  )
}

export default CategoryTopBar
