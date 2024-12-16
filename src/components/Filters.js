import React, { useState, useEffect } from "react"
import { Col, Collapse, Form } from "react-bootstrap"
import { getColors } from "../api/ColorAPI" // Import hàm gọi API từ file api/colors
import { getSizes } from "../api/SizeAPI" // Import hàm gọi API cho size
import CategoryAPI from "../api/CategoryAPI" // Import API gọi danh mục con
import PriceSlider from "./PriceSlider"

// Filters component
const Filters = ({ top, slug, child, onFilterChange }) => {
  const [filterInputs, setFilterInputs] = useState({
    "clothes-category": [], // Dùng để lưu danh sách categories đã chọn
    size: [],
    colour: [],
  })

  const [sizes, setSizes] = useState([])
  const [colors, setColors] = useState([])
  const [categories, setCategories] = useState([])
  const [collapse, setCollapse] = useState({})

  // Toggle collapse for sidebar
  const toggleCollapse = (name) => {
    setCollapse({ ...collapse, [name]: !collapse[name] })
  }

  // Fetch colors from API
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const fetchedColors = await getColors()
        setColors(fetchedColors) // Save fetched colors to state
      } catch (error) {
        console.error("Error fetching colors:", error)
      }
    }

    fetchColors()
  }, [])

  // Fetch sizes from API
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const fetchedSizes = await getSizes() // Assume this function fetches sizes from API
        setSizes(fetchedSizes) // Save fetched sizes to state
      } catch (error) {
        console.error("Error fetching sizes:", error)
      }
    }

    fetchSizes()
  }, [])

  useEffect(() => {
    if (slug) {
      const fetchCategories = async () => {
        try {
          const fetchedCategories = await CategoryAPI.getChildCategoriesBySlug(
            slug
          )
          if (fetchedCategories.data && fetchedCategories.data.length > 0) {
            setCategories(fetchedCategories.data) // Lưu danh mục con nếu có dữ liệu
          } else {
            setCategories([]) // Không có danh mục con thì đặt danh mục rỗng
          }
        } catch (error) {
          console.error("Error fetching categories:", error)
          setCategories([]) // Nếu có lỗi trong quá trình fetch, cũng đặt danh mục rỗng
        }
      }

      fetchCategories()
    } else {
      setCategories([]) // Nếu slug là null, không hiển thị danh mục
    }
  }, [slug])

  // Set default selected category if child is provided
  useEffect(() => {
    if (child && categories.length > 0) {
      const defaultCategory = categories.find(
        (category) => category.slug === child
      )
      if (defaultCategory) {
        setFilterInputs((prevState) => ({
          ...prevState,
          "clothes-category": [slug, defaultCategory.slug], // Set mảng category với slug mặc định và giá trị slug đã chọn
        }))
      }
    }
  }, [child, categories])

  const onInputChange = (e) => {
    const { type, id, name } = e.target
    const value = id.replace(/^(color-|size-)/, "")

    if (type === "radio") {
      // Khi chọn radio button cho category, lưu cả slug và giá trị đã chọn
      setFilterInputs((prevState) => {
        const updatedSelection = [slug, value] // Cập nhật categorySlugs với slug mặc định và giá trị đã chọn
        onFilterChange({
          categorySlugs: updatedSelection, // Truyền vào filterParams.categorySlugs
        })
        return { ...prevState, [name]: updatedSelection }
      })
    } else if (type === "checkbox") {
      // Xử lý khi chọn checkbox cho size hoặc màu
      setFilterInputs((prevState) => {
        const currentSelection = prevState[name] || []
        let updatedSelection

        if (currentSelection.includes(value)) {
          updatedSelection = currentSelection.filter((x) => x !== value)
        } else {
          updatedSelection = [...currentSelection, value]
        }

        // Truyền giá trị mới vào filterParams với tên thuộc tính chính xác
        if (name === "clothes-category") {
          onFilterChange({
            categorySlugs: updatedSelection, // Cập nhật filterParams.categorySlugs
          })
        } else if (name === "colour") {
          onFilterChange({
            colorNames: updatedSelection, // Cập nhật filterParams.colorNames
          })
        } else if (name === "size") {
          // Lấy tên size từ ID và truyền vào filterParams.sizeNames
          const selectedSizes = sizes
            .filter((size) => updatedSelection.includes(size.id.toString()))
            .map((size) => size.name)
          onFilterChange({
            sizeNames: selectedSizes, // Cập nhật filterParams.sizeNames
          })
        }

        return { ...prevState, [name]: updatedSelection }
      })
    }
  }

  // Radio filter component for categories
  const RadioFilter = ({ data, name }) => (
    <Form className={top ? "" : "mt-4 mt-lg-0"}>
      {data.map((item) => (
        <div key={item.slug} className="mb-1">
          <Form.Check
            type="radio"
            name={name}
            id={item.slug}
            label={item.name}
            checked={filterInputs[name]?.includes(item.slug)}
            onChange={onInputChange}
          />
        </div>
      ))}
    </Form>
  )

  // Colors filter component
  const ColorsFilter = () => (
    <ul
      className={`list-inline mb-0 colours-wrapper ${
        top ? "" : "mt-4 mt-lg-0"
      }`}
    >
      {colors.map((color) => (
        <li key={color.id} className="list-inline-item">
          <Form.Label
            className={`btn-colour ${
              filterInputs["colour"]?.includes(color.name) ? "active" : ""
            }`}
            htmlFor={`color-${color.name}`}
            style={{ backgroundColor: color.code.trim() }}
          />
          <Form.Check
            className="input-invisible"
            type="checkbox"
            name="colour"
            id={`color-${color.name}`}
            checked={filterInputs["colour"]?.includes(color.name) || false}
            onChange={onInputChange}
          />
        </li>
      ))}
    </ul>
  )

  // Size filter component
  const SizeFilter = () => (
    <Form className={top ? "" : "mt-4 mt-lg-0"}>
      {sizes.map((size) => (
        <div key={size.id} className="mb-1">
          <Form.Check
            type="checkbox"
            name="size"
            id={`size-${size.id}`}
            label={size.name}
            checked={
              filterInputs["size"]?.includes(size.id.toString()) || false
            }
            onChange={onInputChange}
          />
        </div>
      ))}
    </Form>
  )

  // Filters above product
  const topFilters = [
    ...(categories.length > 0
      ? [
          {
            component: (
              <RadioFilter data={categories} name="clothes-category" />
            ),
            title: "Filter by category",
            subtitle: "Danh mục",
          },
        ]
      : []),
    {
      component: <SizeFilter />,
      title: "Filter by size",
      subtitle: "Kích cỡ",
    },
    [
      {
        component: <PriceSlider top={top} onFilterChange={onFilterChange} />,
        title: "Filter by price",
        subtitle: "Khoảng giá",
      },
      {
        component: <ColorsFilter />,
        title: "Filter by colour",
        subtitle: "Màu sắc",
      },
    ],
  ]

  const filtersBlocks = top ? topFilters : sidebarFilters

  return filtersBlocks.map((filter, index) =>
    top ? (
      <Col key={index} sm="6" xl="3" className="mb-3">
        {Array.isArray(filter) ? (
          filter.map((item) => (
            <React.Fragment key={item.subtitle}>
              <h6 className="text-dark">{item.subtitle}</h6>
              {item.component}
            </React.Fragment>
          ))
        ) : (
          <React.Fragment>
            <h6 className="text-dark">{filter.subtitle}</h6>
            {filter.component}
          </React.Fragment>
        )}
      </Col>
    ) : (
      <div key={index} className="sidebar-block px-3 px-lg-0">
        <a
          className="d-lg-none block-toggler"
          data-toggle="collapse"
          aria-expanded={collapse[filter.subtitle]}
          onClick={() => toggleCollapse(filter.subtitle)}
        >
          {filter.title}
          <span className="block-toggler-icon" />
        </a>
        <Collapse in={collapse[filter.subtitle]} className="expand-lg">
          <div>
            <h5 className="sidebar-heading d-none d-lg-block">
              {filter.subtitle}
            </h5>
            {filter.component}
          </div>
        </Collapse>
      </div>
    )
  )
}

export default Filters
