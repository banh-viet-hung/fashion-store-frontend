import React from "react"

import { Container, Row, Col, Button } from "react-bootstrap"

import Icon from "./Icon"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import CardProduct from "./CardProduct"

const NewArrivals = (props) => {
  const products = props.products

  return (
    <div
      className={`py-6 ${
        props.masonry ? "position-relative overflow-hidden" : ""
      }`}
    >
      <Container
        fluid={props.fluid}
        className={props.fluid ? "container-fluid-px" : ""}
      >
        {props.blob1 && (
          <Icon
            icon={props.blob1}
            className="svg-blob svg-blob-fill-current d-none d-md-block"
            style={{ left: "-200px", top: "400px", color: props.blob1Color }}
          />
        )}
        {props.blob2 && (
          <Icon
            icon={props.blob2}
            className="svg-blob svg-blob-fill-current d-none d-md-block"
            style={{ right: "-200px", top: "600px", color: props.blob2Color }}
          />
        )}
        {props.fluid ? (
          <Row>
            <Col lg="10" xl="8" className="text-center mx-auto">
              <h2 className="display-3 mb-5">VỪA RA MẮT</h2>
              <p className="lead text-muted mb-6">
                Một buổi sáng, khi ánh nắng nhẹ nhàng chiếu qua cửa sổ, bạn thức
                dậy với tâm trạng hứng khởi, sẵn sàng cho một ngày mới. Với
                những bộ trang phục nam tính và phụ kiện thời thượng trong bộ
                sưu tập mới, bạn sẽ tự tin bước ra thế giới. Hãy để phong cách
                của bạn tỏa sáng, từ áo sơ mi thanh lịch đến quần jeans năng
                động, và không quên những chiếc đồng hồ, thắt lưng hay giày dép
                ấn tượng. Khám phá ngay để khẳng định phong cách riêng của bạn!
              </p>
            </Col>
          </Row>
        ) : (
          <div className={props.headCenter ? "text-center" : ""}>
            <h2
              className={props.masonry ? "display-2 fw-bold mb-5" : ""}
              style={{ color: props.masonry && "#efb2af" }}
            >
              VỪA RA MẮT
            </h2>
            {!props.masonry && (
              <p className="lead text-muted mb-5">
                Một buổi sáng, khi ánh nắng nhẹ nhàng chiếu qua cửa sổ, bạn thức
                dậy với tâm trạng hứng khởi, sẵn sàng cho một ngày mới. Với
                những bộ trang phục nam tính và phụ kiện thời thượng trong bộ
                sưu tập mới, bạn sẽ tự tin bước ra thế giới. Hãy để phong cách
                của bạn tỏa sáng, từ áo sơ mi thanh lịch đến quần jeans năng
                động, và không quên những chiếc đồng hồ, thắt lưng hay giày dép
                ấn tượng. Khám phá ngay để khẳng định phong cách riêng của bạn!
              </p>
            )}
          </div>
        )}

        <Row className="justify-content-between align-items-center mb-4">
          <Col xs="12" sm={props.fluid} md={!props.fluid}>
            <ul
              className={`list-inline text-center text-sm-start mb-3 ${
                props.fluid ? "mb-sm-0" : "mb-md-0"
              }`}
            >
              <li className="list-inline-item">
                <a className="text-dark" href="#">
                  Tất cả sản phẩm{" "}
                </a>
              </li>
              <li className="list-inline-item">
                <a className="text-muted text-hover-dark" href="#">
                  Áo{" "}
                </a>
              </li>
              <li className="list-inline-item">
                <a className="text-muted text-hover-dark" href="#">
                  Quần
                </a>
              </li>
              <li className="list-inline-item">
                <a className="text-muted text-hover-dark" href="#">
                  Đồ lót
                </a>
              </li>
              <li className="list-inline-item">
                <a className="text-muted text-hover-dark" href="#">
                  Phụ kiện
                </a>
              </li>
            </ul>
          </Col>
          <Col
            xs="12"
            sm={props.fluid && "auto"}
            md={!props.fluid && "auto"}
            className="text-center"
          >
            <Button variant="link" className="px-0" href="#">
              Tất cả sản phẩm
            </Button>
          </Col>
        </Row>
        {props.masonry ? (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 500: 2, 900: 3, 1000: 4 }}
          >
            <Masonry className="row">
              {products.map((product, index) => (
                <Col key={index} className="item">
                  <CardProduct
                    product={product}
                    showQuickView={props.showQuickView}
                  />
                </Col>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        ) : (
          <Row>
            {products.map((product, index) =>
              props.fluid ? (
                <Col key={index} xl={2} lg={3} md={4} xs={6}>
                  <CardProduct product={product} />
                </Col>
              ) : (
                index < 8 && (
                  <Col key={index} xl={3} lg={3} md={4} xs={6}>
                    <CardProduct key={index} product={product} />
                  </Col>
                )
              )
            )}
          </Row>
        )}
      </Container>
    </div>
  )
}

export default NewArrivals
