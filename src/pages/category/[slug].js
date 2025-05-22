import React, { useEffect, useState } from "react"
import { Container, Row, Col, Breadcrumb, Spinner } from "react-bootstrap"
import Link from "next/link"
import CardProduct from "../../components/CardProduct"
import PaginationComponent from "../../components/Pagination" // Sử dụng PaginationComponent mới
import CategoryTopBar from "../../components/CategoryTopBar"
import { useRouter } from "next/router"
import { getFilteredProducts } from "../../api/ProductAPI"
import CategoryAPI from "../../api/CategoryAPI"

// Lấy danh sách sản phẩm từ API
export async function getStaticPaths() {
  try {
    const response = await CategoryAPI.getAllCategories()
    const categories = response._embedded.category
    const paths = categories.map((category) => ({
      params: { slug: category.slug },
    }))

    return { paths, fallback: false }
  } catch (error) {
    console.error("Error fetching categories for paths:", error)
    return { paths: [], fallback: false }
  }
}

// Lấy dữ liệu danh mục và sản phẩm
export async function getStaticProps({ params }) {
  const response = await CategoryAPI.getAllCategories()
  const categories = response._embedded.category
  const category = categories.find((cat) => cat.slug === params.slug)

  return {
    props: {
      title: `Danh mục - ${category.name}`,
      slug: params.slug,
    },
  }
}

const CategoryMasonry = ({ title, slug }) => {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [filterParams, setFilterParams] = useState({
    sizeNames: [],
    colorNames: [],
    minPrice: 0,
    maxPrice: 5000000,
    sortBy: null,
    categorySlugs: [slug],
  })
  const [loading, setLoading] = useState(false) // New state for loading

  const router = useRouter()
  const { child } = router.query

  useEffect(() => {
    if (child) {
      setFilterParams((prevParams) => ({
        ...prevParams,
        categorySlugs: [slug, child],
      }))
    } else {
      setFilterParams((prevParams) => ({
        ...prevParams,
        categorySlugs: [slug],
      }))
    }
    setCurrentPage(0)
  }, [slug, child])

  const fetchProducts = async (page) => {
    setLoading(true) // Set loading to true before fetching
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

      console.log(filterParams)

      setProducts(data.data.content)
      setTotalPages(data.data.totalPages)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false) // Set loading to false after fetching
    }
  }

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage, slug, child, filterParams])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleFilterChange = (newFilters) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      ...newFilters,
    }))
  }

  // Lọc bỏ sản phẩm đã bị xóa
  const filteredProducts = products.filter(product => !product.deleted)

  if (filteredProducts.length === 0) {
    return (
      <Container className="py-6">
        <div className="products-grid">
          <div className="hero-content pb-5">
            <h1>{title}</h1>
            <Row>
              <Col xl="8">
                {/* <p className="lead text-muted">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
            do eiusmod tempor incididunt.
          </p> */}
              </Col>
            </Row>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Danh sách sản phẩm</Breadcrumb.Item>
          </Breadcrumb>

          {/* Thanh lọc và tìm kiếm */}
          <CategoryTopBar
            filter
            onFilterChange={handleFilterChange}
            slug={slug}
            child={child}
          />

          {/* Loading indicator */}
          <div className="loading-container text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-6">
      <div className="products-grid">
        <div className="hero-content pb-5">
          <h1>{title}</h1>
          <Row>
            <Col xl="8">
              {/* <p className="lead text-muted">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt.
              </p> */}
            </Col>
          </Row>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb>
          <Link href="/" passHref>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          </Link>
          <Breadcrumb.Item active>Danh sách sản phẩm</Breadcrumb.Item>
        </Breadcrumb>

        {/* Thanh lọc và tìm kiếm */}
        <CategoryTopBar
          filter
          onFilterChange={handleFilterChange}
          slug={slug}
          child={child}
        />

        {/* Loading indicator */}
        {loading ? (
          <div className="loading-container text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product, index) => (
              <Col key={index} sm="4" xl="3" xs="6">
                <CardProduct product={product} />
              </Col>
            ))}
          </Row>
        )}

        {loading ? (
          <div className="loading-container text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container>
  )
}

export default CategoryMasonry
