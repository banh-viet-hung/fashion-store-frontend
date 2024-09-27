import React from "react"
import { Container, Row, Col, Breadcrumb } from "react-bootstrap"
import Link from "next/link"
import products from "../../data/products-clothes.json"
import CardProduct from "../../components/CardProduct"

import CategoriesMenu from "../../components/CategoriesMenu"

import Pagination from "../../components/Pagination"
import Filters from "../../components/Filters"
import CategoryTopBar from "../../components/CategoryTopBar"

export async function getStaticProps() {
  return {
    props: {
      title: "Danh mục sản phẩm",
    },
  }
}

const Category = () => {
  const productsFull = products.concat(products)
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
              {productsFull.slice(0, -2).map((product, index) => (
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
    </React.Fragment>
  )
}

export default Category
