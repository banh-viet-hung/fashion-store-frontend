import React, { useEffect, useState } from "react"
import { Container, Row, Col, Breadcrumb, Alert } from "react-bootstrap"
import Link from "next/link"
import Head from "next/head"
import CardProduct from "../components/CardProduct"
import Pagination from "../components/Pagination"
import { searchProductsByName } from "../api/SearchAPI"
import { useRouter } from "next/router"

export async function getServerSideProps(context) {
  const { search } = context.query
  return {
    props: {
      title: search ? `Kết quả tìm kiếm: ${search}` : "Kết quả tìm kiếm",
    },
  }
}

const Spotlight = ({ title }) => {
  const router = useRouter()
  const { search } = router.query
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [noProductsFound, setNoProductsFound] = useState(false)

  useEffect(() => {
    if (search) {
      fetchProducts(search)
    }
  }, [search, currentPage])

  const fetchProducts = async (search) => {
    try {
      const size = 8
      const data = await searchProductsByName(search, currentPage, size)
      setProducts(data._embedded.product || [])
      setTotalPages(data.page.totalPages)
      setNoProductsFound(data._embedded.product.length === 0)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <>
      <Head>
        <title>{title}</title> {/* Đặt tiêu đề cho tab */}
      </Head>
      <Container fluid className="container-fluid-px py-6">
        <Row>
          <Col xl="12" className="products-grid">
            <div className="hero-content pb-5">
              <h1>Kết quả tìm kiếm</h1>
              <h5 className="text-muted">Từ khóa: "{search}"</h5>
              <Breadcrumb>
                <Link href="/" passHref>
                  <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
                </Link>
                <Breadcrumb.Item active>Danh sách sản phẩm</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            {noProductsFound ? (
              <Alert variant="warning">
                Không tìm thấy sản phẩm phù hợp theo yêu cầu của bạn!
                <br />
                Vui lòng quay lại để tiếp tục mua sắm bạn nhé!
              </Alert>
            ) : (
              <>
                <Row>
                  {products.map((product, index) => (
                    <Col key={index} sm="4" xl="3" xs="6">
                      <CardProduct product={product} />
                    </Col>
                  ))}
                </Row>
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Spotlight
