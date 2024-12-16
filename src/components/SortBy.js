import React from "react"
import SelectBox from "./SelectBox"

const SortBy = (props) => {
  const options = [
    {
      value: null,
      label: "Mặc định",
    },
    {
      value: "priceAsc",
      label: "Giá tăng dần",
    },
    {
      value: "priceDesc",
      label: "Giá giảm dần",
    },
    {
      value: "newest",
      label: "Mới nhất",
    },
  ]

  // Hàm xử lý sự kiện khi giá trị được chọn thay đổi
  const handleSelectChange = (selectedOption) => {
    console.log("Giá trị đã chọn:", selectedOption.value)

    // Gọi hàm onFilterChange từ prop và truyền giá trị mới
    props.onFilterChange({ sortBy: selectedOption.value })
  }

  return <SelectBox options={options} onChange={handleSelectChange} />
}

export default SortBy
