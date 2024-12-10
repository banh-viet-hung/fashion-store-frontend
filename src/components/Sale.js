import React, { useEffect, useState } from "react"
import { Container, Row, Col, Button, Badge } from "react-bootstrap"
import Icon from "./Icon"
import Image from "./Image"
import { useRouter } from "next/router" // Import useRouter từ next/router

const Sale = (props) => {
  const [date, setDate] = useState(false)
  const [timeLeft, setTimeLeft] = useState({})
  const router = useRouter() // Khởi tạo useRouter hook

  useEffect(() => {
    const today = new Date()
    const newDate = today.getTime() + 15 * 86400000
    setDate(today.setTime(newDate))
  }, [])

  const calculateTimeLeft = () => {
    const difference = +date - +new Date()
    difference > 0 &&
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      calculateTimeLeft()
    }, 1000)
    return () => {
      clearTimeout(timeout)
    }
  }, [timeLeft, date])

  // Hàm để chuyển hướng khi bấm vào nút "KHÁM PHÁ NGAY"
  const handleExploreClick = () => {
    router.push("/category") // Điều hướng tới trang /category
  }

  return (
    <div
      className={`overflow-hidden position-relative ${props.className}`}
      style={{
        backgroundColor: props.backgroundColor && props.backgroundColor,
      }}
    >
      {props.backgroundImage && (
        <Image
          className="bg-image"
          src={props.backgroundImage}
          alt="background image"
          objectPosition="right"
          layout="fill"
        />
      )}
      {props.blobColor && (
        <Icon
          icon="blob-shape-4"
          className="svg-blob position-absolute"
          style={{ left: "-200px", top: 0, color: props.blobColor }}
        />
      )}
      <Container className="position-relative">
        <Row>
          <Col
            lg={props.image ? 6 : 10}
            xl="6"
            className={props.image ? "d-flex align-items-center" : ""}
          >
            <div>
              <p className="subtitle mb-3 text-danger">Deal of the week</p>
              <h3 className="h1">ĐỒ CHẠY BỘ</h3>
              <p className="text-muted">
                <del className="me-3">199.000 VNĐ</del>
                <span>99.000 VNĐ</span>
              </p>
              <p className="mb-4">
                <Badge bg="danger" className="badge badge-danger p-3">
                  SALE 50%
                </Badge>
              </p>
              <div className="bg-white px-5 py-4 shadow mb-4" id="countdown">
                <div className="row justify-content-between">
                  {Object.keys(timeLeft).map((interval) => (
                    <div
                      key={interval}
                      className="col-6 col-sm-3 text-center mb-4 mb-sm-0"
                    >
                      <h6 className="h4 mb-2 days">
                        {timeLeft[interval]}&nbsp;
                      </h6>
                      <span className="text-muted">{interval}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                <Button variant="outline-dark" onClick={handleExploreClick}>
                  KHÁM PHÁ NGAY
                </Button>
              </p>
            </div>
          </Col>
          {props.image && (
            <Col lg="6" className="text-center">
              <Image
                className="img-fluid"
                src={props.image}
                alt=""
                width={350}
                height={450}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default Sale
