import React, { useEffect, useState } from "react"
import { Container, Row, Col, Breadcrumb } from "react-bootstrap"
import Link from "next/link"
import CardProduct from "../../components/CardProduct"
import CategoriesMenu from "../../components/CategoriesMenu"
import Pagination from "../../components/Pagination"
import Filters from "../../components/Filters"
import CategoryTopBar from "../../components/CategoryTopBar"
import { getProductsWithPagination } from "../../api/ProductAPI"

export async function getStaticProps() {
  return {
    props: {
      title: "Danh mục sản phẩm",
    },
  }
}

const Category = () => {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1) // Số trang tổng cộng
  const [currentPage, setCurrentPage] = useState(0) // Trang hiện tại

  // Gọi API để lấy sản phẩm khi component được render hoặc khi chuyển trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const size = 16 // Số sản phẩm trên mỗi trang
        const data = await getProductsWithPagination(currentPage, size)
        setProducts(data._embedded.product) // Lấy danh sách sản phẩm
        setTotalPages(data.page.totalPages) // Cập nhật tổng số trang
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchData()
  }, [currentPage]) // Chạy lại khi `currentPage` thay đổi

  // Hàm xử lý khi người dùng chọn trang mới
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber) // Cập nhật trang hiện tại
  }

  return (
    <React.Fragment>
      <Container fluid className="container-fluid-px py-6">
        <Row>
          <Col xl="9" lg="8" className="products-grid order-lg-2">
            <div className="hero-content pb-5">
              <h1>Tất cả sản phẩm</h1>
              <Row>
                <Col xl="8">
                  <p className="lead text-muted">
                    Chào mừng bạn đến với thế giới thời trang nam của chúng tôi!
                    Từ áo sơ mi thanh lịch đến áo phông trẻ trung và quần jeans
                    phóng khoáng, bộ sưu tập của chúng tôi có tất cả. Khám phá
                    để tỏa sáng với phong cách riêng của bạn!
                  </p>
                </Col>
              </Row>
            </div>
            <Breadcrumb>
              <Link href="/" passHref>
                <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
              </Link>
              <Breadcrumb.Item active>Sản phẩm</Breadcrumb.Item>
            </Breadcrumb>
            <CategoryTopBar />
            <Row>
              {products.map((product, index) => (
                <Col key={index} sm="4" xl="3" xs="6">
                  <CardProduct product={product} />
                </Col>
              ))}
            </Row>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </Col>
          <Col xl="3" lg="4" className="sidebar pe-xl-5 order-lg-1">
            <CategoriesMenu />
            <Filters />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  )
}

export default Category
