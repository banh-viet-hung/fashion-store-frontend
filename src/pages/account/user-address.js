import React, { useEffect, useState, useCallback } from "react"
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-regular-svg-icons"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import { getUserFromLocalStorage } from "../../utils/authUtils"
import { getUserAddresses, createOrUpdateAddress } from "../../api/AddressAPI"
import { useUser } from "../../components/UserContext"

export async function getStaticProps() {
  return { props: { title: "Sổ địa chỉ" } }
}

// Định nghĩa schema với Yup cho địa chỉ
const addressSchema = yup.object().shape({
  full_name: yup.string().required("Họ và tên không được để trống"),
  phone_number: yup.string().required("Số điện thoại không được để trống"),
  address: yup.string().required("Số nhà không được để trống"),
  province: yup.string().required("Tỉnh/Thành không được để trống"),
  district: yup.string().required("Quận/Huyện không được để trống"),
  ward: yup.string().required("Phường/Xã không được để trống"),
})

const shippingSchema = yup.object().shape({
  shipping_full_name: yup.string().required("Họ và tên không được để trống"),
  shipping_phone_number: yup
    .string()
    .required("Số điện thoại không được để trống"),
  shipping_address: yup.string().required("Số nhà không được để trống"),
  shipping_province: yup.string().required("Tỉnh/Thành không được để trống"),
  shipping_district: yup.string().required("Quận/Huyện không được để trống"),
  shipping_ward: yup.string().required("Phường/Xã không được để trống"),
})

