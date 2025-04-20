import React from "react"
import { useState } from "react"
import { Container, Row, Col, Nav, Tab, Button, Card, Badge } from "react-bootstrap"
import ReviewForm from "../components/ReviewForm"
import Stars from "../components/Stars"
import Avatar from "./Avatar"
import Image from "./Image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faCheck, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

const ProductBottomTabs = ({ product, thumbnail, feedbacks }) => {
  const [visibleFeedbacks, setVisibleFeedbacks] = useState(2) // Hiển thị 2 feedback ban đầu
  const feedbackIncrement = 3 // Hiển thị thêm 3 feedback mỗi lần

  const handleShowMore = () => {
    setVisibleFeedbacks((prev) => prev + feedbackIncrement)
  }

  // Hàm để hiển thị thời gian tương đối
  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Không có thông tin";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);

    if (diffYear > 0) return `${diffYear} năm trước`;
    if (diffMonth > 0) return `${diffMonth} tháng trước`;
    if (diffDay > 0) return `${diffDay} ngày trước`;
    if (diffHour > 0) return `${diffHour} giờ trước`;
    if (diffMin > 0) return `${diffMin} phút trước`;
    return 'Vừa xong';
  };

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
                {feedbacks && feedbacks.length > 0 && `(${feedbacks.length})`}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="py-4">
            <Tab.Pane className="px-3" eventKey="first">
              <Row>
                <Col
                  md="7"
                  dangerouslySetInnerHTML={{
                    __html: product.detail || product.description || "Không có mô tả chi tiết",
                  }}
                />
                <Col md="5">
                  {thumbnail ? (
                    <Image
                      className="img-fluid"
                      src={thumbnail}
                      alt={product.name || "Sản phẩm"}
                      width={507}
                      height={507}
                    />
                  ) : (
                    <p>Không có hình ảnh</p>
                  )}
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              {!feedbacks || feedbacks.length === 0 ? (
                <div className="text-center py-5 my-3">
                  <div className="mb-4">
                    <Image 
                      src="/img/no-reviews.svg" 
                      alt="Chưa có đánh giá"
                      width={120}
                      height={120}
                      className="mb-3"
                      fallback={<div className="text-muted display-1">📝</div>} 
                    />
                  </div>
                  <h3 style={{ color: "#6c757d", fontSize: "1.5rem" }}>
                    Chưa có đánh giá
                  </h3>
                  <p style={{ color: "#6c757d", fontSize: "1rem" }}>
                    Hãy mua và đánh giá sản phẩm này nhé!
                  </p>
                </div>
              ) : (
                <>
                  {/* Hiển thị đánh giá trung bình */}
                  {feedbacks.length > 0 && (
                    <Row className="mb-4 pb-3 border-bottom">
                      <Col md={6} className="d-flex align-items-center">
                        <div className="me-4">
                          <div className="display-4 fw-bold">
                            {(feedbacks.reduce((acc, item) => acc + item.rating, 0) / feedbacks.length).toFixed(1)}
                          </div>
                          <div className="d-block mt-2">
                            <Stars
                              stars={parseFloat(
                                (feedbacks.reduce((acc, item) => acc + item.rating, 0) / feedbacks.length).toFixed(1)
                              )}
                              size="1.5rem"
                              color="warning"
                              secondColor="gray-300"
                              starClass="me-1"
                            />
                          </div>
                          <div className="text-muted mt-1">{feedbacks.length} đánh giá</div>
                        </div>
                      </Col>
                      <Col md={6}>
                        {/* Phân bố số sao */}
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = feedbacks.filter(f => f.rating === star).length;
                          const percentage = (count / feedbacks.length) * 100;
                          return (
                            <div key={star} className="d-flex align-items-center mb-2">
                              <div className="me-2" style={{ width: '10px' }}>{star}</div>
                              <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar bg-warning" 
                                  role="progressbar" 
                                  style={{ width: `${percentage}%` }}
                                  aria-valuenow={percentage} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <div className="ms-2" style={{ width: '35px' }}>{count}</div>
                            </div>
                          );
                        })}
                      </Col>
                    </Row>
                  )}

                  {/* Danh sách đánh giá */}
                  <Row className="mb-4">
                    <Col>
                      {feedbacks.slice(0, visibleFeedbacks).map((feedback) => (
                        <Card key={feedback.id} className="mb-4 border-0 shadow-sm">
                          <Card.Body>
                            <div className="d-flex">
                              <div className="me-3">
                                <Avatar
                                  size="xl"
                                  image={feedback.userAvatar || "/img/avatar-placeholder.png"}
                                  alt={feedback.userName || "Người dùng"}
                                  border
                                  className="p-1"
                                />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <h5 className="mb-1">{feedback.userName || "Người dùng ẩn danh"}</h5>
                                    <div className="d-flex align-items-center mb-2">
                                      <Stars
                                        stars={feedback.rating || 0}
                                        color="warning"
                                        secondColor="gray-200"
                                        starClass="fa-xs me-1"
                                      />
                                      <span className="text-muted ms-2">
                                        {feedback.rating || 0}/5
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-muted small">
                                    <FontAwesomeIcon icon={faClock} className="me-1" />
                                    {formatRelativeTime(feedback.createdAt)}
                                    {feedback.edited && (
                                      <span className="ms-2 text-muted fst-italic">
                                        <FontAwesomeIcon icon={faPencilAlt} className="me-1" />
                                        đã chỉnh sửa
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="my-3">{feedback.comment || "Không có bình luận"}</p>
                                
                                <div className="d-flex flex-wrap mb-3">
                                  {feedback.color && (
                                    <Badge bg="light" text="dark" className="me-2 mb-2 py-2 px-3">
                                      Màu: {feedback.color}
                                    </Badge>
                                  )}
                                  {feedback.size && (
                                    <Badge bg="light" text="dark" className="me-2 mb-2 py-2 px-3">
                                      Size: {feedback.size}
                                    </Badge>
                                  )}
                                </div>
                                
                                {feedback.productImage && (
                                  <div className="mt-2">
                                    <p className="text-muted small mb-2">Hình ảnh sản phẩm</p>
                                    <div style={{ maxWidth: '120px' }}>
                                      <img 
                                        src={feedback.productImage} 
                                        alt={feedback.productName || "Sản phẩm"} 
                                        className="img-thumbnail"
                                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                      
                      {visibleFeedbacks < feedbacks.length && (
                        <div className="text-center mt-4">
                          <Button 
                            variant="outline-primary" 
                            onClick={handleShowMore}
                            className="px-4 py-2"
                          >
                            Xem thêm {Math.min(feedbackIncrement, feedbacks.length - visibleFeedbacks)} đánh giá
                          </Button>
                        </div>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </section>
  )
}

export default ProductBottomTabs
