import React, { useEffect, useState, useCallback } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Button,
  Badge,
  Modal,
  Alert,
  OverlayTrigger,
  Tooltip,
  InputGroup
} from "react-bootstrap"
import { useRouter } from "next/router"
import Link from "next/link"
import CustomerSidebar from "../../components/CustomerSidebar"
import { getUserFromLocalStorage } from "../../utils/authUtils"
import { useUser } from "../../components/UserContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faStar,
  faStarHalfAlt,
  faEdit,
  faTrashAlt,
  faInfoCircle,
  faShoppingBag,
  faComment,
  faCheckCircle,
  faExclamationCircle,
  faHistory
} from "@fortawesome/free-solid-svg-icons"
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"
import Image from "../../components/Image"
import { getUserFeedbacks, updateFeedback } from "../../api/FeedbackAPI"
import styles from '../../styles/Feedbacks.module.css'

export async function getStaticProps() {
  return { props: { title: "Đánh giá sản phẩm" } }
}

const RatingStars = ({ rating }) => {
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          className="text-warning me-1"
        />
      )
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          className="text-warning me-1"
        />
      )
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={farStar}
          className="text-warning me-1"
        />
      )
    }

    return stars
  }

  return <div className="d-inline-block">{renderStars()}</div>
}

const RatingInput = ({ value, onChange, disabled }) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="rating-input d-flex align-items-center mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={star <= (hoverRating || value) ? faStar : farStar}
          className={`text-warning fs-3 me-2 ${disabled ? 'opacity-50' : ''} ${styles.starIcon}`}
          style={{ 
            cursor: disabled ? "default" : "pointer",
            transform: `scale(${star <= (hoverRating || value) ? 1.1 : 1})`,
            transition: 'all 0.2s ease'
          }}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHoverRating(star)}
          onMouseLeave={() => !disabled && setHoverRating(0)}
        />
      ))}
      <span className="ms-2 text-muted" style={{ fontWeight: value ? 500 : 400 }}>
        {value ? `${value}/5 sao` : "Chọn đánh giá"}
      </span>
    </div>
  )
}