const CustomerAddresses = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userInfoNotification, setUserInfoNotification] = useState({
    message: "",
    type: "",
  })
  const [shippingNotification, setShippingNotification] = useState({
    message: "",
    type: "",
  })
  const [addresses, setAddresses] = useState([])
  const { user } = useUser()

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
  } = useForm({ resolver: yupResolver(addressSchema) })
  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    setValue: setShippingValue,
    formState: { errors: shippingErrors },
  } = useForm({ resolver: yupResolver(shippingSchema) })

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      const fetchAddresses = async () => {
        try {
          const response = await getUserAddresses(userData.token)
          if (response.success) {
            const addressesData = response.data || []
            setAddresses(addressesData)
            populateFormValues(addressesData)
          } else {
            setAddresses([])
          }
        } catch (error) {
          console.error("Error fetching user addresses:", error)
          setAddresses([])
        } finally {
          setLoading(false)
        }
      }
      fetchAddresses()
    } else {
      router.push("/account/login")
    }
  }, [router, setAddressValue, setShippingValue, user])

  const populateFormValues = (addressesData) => {
    const defaultAddress = addressesData.find((addr) => addr.defaultAddress)
    if (defaultAddress) {
      setAddressValue("full_name", defaultAddress.fullName)
      setAddressValue("phone_number", defaultAddress.phoneNumber)
      setAddressValue("address", defaultAddress.address)
      setAddressValue("province", defaultAddress.city)
      setAddressValue("district", defaultAddress.district)
      setAddressValue("ward", defaultAddress.ward)
    }

    const shippingAddress = addressesData.find((addr) => !addr.defaultAddress)
    if (shippingAddress) {
      setShippingValue("shipping_full_name", shippingAddress.fullName)
      setShippingValue("shipping_phone_number", shippingAddress.phoneNumber)
      setShippingValue("shipping_address", shippingAddress.address)
      setShippingValue("shipping_province", shippingAddress.city)
      setShippingValue("shipping_district", shippingAddress.district)
      setShippingValue("shipping_ward", shippingAddress.ward)
    }
  }

  const showUserInfoNotification = (message, type) => {
    setUserInfoNotification({ message, type })
    setTimeout(() => setUserInfoNotification({ message: "", type: "" }), 3000)
  }

  const showShippingNotification = (message, type) => {
    setShippingNotification({ message, type })
    setTimeout(() => setShippingNotification({ message: "", type: "" }), 3000)
  }

  const onAddressSubmit = useCallback(async (data) => {
    const userData = getUserFromLocalStorage()
    if (!userData) return // Nếu không có userData, không thực hiện gì

    const addressData = {
      fullName: data.full_name,
      phoneNumber: data.phone_number,
      address: data.address,
      city: data.province,
      district: data.district,
      ward: data.ward,
      defaultAddress: true, // Đặt mặc định là true nếu đây là địa chỉ mặc định
    }

    console.log("Submitting address data:", addressData) // Log dữ liệu địa chỉ

    try {
      const response = await createOrUpdateAddress(userData.token, addressData)
      console.log("Response from address API:", response) // Log phản hồi từ API

      if (response.success) {
        showUserInfoNotification(
          "Cập nhật địa chỉ mặc định thành công",
          "success"
        )
        // Cập nhật danh sách địa chỉ
        const updatedAddresses = await getUserAddresses(userData.token)
        setAddresses(updatedAddresses.data)
      } else {
        showUserInfoNotification("Cập nhật địa chỉ thất bại", "danger")
      }
    } catch (error) {
      console.error("Error updating address:", error) // Log lỗi
      showUserInfoNotification("Đã xảy ra lỗi khi cập nhật địa chỉ", "danger")
    }
  }, [])

  const onShippingSubmit = useCallback(async (data) => {
    const userData = getUserFromLocalStorage()
    if (!userData) return // Nếu không có userData, không thực hiện gì

    const shippingData = {
      fullName: data.shipping_full_name,
      phoneNumber: data.shipping_phone_number,
      address: data.shipping_address,
      city: data.shipping_province,
      district: data.shipping_district,
      ward: data.shipping_ward,
      defaultAddress: false, // Đặt mặc định là false nếu đây không phải địa chỉ mặc định
    }

    console.log("Submitting shipping data:", shippingData) // Log dữ liệu địa chỉ giao hàng

    try {
      const response = await createOrUpdateAddress(userData.token, shippingData)
      console.log("Response from shipping API:", response) // Log phản hồi từ API

      if (response.success) {
        showShippingNotification(
          "Cập nhật địa chỉ giao hàng thành công",
          "success"
        )
        // Cập nhật danh sách địa chỉ
        const updatedAddresses = await getUserAddresses(userData.token)
        setAddresses(updatedAddresses.data)
      } else {
        showShippingNotification(
          "Cập nhật địa chỉ giao hàng thất bại",
          "danger"
        )
      }
    } catch (error) {
      console.error("Error updating shipping address:", error) // Log lỗi
      showShippingNotification(
        "Đã xảy ra lỗi khi cập nhật địa chỉ giao hàng",
        "danger"
      )
    }
  }, [])

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  const renderForm = (fields, register, errors) => (
    <Row>
      {fields.map((field, index) => (
        <Col md={6} key={index} className="mb-4">
          <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
          <Form.Control
            type="text"
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
          {errors[field.name] && (
            <p className="text-danger">{errors[field.name].message}</p>
          )}
        </Col>
      ))}
    </Row>
  )

  const addressFields = [
    { name: "full_name", label: "Họ và tên", placeholder: "Nguyễn Văn A" },
    { name: "phone_number", label: "Số điện thoại", placeholder: "0123456789" },
    { name: "address", label: "Số nhà", placeholder: "123 Đường ABC" },
    { name: "ward", label: "Phường/Xã", placeholder: "Phường Lý Thái Tổ" },
    { name: "district", label: "Quận/Huyện", placeholder: "Quận Hoàn Kiếm" },
    { name: "province", label: "Tỉnh/Thành", placeholder: "Hà Nội" },
  ]

  const shippingFields = [
    {
      name: "shipping_full_name",
      label: "Họ và tên",
      placeholder: "Nguyễn Văn B",
    },
    {
      name: "shipping_phone_number",
      label: "Số điện thoại",
      placeholder: "0987654321",
    },
    {
      name: "shipping_address",
      label: "Số nhà",
      placeholder: "456 Đường XYZ",
    },
    {
      name: "shipping_ward",
      label: "Phường/Xã",
      placeholder: "Phường Bến Nghé",
    },
    { 
      name: "shipping_district", 
      label: "Quận/Huyện", 
      placeholder: "Quận 1" },

    {
      name: "shipping_province",
      label: "Tỉnh/Thành",
      placeholder: "TP. Hồ Chí Minh",
    },
  ]

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <div className="hero-content">
            <h1 className="hero-heading mb-3">Địa chỉ của bạn</h1>
          </div>
        </Container>
      </section>
      <section className="pb-6">
        <Container>
          <Row>
            <Col lg="8" xl="9" className="mb-5 mb-lg-0">
              <h3 className="mb-4">Địa chỉ mặc định</h3>
              {userInfoNotification.message && (
                <Alert
                  variant={
                    userInfoNotification.type === "success"
                      ? "success"
                      : "danger"
                  }
                >
                  {userInfoNotification.message}
                </Alert>
              )}
              <Form onSubmit={handleAddressSubmit(onAddressSubmit)}>
                {renderForm(addressFields, registerAddress, addressErrors)}
                <Button variant="dark" type="submit">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Lưu thay đổi
                </Button>
              </Form>

              <hr className="my-5" />
              <h3 className="mb-4">Địa chỉ giao hàng khác</h3>
              {shippingNotification.message && (
                <Alert
                  variant={
                    shippingNotification.type === "success"
                      ? "success"
                      : "danger"
                  }
                >
                  {shippingNotification.message}
                </Alert>
              )}
              <Form onSubmit={handleShippingSubmit(onShippingSubmit)}>
                {renderForm(shippingFields, registerShipping, shippingErrors)}
                <Button variant="dark" type="submit">
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Lưu thay đổi
                </Button>
              </Form>
            </Col>
            <Col xl="3" lg="4" className="mb-5">
              <CustomerSidebar />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default CustomerAddresses
