import React, { useEffect, useState } from "react"
import { Container, Row, Col, Breadcrumb, Spinner } from "react-bootstrap"
import Link from "next/link"
import CardProduct from "../../components/CardProduct"
import CategoriesMenu from "../../components/CategoriesMenu"
import PaginationComponent from "../../components/Pagination" // Sử dụng PaginationComponent mới
import CategoryTopBar from "../../components/CategoryTopBar"
import { useRouter } from "next/router"
import { getFilteredProducts } from "../../api/ProductAPI"

export async function getStaticProps() {
  return {
    props: {
      title: "Danh mục sản phẩm",
    },
  }
}

const Category = () => {
  const [products, setProducts] = useState([]) // Sản phẩm sẽ được lưu ở đây
  const [totalPages, setTotalPages] = useState(1) // Tổng số trang
  const [currentPage, setCurrentPage] = useState(0) // Trang hiện tại
  const [loading, setLoading] = useState(false) // Trạng thái loading
  const [filterParams, setFilterParams] = useState({
    sizeNames: [],
    colorNames: [],
    minPrice: 0,
    maxPrice: 5000000,
    sortBy: null,
    categorySlugs: [], // Không truyền slug ở đây, vì có thể có nhiều danh mục con
  })

  // Hàm lấy sản phẩm từ API với các tham số lọc
  const fetchProducts = async (page) => {
    setLoading(true)
    try {
      const size = 16 // số sản phẩm mỗi trang
      const data = await getFilteredProducts({
        categorySlugs: filterParams.categorySlugs,
        sizeNames: filterParams.sizeNames,
        colorNames: filterParams.colorNames,
        minPrice: filterParams.minPrice,
        maxPrice: filterParams.maxPrice,
        page,
        size,
        sortBy: filterParams.sortBy,
      })
      setProducts(data.data.content)
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage, filterParams])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleFilterChange = (newFilters) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      ...newFilters,
    }))
    setCurrentPage(0) // Reset về trang đầu khi thay đổi bộ lọc
  }

  return (
    <Container fluid className="container-fluid-px py-6">
      <Breadcrumb>
        <Link href="/" passHref>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item active>Tất cả sản phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <div className="hero-content pb-5">
        <h1>Tất cả sản phẩm</h1>
        <Row>
          <Col xl="8">
            <p className="lead text-muted">
              Chào mừng bạn đến với thế giới thời trang nam của chúng tôi! Từ áo
              sơ mi thanh lịch đến áo phông trẻ trung và quần jeans phóng
              khoáng, bộ sưu tập của chúng tôi có tất cả. Khám phá để tỏa sáng
              với phong cách riêng của bạn!
            </p>
          </Col>
        </Row>
      </div>

      <Row>
        <Col xl="9" lg="8" className="products-grid order-lg-2">
          <CategoryTopBar filter onFilterChange={handleFilterChange} />

          {/* Nếu đang load dữ liệu */}
          {loading ? (
            <div className="loading-container text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row>
              {products.map((product, index) => (
                <Col key={index} xxl="3" xl="4" xs="6">
                  <CardProduct product={product} />
                </Col>
              ))}
            </Row>
          )}

          {/* Pagination component */}
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </Col>

        <Col xl="3" lg="4" className="sidebar pe-xl-5 order-lg-1">
          <CategoriesMenu long />
        </Col>
      </Row>
    </Container>
  )
}

export default Category
