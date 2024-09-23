import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import Icon from "./Icon"

const ServicesBlock = () => {
  return (
    <div className="py-5 py-lg-6 bg-gray-100">
      <Container>
        <Row>
          {services.map((service) => (
            <Col
              key={service.name}
              lg="3"
              sm="6"
              className="py-4 service-column"
            >
              <Icon className="service-icon" icon={service.icon} />
              <div className="service-text">
                <h6 className="text-sm mb-1">{service.name}</h6>
                <p className="text-muted fw-light text-sm mb-0">
                  {service.text}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default ServicesBlock

const services = [
  {
    name: "Giao hàng nhanh chóng",
    text: "Từ 3 - 5 ngày làm việc",
    icon: "delivery-time-1",
  },
  {
    name: "Tiết kiệm",
    text: "Cam kết giá tốt nhất thị trường",
    icon: "money-1",
  },
  {
    name: "Ngập tràn ưu đãi",
    text: "Khuyến mãi hàng tuần",
    icon: "special-price-1",
  },
  {
    name: "037-2590-536",
    text: "Hổ trợ 24/7",
    icon: "customer-support-1",
  },
]
