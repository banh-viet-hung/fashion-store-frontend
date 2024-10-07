import React from "react"
import { Container, Row, Col, Breadcrumb } from "react-bootstrap"
import Link from "next/link"
import products from "../../data/products-clothes.json" // Chỉnh sửa đường dẫn nếu cần
import CardProduct from "../../components/CardProduct"
import CategoriesMenu from "../../components/CategoriesMenu"
import Filters from "../../components/Filters"
import Pagination from "../../components/Pagination"
import CategoryAPI from "../../api/CategoryAPI"

export async function getStaticPaths() {
  try {
    const response = await CategoryAPI.getAllCategories()
    const categories = response._embedded.category // Truy cập vào danh sách danh mục
    const paths = categories.map((category) => ({
      params: { slug: category.slug }, // Sử dụng trường slug
    }))

    return { paths, fallback: false }
  } catch (error) {
    console.error("Error fetching categories for paths:", error)
    return { paths: [], fallback: false } // Nếu có lỗi, trả về không có paths
  }
}

export async function getStaticProps({ params }) {
  const response = await CategoryAPI.getAllCategories()
  const categories = response._embedded.category
  const category = categories.find((cat) => cat.slug === params.slug)

  const categoryProducts = products.filter(
    (product) => product.category === category.name // Dùng tên category để lọc sản phẩm
  )

  return {
    props: {
      title: `Danh mục ${category.name}`,
      products: categoryProducts,
    },
  }
}

const CategorySlug = ({ products, title }) => {
  return (
    <Container fluid className="container-fluid-px py-6">
      <Row>
        <Col xl="9" lg="8" className="products-grid order-lg-2">
          <h1>
            {title}
          </h1>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Link href="/category" passHref>
              <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>
              {products.length ? products[0].category : "Không có sản phẩm"}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Row>
            {products.map((product, index) => (
              <Col key={index} sm="4" xl="3" xs="6">
                <CardProduct product={product} cardType={3} />
              </Col>
            ))}
          </Row>
          <Pagination />
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
