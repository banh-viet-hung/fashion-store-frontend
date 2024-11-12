import React, { useEffect, useState } from "react"
import { Container, Row, Col, Breadcrumb } from "react-bootstrap"
import Link from "next/link"
import CardProduct from "../../components/CardProduct"
import CategoriesMenu from "../../components/CategoriesMenu"
import Filters from "../../components/Filters"
import Pagination from "../../components/Pagination"
import CategoryAPI from "../../api/CategoryAPI" // Import CategoryAPI mới

// Lấy danh sách các slug từ API
export async function getStaticPaths() {
  try {
    const response = await CategoryAPI.getAllCategories()
    const categories = response._embedded.category // Truy cập vào danh sách danh mục
    const paths = categories.map((category) => ({
      params: { slug: category.slug }, // Sử dụng slug làm tham số
    }))

    return { paths, fallback: false }
  } catch (error) {
    console.error("Error fetching categories for paths:", error)
    return { paths: [], fallback: false }
  }
}

// Lấy thông tin danh mục và sản phẩm cho mỗi slug
export async function getStaticProps({ params }) {
  const response = await CategoryAPI.getAllCategories()
  const categories = response._embedded.category
  const category = categories.find((cat) => cat.slug === params.slug)

  // Trả về các props cần thiết cho trang
  return {
    props: {
      title: `Danh mục ${category.name}`,
      slug: params.slug, // Truyền slug để lấy sản phẩm theo slug
    },
  }
}

const CategorySlug = ({ title, slug }) => {
  const [products, setProducts] = useState([]) // Dữ liệu sản phẩm
  const [totalPages, setTotalPages] = useState(1) // Tổng số trang
  const [currentPage, setCurrentPage] = useState(0) // Trang hiện tại

  // Hàm lấy sản phẩm theo phân trang
  const fetchProducts = async (page) => {
    try {
      const size = 16 // Số sản phẩm trên mỗi trang
      const data = await CategoryAPI.getProductsByCategorySlug(slug, page, size) // Gọi API lấy sản phẩm theo slug và trang
      setProducts(data._embedded.product) // Lưu sản phẩm vào state
      setTotalPages(data.page.totalPages) // Lưu tổng số trang
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  // Gọi API để lấy sản phẩm khi component được render hoặc khi chuyển trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchProducts(currentPage) // Gọi hàm lấy sản phẩm khi trang thay đổi
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchData()
  }, [currentPage, slug]) // Chạy lại khi `currentPage` hoặc `slug` thay đổi

  // Hàm xử lý khi người dùng chọn trang mới
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber) // Cập nhật trang hiện tại
  }

  return (
    <Container fluid className="container-fluid-px py-6">
      <Row>
        <Col xl="9" lg="8" className="products-grid order-lg-2">
          <h1>{title}</h1>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Link href="/category" passHref>
              <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>{title}</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            {products.map((product, index) => (
              <Col key={index} sm="4" xl="3" xs="6">
                <CardProduct product={product}/>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
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
  )
}

export default CategorySlug
