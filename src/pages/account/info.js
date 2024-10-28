import React, { useEffect, useState } from "react"
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap"
import CustomerSidebar from "../../components/CustomerSidebar"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-regular-svg-icons"
import { getUserFromLocalStorage } from "../../utils/authUtils"
import { useUser } from "../../components/UserContext"

export async function getStaticProps() {
  return { props: { title: "Tài khoản của bạn" } }
}

const passwordInputs = [
  {
    label: "Mật khẩu cũ",
    name: "password_old",
    type: "password",
    autocomplete: "current-password",
  },
  {
    label: "Mật khẩu mới",
    name: "password_1",
    type: "password",
    autocomplete: "new-password",
  },
  {
    label: "Nhập lại mật khẩu mới",
    name: "password_2",
    type: "password",
    autocomplete: "new-password",
  },
]

const CustomerAccount = () => {
  const router = useRouter()
  const [formInputs, setFormInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    console.log(user)
    const userData = getUserFromLocalStorage()
    if (userData) {
      setLoading(false)
    } else {
      router.push("/account/login") 
    }
  }, [router, user]) 

  const onChange = (e) => {
    const { name, value } = e.target
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <>
      <section className="hero py-6">
        <Container>
          <div className="hero-content">
            <h1 className="hero-heading mb-3">Thông tin tài khoản</h1>
            <p className="lead text-muted">
              Quản lý thông tin cá nhân và mật khẩu của bạn
            </p>
          </div>
        </Container>
      </section>
      <section className="pb-6">
        <Container>
          <Row>
            <Col lg="8" xl="9" className="mb-5 mb-lg-0">
              <h3 className="mb-5">Thông tin cá nhân</h3>
              <Form>
                <Row>
                  {["fullName", "phoneNumber"].map((field) => (
                    <Col sm="12" className="mb-4" key={field}>
                      <Form.Label htmlFor={field}>
                        {field === "fullName" ? "Họ và tên" : "Số điện thoại"}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id={field}
                        name={field}
                        value={formInputs[field] || ""}
                        onChange={onChange}
                      />
                    </Col>
                  ))}
                  <Col sm="12" className="mb-4">
                    <Form.Label>Giới tính</Form.Label>
                    {["Nam", "Nữ", "Khác"].map((gender) => (
                      <Form.Check
                        key={gender}
                        type="radio"
                        label={gender}
                        name="gender"
                        value={gender}
                        onChange={onChange}
                        checked={formInputs.gender === gender}
                      />
                    ))}
                  </Col>
                  <Col sm="12" className="mb-4">
                    <Form.Label htmlFor="dateOfBirth">Ngày sinh</Form.Label>
                    <Form.Control
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formInputs.dateOfBirth || ""}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
                <div className="mt-4">
                  <Button variant="dark" type="submit">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>

              <hr className="my-5" />
              <h3 className="mb-5">Đổi mật khẩu</h3>
              <Form>
                <Row>
                  {passwordInputs.map((input) => (
                    <Col sm="6" key={input.name} className="mb-4">
                      <Form.Label htmlFor={input.name}>
                        {input.label}
                      </Form.Label>
                      <Form.Control
                        type={input.type}
                        id={input.name}
                        value={formInputs[input.name] || ""}
                        onChange={onChange}
                        autoComplete={input.autocomplete}
                      />
                    </Col>
                  ))}
                </Row>
                <div className="mt-4">
                  <Button variant="dark" type="submit">
                    <FontAwesomeIcon icon={faSave} className="me-2" />
                    Lưu thay đổi
                  </Button>
                </div>
              </Form>
            </Col>
            <Col xl="3" lg="4" className="mb-5">
              <CustomerSidebar />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default CustomerAccount