const FeedbackCard = ({ feedback, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa đánh giá"
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={`mb-4 border-0 shadow-sm ${styles.feedbackCard}`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex">
            <div
              className={`product-img me-3 ${styles.productImage}`}
              style={{ width: "80px", height: "80px" }}
            >
              <Image
                src={feedback.productImage}
                alt={feedback.productName}
                className="img-fluid rounded"
                width={80}
                height={80}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <h6 className={`product-name mb-1 ${styles.productName}`}>
                <Link
                  href={`/product/${feedback.productId}`}
                  className="text-decoration-none text-dark"
                >
                  {feedback.productName}
                </Link>
              </h6>
              <div className="product-attributes small text-muted mb-2">
                <span className={styles.productAttribute}>
                  Màu: <strong>{feedback.color}</strong>
                </span>{" "}
                <span className="mx-1">|</span>
                <span className={styles.productAttribute}>
                  Size: <strong>{feedback.size}</strong>
                </span>
              </div>
              <div className="d-flex align-items-center">
                {feedback.public ? (
                  <>
                    <RatingStars rating={feedback.rating} />
                    <span className="ms-2 small text-muted">
                      <FontAwesomeIcon icon={faHistory} className="me-1" />
                      {formatDate(feedback.createdAt)}
                    </span>
                    {feedback.edited && (
                      <Badge bg="secondary" className="ms-2" pill>
                        Đã chỉnh sửa
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge bg="warning" text="dark" className={styles.pendingBadge}>
                    <FontAwesomeIcon icon={faExclamationCircle} className="me-1" />
                    Chưa đánh giá
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div>
            {!feedback.public ? (
              <Button
                variant="primary"
                size="sm"
                className={styles.actionButton}
                onClick={() => onEdit(feedback)}
              >
                <FontAwesomeIcon icon={faComment} className="me-2" />
                Viết đánh giá
              </Button>
            ) : !feedback.edited ? (
              <Button
                variant="outline-primary"
                size="sm"
                className={styles.actionButton}
                onClick={() => onEdit(feedback)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Chỉnh sửa
              </Button>
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip className={styles.customTooltip}>
                    Bạn đã chỉnh sửa đánh giá này, không thể chỉnh sửa thêm
                  </Tooltip>
                }
              >
                <span>
                  <Button variant="outline-secondary" size="sm" disabled className={styles.disabledButton}>
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Đã chỉnh sửa
                  </Button>
                </span>
              </OverlayTrigger>
            )}
          </div>
        </div>

        {feedback.public && feedback.comment && (
          <div className={`feedback-content p-3 rounded ${styles.commentBox}`}>
            <p className="mb-0">{feedback.comment}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

const UserFeedbacks = () => {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useUser()
  const [showModal, setShowModal] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  })
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [modalFadeOut, setModalFadeOut] = useState(false)
  const [updatingList, setUpdatingList] = useState(false)
  const [successClosing, setSuccessClosing] = useState(false)

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (!userData) {
      router.push("/account/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router, user])

  useEffect(() => {
    if (isAuthenticated) {
      fetchFeedbacks()
    }
  }, [isAuthenticated])

  const fetchFeedbacks = useCallback(async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) {
        setLoading(true)
      } else {
        setUpdatingList(true)
      }
      
      const token = getUserFromLocalStorage()?.token
      if (!token) {
        throw new Error("Token không hợp lệ")
      }

      const response = await getUserFeedbacks(token)

      if (response.success) {
        setFeedbacks(response.data)
      } else {
        setError("Không thể tải danh sách đánh giá")
      }
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.message || 
        "Lỗi không xác định"
      )
    } finally {
      setLoading(false)
      setUpdatingList(false)
    }
  }, [])

  const handleEditFeedback = (feedback) => {
    setCurrentFeedback(feedback)
    setFormData({
      rating: feedback.rating || 0,
      comment: feedback.comment || "",
    })
    setModalFadeOut(false)
    setShowModal(true)
  }

  const handleCloseModal = (isSuccess = false) => {
    if (isSuccess) {
      setSuccessClosing(true);
      setTimeout(() => {
        setModalFadeOut(true);
        setTimeout(() => {
          setShowModal(false);
          setModalFadeOut(false);
          setSuccessClosing(false);
          setSubmitStatus({ type: "", message: "" });
          
          setTimeout(() => {
            fetchFeedbacks(false);
          }, 500);
        }, 600);
      }, 1200);
    } else {
      setModalFadeOut(true);
      setTimeout(() => {
        setShowModal(false);
        setModalFadeOut(false);
        setSubmitStatus({ type: "", message: "" });
      }, 300);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRatingChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      rating: value,
    }))
  }

  const handleSubmitFeedback = async (e) => {
    e.preventDefault()
    if (formData.rating === 0) {
      setSubmitStatus({
        type: "danger",
        message: "Vui lòng chọn số sao đánh giá",
      })
      return
    }

    setSubmitting(true)
    setSubmitStatus({ type: "", message: "" })

    try {
      const token = getUserFromLocalStorage()?.token
      if (!token) {
        throw new Error("Token không hợp lệ")
      }

      // Chỉ cần gửi rating và comment, api sẽ tự xử lý
      const feedbackData = {
        rating: formData.rating,
        comment: formData.comment
      }

      // Sử dụng cùng một API endpoint cho cả tạo mới và chỉnh sửa
      const response = await updateFeedback(token, currentFeedback.id, feedbackData)

      if (response.success) {
        // Cập nhật thông báo thành công
        setSubmitStatus({
          type: "success",
          message: response.message || "Cập nhật đánh giá thành công"
        })
        
        // Cập nhật lại đánh giá trong state hiện tại mà không reload toàn bộ danh sách
        const updatedFeedback = {
          ...currentFeedback,
          rating: formData.rating,
          comment: formData.comment,
          public: true,
          edited: currentFeedback.public ? true : false, // Đánh dấu là đã chỉnh sửa nếu feedback đã tồn tại
        }
        
        // Cập nhật state một cách mượt mà
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(item => 
            item.id === updatedFeedback.id ? updatedFeedback : item
          )
        )
        
        // Sử dụng hiệu ứng đóng dịu hơn qua tham số isSuccess
        handleCloseModal(true);
      } else {
        setSubmitStatus({
          type: "danger",
          message: response.message || "Có lỗi xảy ra",
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: "danger",
        message:
          error.response?.data?.message || error.message || "Lỗi không xác định",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className={`text-center p-5 bg-white rounded shadow ${styles.loadingContainer}`}>
          <Spinner
            animation="border"
            variant="primary"
            className="mb-4"
            style={{ width: "3.5rem", height: "3.5rem" }}
          />
          <p className="mb-0 text-muted">Đang tải dữ liệu đánh giá...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-light min-vh-100 py-5 ${styles.pageBackground}`}>
      <Container>
        <Row className="mb-4">
          <Col md={12}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h1 className={`h3 fw-bold mb-2 ${styles.pageTitle}`}>Đánh giá sản phẩm</h1>
                <p className={`text-muted mb-0 ${styles.pageSubtitle}`}>
                  Quản lý đánh giá sản phẩm bạn đã mua
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Sidebar */}
          <Col xl="3" lg="4" className="order-lg-2">
            <div className="sticky-top" style={{ top: "20px" }}>
              {/* Customer Sidebar */}
              <CustomerSidebar />
            </div>
          </Col>

          {/* Main content */}
          <Col lg="8" xl="9" className="order-lg-1">
            {/* Feedback Statistics Card */}
            <Card className={`border-0 shadow-sm mb-4 overflow-hidden ${styles.statsCard}`}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className={`stats-item text-center p-3 ${styles.statsItem}`}>
                    <div className={styles.statsIcon}>
                      <FontAwesomeIcon icon={faShoppingBag} className="text-primary" />
                    </div>
                    <h3 className="h4 fw-bold mb-1">{feedbacks.length}</h3>
                    <p className="text-muted mb-0">Tổng đánh giá</p>
                  </div>
                  <div className={`stats-item text-center p-3 ${styles.statsItem}`}>
                    <div className={styles.statsIcon}>
                      <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                    </div>
                    <h3 className="h4 fw-bold mb-1">
                      {feedbacks.filter((f) => f.public).length}
                    </h3>
                    <p className="text-muted mb-0">Đã đánh giá</p>
                  </div>
                  <div className={`stats-item text-center p-3 ${styles.statsItem}`}>
                    <div className={styles.statsIcon}>
                      <FontAwesomeIcon icon={faExclamationCircle} className="text-warning" />
                    </div>
                    <h3 className="h4 fw-bold mb-1">
                      {feedbacks.filter((f) => !f.public).length}
                    </h3>
                    <p className="text-muted mb-0">Chưa đánh giá</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Tips Section */}
            <Card className={`border-0 shadow-sm mb-4 bg-white overflow-hidden ${styles.tipsCard}`}>
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center">
                  <div className={`me-3 ${styles.tipsIcon}`}>
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-primary"
                    />
                  </div>
                  Lưu ý khi đánh giá
                </h5>
                <ul className={`text-muted small mb-0 ps-3 ${styles.tipsList}`}>
                  <li className="mb-2">
                    Đánh giá của bạn sẽ giúp người khác có quyết định mua hàng
                    tốt hơn
                  </li>
                  <li className="mb-2">
                    Nội dung đánh giá nên khách quan, cụ thể về trải nghiệm
                    sản phẩm
                  </li>
                  <li>
                    Bạn chỉ có thể chỉnh sửa mỗi đánh giá một lần
                  </li>
                </ul>
              </Card.Body>
            </Card>

            {/* Feedback List */}
            <Card className={`border-0 shadow-sm overflow-hidden ${styles.feedbacksCard}`}>
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 d-flex align-items-center">
                    <div className={`me-3 ${styles.listIcon}`}>
                      <FontAwesomeIcon icon={faStar} className="text-warning" />
                    </div>
                    Danh sách đánh giá
                  </h5>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className={`mb-4 ${styles.alert}`}>
                    <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                    {error}
                  </Alert>
                )}

                {updatingList && (
                  <div className={styles.listOverlay}>
                    <Spinner animation="border" variant="primary" size="sm" />
                  </div>
                )}

                {feedbacks.length === 0 ? (
                  <div className={`text-center py-5 ${styles.emptyState}`}>
                    <div className="mb-4">
                      <div className={styles.emptyStateIcon}>
                        <FontAwesomeIcon
                          icon={faStar}
                          className="text-muted"
                        />
                      </div>
                    </div>
                    <h4 className="mb-3">Bạn chưa có sản phẩm nào để đánh giá</h4>
                    <p className="text-muted mb-4">
                      Mua sắm và trải nghiệm sản phẩm để có thể chia sẻ ý kiến của bạn
                    </p>
                    <Button variant="primary" href="/category/all" className={styles.emptyStateButton}>
                      <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                      Mua sắm ngay
                    </Button>
                  </div>
                ) : (
                  <div className={styles.feedbackList}>
                    {feedbacks.map((feedback) => (
                      <FeedbackCard
                        key={feedback.id}
                        feedback={feedback}
                        onEdit={handleEditFeedback}
                      />
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Feedback Modal */}
      <Modal 
        show={showModal} 
        onHide={() => handleCloseModal(false)} 
        centered 
        size="lg"
        className={`${styles.feedbackModal} ${modalFadeOut ? styles.modalFadeOut : styles.modalFadeIn} ${successClosing ? styles.modalSuccessClosing : ''}`}
        backdrop="static"
      >
        <div className={styles.modalContent}>
          <Modal.Header closeButton className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>
              {currentFeedback?.public
                ? "Chỉnh sửa đánh giá"
                : "Viết đánh giá sản phẩm"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            {submitStatus.message && (
              <Alert 
                variant={submitStatus.type} 
                className={`mb-4 ${styles.alert} ${submitStatus.type === 'success' ? styles.successAlert : ''}`}
              >
                <div className={styles.alertIconContainer}>
                  <FontAwesomeIcon 
                    icon={submitStatus.type === 'success' ? faCheckCircle : faExclamationCircle} 
                    className={submitStatus.type === 'success' ? styles.successIcon : styles.errorIcon} 
                  />
                </div>
                <div>
                  {submitStatus.type === 'success' && <div className={styles.alertTitle}>Thành công!</div>}
                  {submitStatus.type === 'danger' && <div className={styles.alertTitle}>Có lỗi!</div>}
                  {submitStatus.message}
                </div>
              </Alert>
            )}

            {currentFeedback && (
              <div className={`feedback-form ${successClosing ? styles.formSuccessClosing : ''}`}>
                {currentFeedback.edited && (
                  <Alert variant="warning" className={`mb-4 ${styles.warningAlert}`}>
                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                    Lưu ý: Đánh giá này đã được chỉnh sửa trước đó. Bạn không thể chỉnh sửa lại.
                  </Alert>
                )}
                <div className={`product-info d-flex align-items-center mb-4 p-3 rounded ${styles.productInfoBox}`}>
                  <div className={styles.productModalImage}>
                    <Image
                      src={currentFeedback.productImage}
                      alt={currentFeedback.productName}
                      width={100}
                      height={100}
                      className="rounded"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-2">{currentFeedback.productName}</h5>
                    <div className="text-muted">
                      <span className={styles.productModalAttribute}>
                        Màu: <strong>{currentFeedback.color}</strong>
                      </span>{" "}
                      <span className="mx-2">|</span>
                      <span className={styles.productModalAttribute}>
                        Size: <strong>{currentFeedback.size}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Form onSubmit={handleSubmitFeedback} className={styles.feedbackForm}>
                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabel}>Đánh giá của bạn</Form.Label>
                    <div className={styles.ratingInputContainer}>
                      <RatingInput
                        value={formData.rating}
                        onChange={handleRatingChange}
                        disabled={currentFeedback.edited || successClosing}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className={styles.formLabel}>Nhận xét của bạn</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm này..."
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      disabled={currentFeedback.edited || successClosing}
                      className={styles.commentTextarea}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-secondary"
                      className={`me-3 ${styles.cancelButton}`}
                      onClick={() => handleCloseModal(false)}
                      disabled={submitting || successClosing}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting || currentFeedback.edited || successClosing}
                      className={styles.submitButton}
                    >
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Đang xử lý...
                        </>
                      ) : currentFeedback.public ? (
                        <>
                          <FontAwesomeIcon icon={faEdit} className="me-2" />
                          Cập nhật đánh giá
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faStar} className="me-2" />
                          Gửi đánh giá
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Modal.Body>
        </div>
      </Modal>
    </div>
  )
}

export default UserFeedbacks 