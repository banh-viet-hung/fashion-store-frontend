import React from "react"
import { useState } from "react"
import { Container, Row, Col, Button, Card } from "react-bootstrap"
import Stars from "../components/Stars"
import Avatar from "./Avatar"
import Image from "./Image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faCheck, faPencilAlt, faChevronDown } from "@fortawesome/free-solid-svg-icons"

const ProductBottomTabs = ({ product, feedbacks }) => {
  const [visibleFeedbacks, setVisibleFeedbacks] = useState(2)
  const feedbackIncrement = 3

  const handleShowMore = () => {
    setVisibleFeedbacks((prev) => prev + feedbackIncrement)
  }

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

  // Calculate average rating
  const averageRating = feedbacks && feedbacks.length > 0
    ? (feedbacks.reduce((acc, item) => acc + item.rating, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <section className="mt-5 py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h4 className="mb-0 fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.1rem' }}>
            Đánh giá sản phẩm
            <span className="ms-2 text-muted fw-normal">
              {feedbacks && feedbacks.length > 0 && `(${feedbacks.length})`}
            </span>
          </h4>
        </div>

        {!feedbacks || feedbacks.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <div className="mb-3">
              <Image
                src="/img/no-reviews.svg"
                alt="Chưa có đánh giá"
                width={80}
                height={80}
                fallback={<div className="text-muted" style={{ fontSize: '2rem' }}>📝</div>}
              />
            </div>
            <h5 style={{ color: "#6c757d" }}>Chưa có đánh giá</h5>
            <p className="text-muted small">Hãy mua và đánh giá sản phẩm này nhé!</p>
          </div>
        ) : (
          <>
            {/* Ratings Summary */}
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <Row>
                <Col md={4} className="border-end">
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <div className="h2 fw-bold mb-0">{averageRating}</div>
                    <div className="mb-2">
                      <Stars
                        stars={parseFloat(averageRating)}
                        size="1rem"
                        color="warning"
                        secondColor="gray-300"
                        starClass="me-1"
                      />
                    </div>
                    <div className="text-muted small">{feedbacks.length} đánh giá</div>
                  </div>
                </Col>
                <Col md={8}>
                  {/* Rating Distribution */}
                  <div className="ps-md-4 pt-4 pt-md-0">
                    {[5, 4, 3, 2, 1].map(star => {
                      const count = feedbacks.filter(f => f.rating === star).length;
                      const percentage = (count / feedbacks.length) * 100;
                      return (
                        <div key={star} className="d-flex align-items-center mb-2">
                          <div className="me-2" style={{ width: '16px', fontSize: '0.8rem' }}>{star} ★</div>
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px', backgroundColor: '#eee', borderRadius: '10px' }}>
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{ width: `${percentage}%`, backgroundColor: '#ffb800', borderRadius: '10px' }}
                              aria-valuenow={percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                          <div className="ms-1" style={{ width: '20px', fontSize: '0.8rem', color: '#6c757d' }}>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Reviews List */}
            <div className="mb-4">
              {feedbacks.slice(0, visibleFeedbacks).map((feedback, index) => (
                <Card key={feedback.id} className={`border-0 shadow-sm mb-3 ${index > 0 ? 'mt-3' : ''}`}>
                  <Card.Body className="p-4">
                    <div className="d-flex">
                      <div className="me-3">
                        <Avatar
                          size="md"
                          image={feedback.userAvatar || "/img/avatar-placeholder.png"}
                          alt={feedback.userName || "Người dùng"}
                          border
                        />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-1 fw-bold">{feedback.userName || "Người dùng ẩn danh"}</h6>
                          <div className="text-muted small">
                            <FontAwesomeIcon icon={faClock} className="me-1" size="xs" />
                            <span style={{ fontSize: '0.8rem' }}>{formatRelativeTime(feedback.createdAt)}</span>
                          </div>
                        </div>

                        <div className="mb-2">
                          <Stars
                            stars={feedback.rating || 0}
                            color="warning"
                            secondColor="gray-200"
                            starClass="fa-xs me-1"
                            size="0.8rem"
                          />
                          {feedback.verified && (
                            <span className="text-success ms-2" style={{ fontSize: '0.75rem' }}>
                              <FontAwesomeIcon icon={faCheck} className="me-1" size="xs" />
                              Đã mua hàng
                            </span>
                          )}
                        </div>

                        {feedback.edited && (
                          <div className="mb-1" style={{ fontSize: '0.75rem' }}>
                            <span className="text-muted fst-italic">
                              <FontAwesomeIcon icon={faPencilAlt} className="me-1" size="xs" />
                              đã chỉnh sửa
                            </span>
                          </div>
                        )}

                        <div className="mt-2">
                          <p className="mb-0" style={{ fontSize: '0.9rem' }}>{feedback.content || "Không có nội dung đánh giá."}</p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {/* Show more button */}
              {feedbacks.length > visibleFeedbacks && (
                <div className="text-center mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={handleShowMore}
                    size="sm"
                    className="px-4 rounded-pill"
                    style={{ borderWidth: '1px', fontSize: '0.85rem' }}
                  >
                    <FontAwesomeIcon icon={faChevronDown} className="me-2" size="xs" />
                    Xem thêm đánh giá
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  )
}

export default ProductBottomTabs
