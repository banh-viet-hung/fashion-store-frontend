import React, { useContext, useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Nav,
  Button,
  Form,
  Spinner,
} from "react-bootstrap"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRouter } from "next/router"

import { FormContext } from "../components/FormContext"
import OrderSummary from "../components/OrderSummary"
import { CartContext } from "../components/CartContext" // Import CartContext
import { useUser } from "../components/UserContext"
import { getUserFromLocalStorage } from "../utils/authUtils"
import { getUserAddresses } from "../api/AddressAPI"
import { Badge, Card } from "react-bootstrap"

// Validation schema with Yup
const schema = yup.object().shape({
  full_name: yup.string().required("Họ và tên là bắt buộc"),
  phone_number: yup
    .string()
    .matches(/^(\d{10})$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  city: yup.string().required("Tỉnh/Thành là bắt buộc"),
  district: yup.string().required("Quận/Huyện là bắt buộc"),
  ward: yup.string().required("Phường/Xã là bắt buộc"),
})

export async function getStaticProps() {
  return {
    props: {
      title: "Thanh toán",
      checkout: true,
    },
  }
}

const Checkout1 = () => {
  const [formInputs, setFormInputs] = React.useContext(FormContext) // Checkout inputs context
  const [cart, dispatch] = useContext(CartContext) // Lấy dữ liệu từ CartContext
  const { user } = useUser()
  const router = useRouter() // Initialize the router
  const [isLoading, setIsLoading] = useState(true) // State to manage loading
  const [userData, setUserData] = useState(null) // State to manage user data

  const [addresses, setAddresses] = useState([]) // State to manage user addresses
  const [selectedAddress, setSelectedAddress] = useState(null) // State to manage selected address

  // Kiểm tra xem giỏ hàng có trống không
  useEffect(() => {
    const checkCart = async () => {
      if (cart.length === 0) {
        router.push("/cart") // Điều hướng về trang giỏ hàng nếu giỏ hàng trống
      } else {
        setIsLoading(false) // Stop loading if cart has items
      }

      const userDataFromLocalStorage = getUserFromLocalStorage()
      setUserData(userDataFromLocalStorage)

      if (userDataFromLocalStorage) {
        const addresses = await getUserAddresses(userDataFromLocalStorage.token)
        console.log("Addresses:", addresses)
        setAddresses(addresses.data || []) // Store addresses in state
        // Check if any address is default and set it as selected
        if (addresses.data) {
          const defaultAddress = addresses.data?.find(
            (address) => address.defaultAddress
          )
          const addressToSelect = defaultAddress || addresses.data[0]
          setSelectedAddress(addressToSelect)
          setFormInputs({
            ...formInputs,
            address: {
              full_name: addressToSelect.fullName,
              phone_number: addressToSelect.phoneNumber,
              address: addressToSelect.address,
              city: addressToSelect.city,
              district: addressToSelect.district,
              ward: addressToSelect.ward,
              defaultAddress: addressToSelect.defaultAddress,
            },
          })
        } else {
          setSelectedAddress(null)
        }
      }
    }

    checkCart() // Run cart check on mount
  }, [cart, router, user])

  // Ensure that formInputs has default values (empty string or existing values)
  const defaultValues = {
    full_name: formInputs?.address?.full_name || "",
    phone_number: formInputs?.address?.phone_number || "",
    address: formInputs?.address?.address || "",
    city: formInputs?.address?.city || "",
    district: formInputs?.address?.district || "",
    ward: formInputs?.address?.ward || "",
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger, // Trigger validation manually
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur", // Validate on blur
    defaultValues: defaultValues, // Set initial values from context or empty strings
  })

  // Handle form change and save in context
  const onChange = (e) => {
    const value = e.target.value || "" // Ensure value is not undefined
    setFormInputs({
      ...formInputs,
      address: {
        ...formInputs.address,
        [e.target.name]: value,
      },
    })
    setValue(e.target.name, value) // Sync with react-hook-form
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address) // Update selected address
    // Update form inputs with the selected address values
    setFormInputs({
      ...formInputs,
      address: {
        full_name: address.fullName,
        phone_number: address.phoneNumber,
        address: address.address,
        city: address.city,
        district: address.district,
        ward: address.ward,
        defaultAddress: address.defaultAddress,
      },
    })
    console.log("Form inputs changed:", formInputs)
  }

  const data = [
    {
      name: "Địa chỉ nhận hàng",
      title: true,
      titleclass: "mb-4",
      step: 1,
      inputs: [
        {
          label: "Họ và tên",
          name: "full_name",
          placeholder: "Nguyễn Văn A",
          type: "text",
        },
        {
          label: "Số điện thoại",
          name: "phone_number",
          placeholder: "0123456789",
          type: "text",
        },
        {
          label: "Địa chỉ",
          name: "address",
          placeholder: "123 Đường ABC",
          type: "text",
        },
        {
          label: "Tỉnh/Thành",
          name: "city",
          placeholder: "Hà Nội",
          type: "text",
        },
        {
          label: "Quận/Huyện",
          name: "district",
          placeholder: "Quận Hoàn Kiếm",
          type: "text",
        },
        {
          label: "Phường/Xã",
          name: "ward",
          placeholder: "Phường Lý Thái Tổ",
          type: "text",
        },
      ],
    },
  ]

  const handleNextClick = async () => {
    if (!userData) {
      // Trigger validation manually
      const isValidForm = await trigger()
      if (isValidForm) {
        // If form is valid, save data to context as an 'address' object
        console.log("Form is valid, saving data to context")
        setFormInputs({
          ...formInputs,
          address: { ...formInputs.address, defaultAddress: false },
        }) // Save the entire address data into context
        console.log("Data saved to context:", formInputs)
        // After saving, navigate to the next step (checkout2)
        router.push("/checkout2") // Use router.push to navigate to the next page
      } else {
        // If form is not valid, the error messages will be displayed
        console.log("Form is not valid, showing errors.")
      }
    } else {
      if (formInputs.address) {
        router.push("/checkout2")
      } else {
        alert("Vui lòng thêm địa chỉ nhận hàng")
      }
    }
  }

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <React.Fragment>
      <section className="hero py-6">
        <Container>
          <Breadcrumb>
            <Link href="/" passHref>
              <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item active>Thanh toán</Breadcrumb.Item>
          </Breadcrumb>
          <div className="hero-content">
            <h1 className="hero-heading">Thanh toán</h1>
            <div>
              <p className="lead text-muted">
                Vui lòng nhập đầy đủ thông tin địa chỉ nhận hàng
              </p>
            </div>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <Nav variant="pills" className="custom-nav mb-5">
                <Nav.Item className="w-25">
                  <Link href="/checkout1" passHref>
                    <Nav.Link className="text-sm" active>
                      Địa chỉ nhận hàng
                    </Nav.Link>
                  </Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled">Vận chuyển</Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled">Thanh toán</Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-25">
                  <Nav.Link className="text-sm disabled">Tổng kết</Nav.Link>
                </Nav.Item>
              </Nav>

              {userData ? (
                <>
                  {addresses.length > 0 ? (
                    <>
                      {addresses.map((address) => (
                        <Card
                          key={address.id}
                          className={`mb-3 ${
                            selectedAddress?.id === address.id
                              ? "border-primary"
                              : ""
                          }`}
                        >
                          <Card.Body>
                            <Form.Check
                              type="radio"
                              label={
                                <>
                                  <strong>{address.fullName}</strong> -{" "}
                                  <strong>{address.phoneNumber}</strong>
                                  <p>
                                    {address.address} - {address.district} -{" "}
                                    {address.city} - {address.ward}
                                  </p>
                                  {address.defaultAddress && (
                                    <Badge pill variant="success">
                                      Địa chỉ mặc định
                                    </Badge>
                                  )}
                                </>
                              }
                              name="address"
                              value={address.id}
                              checked={selectedAddress?.id === address.id}
                              onChange={() => handleAddressSelect(address)}
                            />
                          </Card.Body>
                        </Card>
                      ))}
                      {/* Thêm nút "Thêm hoặc chỉnh sửa địa chỉ" ở đây */}
                      <div className="mt-3 text-center">
                        <strong>
                          Bạn cũng có thể thêm hoặc cập nhật địa chỉ{" "}
                          <Link href="/account/user-address"> tại đây </Link>
                        </strong>
                      </div>
                    </>
                  ) : (
                    <div className="text-muted">
                      Bạn chưa có địa chỉ nào.{" "}
                      <Link href="/account/user-address">
                        Vui lòng thêm địa chỉ mới.
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                data.map((block) => {
                  return block.step === 1 ? (
                    <div key={block.name}>
                      {block.title && (
                        <h3 className={block.titleclass}>{block.name}</h3>
                      )}

                      {/* INPUTS */}
                      {block.inputs && (
                        <Row>
                          {block.inputs.map((input, index) => (
                            <React.Fragment key={index}>
                              {input.type === "text" && (
                                <Col md={6} className="mb-4">
                                  <Form.Label htmlFor={input.name}>
                                    {input.label}
                                  </Form.Label>
                                  <Controller
                                    name={input.name}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        type={input.type}
                                        {...field}
                                        placeholder={input.placeholder}
                                        onChange={(e) => {
                                          field.onChange(e)
                                          onChange(e)
                                        }}
                                      />
                                    )}
                                  />
                                  {errors[input.name] && (
                                    <Form.Text className="text-danger">
                                      {errors[input.name]?.message}
                                    </Form.Text>
                                  )}
                                </Col>
                              )}
                            </React.Fragment>
                          ))}
                        </Row>
                      )}
                      {/* END INPUTS */}
                    </div>
                  ) : null
                })
              )}

              {/* CHECKOUT PREV/NEXT BUTTONS */}
              <div className="my-5 d-flex justify-content-between flex-column flex-lg-row">
                <Link href="/cart" passHref>
                  <Button variant="link" className="text-muted">
                    <FontAwesomeIcon icon={faAngleLeft} className="me-2" />
                    Quay về giỏ hàng
                  </Button>
                </Link>
                <Button
                  variant="dark"
                  onClick={handleNextClick} // Always clickable, handle validation on click
                >
                  Tiếp tục
                  <FontAwesomeIcon icon={faAngleRight} className="ms-2" />
                </Button>
              </div>
              {/* END CHECKOUT PREV/NEXT BUTTONS */}
            </Col>
            <Col lg="4">
              <OrderSummary />
            </Col>
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Checkout1
