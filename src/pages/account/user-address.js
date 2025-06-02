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
import { getProvinces, getDistrictsByProvinceCode, getWardsByDistrictCode } from "../../api/VietnamAddressAPI"

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

  // State to track if the form has been populated from database initially
  const [formInitialized, setFormInitialized] = useState(false)
  const [shippingFormInitialized, setShippingFormInitialized] = useState(false)

  // State for address selection
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [shippingDistricts, setShippingDistricts] = useState([])
  const [shippingWards, setShippingWards] = useState([])

  // Selected values
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [selectedShippingProvince, setSelectedShippingProvince] = useState("")
  const [selectedShippingDistrict, setSelectedShippingDistrict] = useState("")
  const [selectedShippingWard, setSelectedShippingWard] = useState("")

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    setValue: setAddressValue,
    formState: { errors: addressErrors },
    watch: watchAddress,
  } = useForm({ resolver: yupResolver(addressSchema) })

  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    setValue: setShippingValue,
    formState: { errors: shippingErrors },
    watch: watchShipping,
  } = useForm({ resolver: yupResolver(shippingSchema) })

  // Watch province and district changes for both forms
  const watchProvince = watchAddress("province")
  const watchDistrict = watchAddress("district")
  const watchWard = watchAddress("ward")
  const watchShippingProvince = watchShipping("shipping_province")
  const watchShippingDistrict = watchShipping("shipping_district")
  const watchShippingWard = watchShipping("shipping_ward")

  // Move populateFormValues function here, before the useEffect that depends on it
  const populateFormValues = useCallback(async (addressesData) => {
    // Prevent re-populating if user has already interacted with the form
    if (formInitialized || shippingFormInitialized) {
      return;
    }

    const defaultAddress = addressesData.find((addr) => addr.defaultAddress)
    if (defaultAddress) {
      setAddressValue("full_name", defaultAddress.fullName)
      setAddressValue("phone_number", defaultAddress.phoneNumber)
      setAddressValue("address", defaultAddress.address)

      // Handle province - check if it's a code or name
      try {
        // Get all provinces if not already fetched
        if (provinces.length === 0) {
          const provinceData = await getProvinces()
          setProvinces(provinceData)
        }

        // First try to find by code (if database stores codes)
        let province = provinces.find(p => p.code === defaultAddress.city)

        // If not found by code, try to find by name (if database stores names)
        if (!province) {
          province = provinces.find(p => p.name === defaultAddress.city)
        }

        if (province) {
          setAddressValue("province", province.code)
          setSelectedProvince(province.code)

          // Now get districts for this province
          const districtData = await getDistrictsByProvinceCode(province.code)
          setDistricts(districtData)

          // Try to match district (by code or name)
          let district = districtData.find(d => d.code === defaultAddress.district)
          if (!district) {
            district = districtData.find(d => d.name === defaultAddress.district)
          }

          if (district) {
            setAddressValue("district", district.code)
            setSelectedDistrict(district.code)

            // Now get wards for this district
            const wardData = await getWardsByDistrictCode(district.code)
            setWards(wardData)

            // Try to match ward (by code or name)
            let ward = wardData.find(w => w.code === defaultAddress.ward)
            if (!ward) {
              ward = wardData.find(w => w.name === defaultAddress.ward)
            }

            if (ward) {
              setAddressValue("ward", ward.code)
              setSelectedWard(ward.code)
            }
          }
        }

        // Mark the form as initialized
        setFormInitialized(true)
      } catch (error) {
        console.error("Error populating address dropdown values:", error)
      }
    }

    const shippingAddress = addressesData.find((addr) => !addr.defaultAddress)
    if (shippingAddress) {
      setShippingValue("shipping_full_name", shippingAddress.fullName)
      setShippingValue("shipping_phone_number", shippingAddress.phoneNumber)
      setShippingValue("shipping_address", shippingAddress.address)

      // Handle shipping province - check if it's a code or name
      try {
        // Get all provinces if not already fetched
        if (provinces.length === 0) {
          const provinceData = await getProvinces()
          setProvinces(provinceData)
        }

        // First try to find by code (if database stores codes)
        let province = provinces.find(p => p.code === shippingAddress.city)

        // If not found by code, try to find by name (if database stores names)
        if (!province) {
          province = provinces.find(p => p.name === shippingAddress.city)
        }

        if (province) {
          setShippingValue("shipping_province", province.code)
          setSelectedShippingProvince(province.code)

          // Now get districts for this province
          const districtData = await getDistrictsByProvinceCode(province.code)
          setShippingDistricts(districtData)

          // Try to match district (by code or name)
          let district = districtData.find(d => d.code === shippingAddress.district)
          if (!district) {
            district = districtData.find(d => d.name === shippingAddress.district)
          }

          if (district) {
            setShippingValue("shipping_district", district.code)
            setSelectedShippingDistrict(district.code)

            // Now get wards for this district
            const wardData = await getWardsByDistrictCode(district.code)
            setShippingWards(wardData)

            // Try to match ward (by code or name)
            let ward = wardData.find(w => w.code === shippingAddress.ward)
            if (!ward) {
              ward = wardData.find(w => w.name === shippingAddress.ward)
            }

            if (ward) {
              setShippingValue("shipping_ward", ward.code)
              setSelectedShippingWard(ward.code)
            }
          }
        }

        // Mark the shipping form as initialized
        setShippingFormInitialized(true)
      } catch (error) {
        console.error("Error populating shipping address dropdown values:", error)
      }
    }
  }, [provinces, setAddressValue, setShippingValue, setSelectedProvince, setSelectedShippingProvince,
    setSelectedDistrict, setSelectedShippingDistrict, setSelectedWard, setSelectedShippingWard,
    setDistricts, setShippingDistricts, setWards, setShippingWards, formInitialized, shippingFormInitialized])

  // Fetch all provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinceData = await getProvinces()
        setProvinces(provinceData)
      } catch (error) {
        console.error("Error fetching provinces:", error)
      }
    }
    fetchProvinces()
  }, [])

  // Sync selected province with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!formInitialized || !watchProvince) return;

    if (watchProvince !== selectedProvince) {
      console.log("User changed province to:", watchProvince);
      setSelectedProvince(watchProvince);
    }
  }, [watchProvince, selectedProvince, formInitialized]);

  // Sync selected district with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!formInitialized || !watchDistrict) return;

    if (watchDistrict !== selectedDistrict) {
      console.log("User changed district to:", watchDistrict);
      setSelectedDistrict(watchDistrict);
    }
  }, [watchDistrict, selectedDistrict, formInitialized]);

  // Sync selected ward with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!formInitialized || !watchWard) return;

    if (watchWard !== selectedWard) {
      console.log("User changed ward to:", watchWard);
      setSelectedWard(watchWard);
    }
  }, [watchWard, selectedWard, formInitialized]);

  // Sync selected shipping province with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!shippingFormInitialized || !watchShippingProvince) return;

    if (watchShippingProvince !== selectedShippingProvince) {
      console.log("User changed shipping province to:", watchShippingProvince);
      setSelectedShippingProvince(watchShippingProvince);
    }
  }, [watchShippingProvince, selectedShippingProvince, shippingFormInitialized]);

  // Sync selected shipping district with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!shippingFormInitialized || !watchShippingDistrict) return;

    if (watchShippingDistrict !== selectedShippingDistrict) {
      console.log("User changed shipping district to:", watchShippingDistrict);
      setSelectedShippingDistrict(watchShippingDistrict);
    }
  }, [watchShippingDistrict, selectedShippingDistrict, shippingFormInitialized]);

  // Sync selected shipping ward with form value, but only if changed by user
  useEffect(() => {
    // Skip if the form is not yet initialized or value is empty
    if (!shippingFormInitialized || !watchShippingWard) return;

    if (watchShippingWard !== selectedShippingWard) {
      console.log("User changed shipping ward to:", watchShippingWard);
      setSelectedShippingWard(watchShippingWard);
    }
  }, [watchShippingWard, selectedShippingWard, shippingFormInitialized]);

  // Fetch districts when province changes (default address)
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const districtData = await getDistrictsByProvinceCode(selectedProvince)
          setDistricts(districtData)
          // Reset district and ward when province changes
          // Only reset if province was changed by user (not during initial load)
          if (formInitialized && watchProvince !== selectedProvince) {
            setAddressValue("district", "")
            setAddressValue("ward", "")
            setSelectedDistrict("")
            setSelectedWard("")
            setWards([])
          }
        } catch (error) {
          console.error("Error fetching districts:", error)
        }
      }
      fetchDistricts()
    }
  }, [selectedProvince, setAddressValue, watchProvince, formInitialized])

  // Fetch wards when district changes (default address)
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const wardData = await getWardsByDistrictCode(selectedDistrict)
          setWards(wardData)
          // Reset ward when district changes
          // Only reset if district was changed by user (not during initial load)
          if (formInitialized && watchDistrict !== selectedDistrict) {
            setAddressValue("ward", "")
            setSelectedWard("")
          }
        } catch (error) {
          console.error("Error fetching wards:", error)
        }
      }
      fetchWards()
    }
  }, [selectedDistrict, setAddressValue, watchDistrict, formInitialized])

  // Fetch districts when province changes (shipping address)
  useEffect(() => {
    if (selectedShippingProvince) {
      const fetchShippingDistricts = async () => {
        try {
          const districtData = await getDistrictsByProvinceCode(selectedShippingProvince)
          setShippingDistricts(districtData)
          // Reset district and ward when province changes
          // Only reset if province was changed by user (not during initial load)
          if (shippingFormInitialized && watchShippingProvince !== selectedShippingProvince) {
            setShippingValue("shipping_district", "")
            setShippingValue("shipping_ward", "")
            setSelectedShippingDistrict("")
            setSelectedShippingWard("")
            setShippingWards([])
          }
        } catch (error) {
          console.error("Error fetching shipping districts:", error)
        }
      }
      fetchShippingDistricts()
    }
  }, [selectedShippingProvince, setShippingValue, watchShippingProvince, shippingFormInitialized])

  // Fetch wards when district changes (shipping address)
  useEffect(() => {
    if (selectedShippingDistrict) {
      const fetchShippingWards = async () => {
        try {
          const wardData = await getWardsByDistrictCode(selectedShippingDistrict)
          setShippingWards(wardData)
          // Reset ward when district changes
          // Only reset if district was changed by user (not during initial load)
          if (shippingFormInitialized && watchShippingDistrict !== selectedShippingDistrict) {
            setShippingValue("shipping_ward", "")
            setSelectedShippingWard("")
          }
        } catch (error) {
          console.error("Error fetching shipping wards:", error)
        }
      }
      fetchShippingWards()
    }
  }, [selectedShippingDistrict, setShippingValue, watchShippingDistrict, shippingFormInitialized])

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      const fetchAddresses = async () => {
        try {
          const response = await getUserAddresses(userData.token)
          if (response.success) {
            const addressesData = response.data || []
            setAddresses(addressesData)

            // Ensure we have provinces before populating form values
            const provinceData = await getProvinces()
            setProvinces(provinceData)

            // Now populate form values with the available provinces
            // Since populateFormValues is now async, we need to await it
            await populateFormValues(addressesData)
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
  }, [router, populateFormValues])

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

    // Debug the form data being submitted
    console.log("Form data submitted:", data);
    console.log("Available provinces:", provinces);
    console.log("Available districts:", districts);
    console.log("Available wards:", wards);

    // Find the selected province, district and ward objects to get their names
    // Use both string and number comparisons to be safe
    const selectedProvinceObj = provinces.find(p =>
      p.code.toString() === data.province?.toString())
    const selectedDistrictObj = districts.find(d =>
      d.code.toString() === data.district?.toString())
    const selectedWardObj = wards.find(w =>
      w.code.toString() === data.ward?.toString())

    console.log("Selected province object:", selectedProvinceObj);
    console.log("Selected district object:", selectedDistrictObj);
    console.log("Selected ward object:", selectedWardObj);

    // Ensure we're getting the actual province/district/ward names
    const provinceName = selectedProvinceObj ? selectedProvinceObj.name :
      (typeof data.province === 'string' && isNaN(parseInt(data.province))) ?
        data.province : "";
    const districtName = selectedDistrictObj ? selectedDistrictObj.name :
      (typeof data.district === 'string' && isNaN(parseInt(data.district))) ?
        data.district : "";
    const wardName = selectedWardObj ? selectedWardObj.name :
      (typeof data.ward === 'string' && isNaN(parseInt(data.ward))) ?
        data.ward : "";

    // Validate that we have all required location data
    if (!provinceName || !districtName || !wardName) {
      showUserInfoNotification(
        "Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã",
        "danger"
      );
      return;
    }

    const addressData = {
      fullName: data.full_name,
      phoneNumber: data.phone_number,
      address: data.address,
      city: provinceName,
      district: districtName,
      ward: wardName,
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
  }, [provinces, districts, wards])

  const onShippingSubmit = useCallback(async (data) => {
    const userData = getUserFromLocalStorage()
    if (!userData) return // Nếu không có userData, không thực hiện gì

    // Debug the form data being submitted
    console.log("Shipping form data submitted:", data);
    console.log("Available provinces:", provinces);
    console.log("Available shipping districts:", shippingDistricts);
    console.log("Available shipping wards:", shippingWards);

    // Find the selected province, district and ward objects to get their names
    // Use both string and number comparisons to be safe
    const selectedProvinceObj = provinces.find(p =>
      p.code.toString() === data.shipping_province?.toString())
    const selectedDistrictObj = shippingDistricts.find(d =>
      d.code.toString() === data.shipping_district?.toString())
    const selectedWardObj = shippingWards.find(w =>
      w.code.toString() === data.shipping_ward?.toString())

    console.log("Selected shipping province object:", selectedProvinceObj);
    console.log("Selected shipping district object:", selectedDistrictObj);
    console.log("Selected shipping ward object:", selectedWardObj);

    // Ensure we're getting the actual province/district/ward names
    const provinceName = selectedProvinceObj ? selectedProvinceObj.name :
      (typeof data.shipping_province === 'string' && isNaN(parseInt(data.shipping_province))) ?
        data.shipping_province : "";
    const districtName = selectedDistrictObj ? selectedDistrictObj.name :
      (typeof data.shipping_district === 'string' && isNaN(parseInt(data.shipping_district))) ?
        data.shipping_district : "";
    const wardName = selectedWardObj ? selectedWardObj.name :
      (typeof data.shipping_ward === 'string' && isNaN(parseInt(data.shipping_ward))) ?
        data.shipping_ward : "";

    // Validate that we have all required location data
    if (!provinceName || !districtName || !wardName) {
      showShippingNotification(
        "Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã",
        "danger"
      );
      return;
    }

    const shippingData = {
      fullName: data.shipping_full_name,
      phoneNumber: data.shipping_phone_number,
      address: data.shipping_address,
      city: provinceName,
      district: districtName,
      ward: wardName,
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
  }, [provinces, shippingDistricts, shippingWards])

  if (loading) {
    return (
      <Container className="py-6 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  // Updated renderForm to handle different field types (text or select)
  const renderForm = (fields, register, errors) => (
    <Row>
      {/* Personal information fields */}
      {fields.filter(field => !field.isAddress).map((field, index) => (
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

      {/* Street address field on its own row */}
      {fields.filter(field => field.isAddress && field.type !== "select").map((field, index) => (
        <Col md={12} key={`address-${index}`} className="mb-4">
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

      <Col md={12} className="mb-2">
        <h6 className="text-muted">Địa chỉ hành chính</h6>
      </Col>

      {/* Address selection fields */}
      {fields.filter(field => field.isAddress && field.type === "select").map((field, index) => {
        // Define isDisabled inside the map function to avoid redeclarations
        const isFieldDisabled = (field.name === "district" || field.name === "shipping_district") ?
          !field.parentSelected :
          (field.name === "ward" || field.name === "shipping_ward") ?
            !field.parentSelected :
            false;

        return (
          <Col md={4} key={`select-${index}`} className="mb-4">
            <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
            <Form.Select
              id={field.name}
              {...register(field.name)}
              onChange={(e) => {
                const value = e.target.value;
                // Ensure both the form value and the state are updated
                if (field.onChange) {
                  field.onChange(value);
                }
                console.log(`Selected ${field.name}:`, value);
              }}
              disabled={isFieldDisabled}
              className={isFieldDisabled ? "bg-light" : ""}
            >
              <option value="">{isFieldDisabled ? `Vui lòng chọn ${field.parentLabel} trước` : field.placeholder}</option>
              {field.options.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
            {errors[field.name] && (
              <p className="text-danger">{errors[field.name].message}</p>
            )}
            {(field.name === "province" || field.name === "shipping_province") &&
              <small className="form-text text-muted">Chọn từ danh sách</small>}
          </Col>
        );
      })}
    </Row>
  );

  const addressFields = [
    {
      name: "full_name",
      label: "Họ và tên",
      placeholder: "Nguyễn Văn A",
      isAddress: false
    },
    {
      name: "phone_number",
      label: "Số điện thoại",
      placeholder: "0123456789",
      isAddress: false
    },
    {
      name: "address",
      label: "Số nhà, tên đường",
      placeholder: "123 Đường ABC",
      isAddress: true
    },
    {
      name: "province",
      label: "Tỉnh/Thành phố",
      placeholder: "Chọn Tỉnh/Thành phố",
      type: "select",
      options: provinces,
      onChange: (value) => setSelectedProvince(value),
      isAddress: true,
      parentSelected: true // Province is top level, always selectable
    },
    {
      name: "district",
      label: "Quận/Huyện",
      placeholder: "Chọn Quận/Huyện",
      type: "select",
      options: districts,
      onChange: (value) => setSelectedDistrict(value),
      isAddress: true,
      parentSelected: !!selectedProvince,
      parentLabel: "Tỉnh/Thành phố"
    },
    {
      name: "ward",
      label: "Phường/Xã",
      placeholder: "Chọn Phường/Xã",
      type: "select",
      options: wards,
      onChange: (value) => setSelectedWard(value),
      isAddress: true,
      parentSelected: !!selectedDistrict,
      parentLabel: "Quận/Huyện"
    },
  ];

  const shippingFields = [
    {
      name: "shipping_full_name",
      label: "Họ và tên",
      placeholder: "Nguyễn Văn B",
      isAddress: false
    },
    {
      name: "shipping_phone_number",
      label: "Số điện thoại",
      placeholder: "0987654321",
      isAddress: false
    },
    {
      name: "shipping_address",
      label: "Số nhà, tên đường",
      placeholder: "456 Đường XYZ",
      isAddress: true
    },
    {
      name: "shipping_province",
      label: "Tỉnh/Thành phố",
      placeholder: "Chọn Tỉnh/Thành phố",
      type: "select",
      options: provinces,
      onChange: (value) => setSelectedShippingProvince(value),
      isAddress: true,
      parentSelected: true // Province is top level, always selectable
    },
    {
      name: "shipping_district",
      label: "Quận/Huyện",
      placeholder: "Chọn Quận/Huyện",
      type: "select",
      options: shippingDistricts,
      onChange: (value) => setSelectedShippingDistrict(value),
      isAddress: true,
      parentSelected: !!selectedShippingProvince,
      parentLabel: "Tỉnh/Thành phố"
    },
    {
      name: "shipping_ward",
      label: "Phường/Xã",
      placeholder: "Chọn Phường/Xã",
      type: "select",
      options: shippingWards,
      onChange: (value) => setSelectedShippingWard(value),
      isAddress: true,
      parentSelected: !!selectedShippingDistrict,
      parentLabel: "Quận/Huyện"
    },
  ];

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
              <div className="card border-0 shadow mb-5">
                <div className="card-header bg-gray-100 py-4 border-0">
                  <h3 className="mb-0 h5">Địa chỉ mặc định</h3>
                </div>
                <div className="card-body p-4">
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
                    <Button variant="primary" type="submit" className="mt-3">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Lưu địa chỉ mặc định
                    </Button>
                  </Form>
                </div>
              </div>

              <div className="card border-0 shadow">
                <div className="card-header bg-gray-100 py-4 border-0">
                  <h3 className="mb-0 h5">Địa chỉ giao hàng khác</h3>
                </div>
                <div className="card-body p-4">
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
                    <Button variant="primary" type="submit" className="mt-3">
                      <FontAwesomeIcon icon={faSave} className="me-2" />
                      Lưu địa chỉ giao hàng
                    </Button>
                  </Form>
                </div>
              </div>
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
