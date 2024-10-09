import React from "react"
import { useState } from "react"
import { Container, Row, Col, Nav, Tab, Button } from "react-bootstrap"
import ReviewForm from "../components/ReviewForm"
import Stars from "../components/Stars"
import Avatar from "./Avatar"
import Image from "./Image"

const ProductBottomTabs = ({ product, thumbnail, feedbacks }) => {
  const [visibleFeedbacks, setVisibleFeedbacks] = useState(1) // Số feedback hiển thị
  const feedbackIncrement = 1 // Số feedback hiển thị thêm mỗi lần

  const handleShowMore = () => {
    setVisibleFeedbacks((prev) => prev + feedbackIncrement)
  }

  return (
    <section className="mt-5">
      <Container>
        <Tab.Container defaultActiveKey="first">
          <Nav variant="tabs" className="flex-column flex-sm-row">
            <Nav.Item>
              <Nav.Link
                eventKey="first"
                className={`detail-nav-link`}
                style={{ cursor: "pointer" }}
              >
                MÔ TẢ SẢN PHẨM
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="third"
                className={`detail-nav-link`}
                style={{ cursor: "pointer" }}
              >
                ĐÁNH GIÁ SẢN PHẨM{" "}
                {feedbacks.length > 0 && `(${feedbacks.length})`}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="py-4">
            <Tab.Pane className="px-3" eventKey="first">
              <Row>
                <Col
                  md="7"
                  dangerouslySetInnerHTML={{
                    __html: product.detail || product.description,
                  }}
                />
                <Col md="5">
                  {thumbnail ? (
                    <Image
                      className="img-fluid"
                      src={thumbnail}
                      alt={product.name}
                      width={507}
                      height={507}
                    />
                  ) : (
                    <p>No image available</p>
                  )}
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              <Row className="mb-5">
                <Col lg="10" xl="9">
                  {feedbacks.slice(0, visibleFeedbacks).map((feedback) => (
                    <div key={feedback.id} className="review d-flex">
                      <div className="text-center me-4 me-xl-5">
                        <Avatar
                          size="xl"
                          image={feedback.user.avatar}
                          alt={feedback.user.fullName}
                          border
                          className="p-2 mb-2"
                        />
                      </div>
                      <div>
                        <h5 className="mt-2 mb-1">{feedback.user.fullName}</h5>
                        <div className="mb-2">
                          <Stars
                            stars={feedback.rating}
                            color="warning"
                            secondColor="gray-200"
                            starClass="fa-xs"
                          />
                        </div>
                        <p className="text-muted">{feedback.comment}</p>
                        <span className="text-uppercase text-muted">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
              {feedbacks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ color: "#6c757d", fontSize: "1.25rem" }}>
                    Chưa có đánh giá
                  </p>
                  <p style={{ color: "#6c757d", fontSize: "1rem" }}>
                    Hãy mua và đánh giá sản phẩm này nhé!
                  </p>
                </div>
              )}
              {visibleFeedbacks < feedbacks.length && (
                <div className="text-center mt-3">
                  <Button variant="link" onClick={handleShowMore}>
                    Xem thêm
                  </Button>
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </section>
  )
}

export default ProductBottomTabs
