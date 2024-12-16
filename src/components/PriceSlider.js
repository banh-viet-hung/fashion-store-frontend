import React from "react"
import Nouislider from "nouislider-react"

const PriceSlider = ({ top, onFilterChange }) => {
  const [priceMin, setPriceMin] = React.useState(0)
  const [priceMax, setPriceMax] = React.useState(10000000)

  // Hàm để định dạng số có dấu phân cách
  const formatNumber = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number)
  }

  const priceSlider = (render, handle, value, un, percent) => {
    const newPriceMin = value[0].toFixed(0)
    const newPriceMax = value[1].toFixed(0)

    // Cập nhật state với giá trị mới
    setPriceMin(newPriceMin)
    setPriceMax(newPriceMax)

    onFilterChange({ minPrice: newPriceMin, maxPrice: newPriceMax })

    // In ra console giá trị đã thay đổi
    console.log(`Giá trị từ: ${newPriceMin} VNĐ, đến: ${newPriceMax} VNĐ`)
  }

  return (
    <React.Fragment>
      <Nouislider
        key={2}
        range={{ min: 0, max: 10000000 }}
        start={[0, 5000000]}
        onUpdate={priceSlider} // Đặt hàm xử lý sự kiện
        className={top ? "" : "mt-4 mt-lg-0"}
        connect
      />
      <div className={`nouislider-values  ${top ? "mb-4" : ""}`}>
        <div className="min">
          Từ <span id="slider-snap-value-from">{formatNumber(priceMin)}</span>{" "}
          VNĐ
        </div>
        <div className="max">
          Đến <span id="slider-snap-value-to">{formatNumber(priceMax)}</span>{" "}
          VNĐ
        </div>
      </div>
    </React.Fragment>
  )
}

export default PriceSlider
