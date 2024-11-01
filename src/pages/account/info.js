import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap"
import CustomerSidebar from "../../components/CustomerSidebar"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-regular-svg-icons"
import { getUserFromLocalStorage } from "../../utils/authUtils"
import { useUser } from "../../components/UserContext"
import { getUserInfo, updateUserInfo } from "../../api/UserAPI" // Đường dẫn đúng đến file chứa hàm này
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

// Định nghĩa schema với Yup cho thông tin người dùng
const userInfoSchema = yup.object().shape({
  fullName: yup.string().required("Họ và tên không được để trống"),
  phoneNumber: yup.string().required("Số điện thoại không được để trống"),
  gender: yup.string().required("Giới tính không được để trống"),
  dateOfBirth: yup
    .date()
    .nullable()
    .required("Ngày sinh không được để trống")
    .typeError("Ngày sinh không được để trống"),
})

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
  const [formInputs, setFormInputs] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: null,
  })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ message: "", type: "" })
  const { user } = useUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(userInfoSchema),
  })

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      const fetchUserInfo = async () => {
        try {
          const response = await getUserInfo(userData.token)
          console.log("User info:", response)
          if (response.success) {
            setFormInputs({
              fullName: response.data.fullName || "",
              phoneNumber: response.data.phoneNumber || "",
              gender: response.data.gender || "",
              dateOfBirth: response.data.dateOfBirth || "",
            })

            // Cập nhật giá trị cho react-hook-form
            setValue("fullName", response.data.fullName || "")
            setValue("phoneNumber", response.data.phoneNumber || "")
            setValue("gender", response.data.gender || "")
            setValue("dateOfBirth", response.data.dateOfBirth || "")
          } else {
            showNotification(
              response.message || "Không thể tải thông tin người dùng.",
              "error"
            )
          }
        } catch (error) {
          console.error("Error fetching user info:", error)
          showNotification(
            "Đã xảy ra lỗi khi lấy thông tin người dùng.",
            "error"
          )
        } finally {
          setLoading(false)
        }
      }

      fetchUserInfo()
    } else {
      router.push("/account/login")
    }
  }, [router, user, setValue])

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: "", type: "" })
    }, 3000)
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserInfoSubmit = async (data) => {
    const token = getUserFromLocalStorage().token

    // Định dạng ngày sinh theo dạng YYYY-MM-DD
    const dateOfBirth = new Date(data.dateOfBirth)
    const formattedDateOfBirth = `${dateOfBirth.getFullYear()}-${(
      dateOfBirth.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${dateOfBirth.getDate().toString().padStart(2, "0")}`

    const updatedData = {
      ...data,
      dateOfBirth: formattedDateOfBirth,
    }

    try {
      console.log("Data to update:", updatedData)
      await updateUserInfo(token, updatedData) // Gọi hàm cập nhật
      showNotification("Cập nhật thông tin thành công", "success")
    } catch (error) {
      console.error("Error updating user info:", error)
      showNotification("Có lỗi xảy ra, vui lòng thử lại", "error")
    }
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
              {notification.message && (
                <Alert
                  variant={
                    notification.type === "success" ? "success" : "danger"
                  }
                >
                  {notification.message}
                </Alert>
              )}
              <h3 className="mb-5">Thông tin cá nhân</h3>
              <Form onSubmit={handleSubmit(handleUserInfoSubmit)}>
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
                        {...register(field)} // Đăng ký trường với react-hook-form
                        value={formInputs[field] || ""}
                        onChange={onChange}
                      />
                      {errors[field] && (
                        <p className="text-danger">{errors[field].message}</p>
                      )}
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
                        onChange={(e) => {
                          setValue("gender", e.target.value) // Cập nhật giá trị giới tính
                          setFormInputs((prev) => ({
                            ...prev,
                            gender: e.target.value,
                          })) // Cập nhật trạng thái
                        }}
                        checked={formInputs.gender === gender}
                      />
                    ))}
                    {errors.gender && (
                      <p className="text-danger">{errors.gender.message}</p>
                    )}
                  </Col>
                  <Col sm="12" className="mb-4">
                    <Form.Label htmlFor="dateOfBirth">Ngày sinh</Form.Label>
                    <Form.Control
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      {...register("dateOfBirth")} // Đăng ký trường với react-hook-form
                      value={formInputs.dateOfBirth || ""}
                      onChange={onChange}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-danger">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
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
