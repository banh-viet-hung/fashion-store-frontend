import React, { useState } from "react"
import { Form, InputGroup, Button } from "react-bootstrap"
import { useRouter } from "next/router" // Import useRouter
import Icon from "../Icon"

export default function SearchBlock() {
  const [searchTerm, setSearchTerm] = useState("") // Trạng thái cho từ khóa tìm kiếm
  const router = useRouter() // Khởi tạo router

  const handleSearch = (event) => {
    event.preventDefault() // Ngăn chặn hành vi mặc định của form
    if (searchTerm) {
      // Cập nhật URL mà không tải lại trang
      router.push(`/spotlight?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <Form
      className="d-lg-flex ms-auto me-lg-5 me-xl-6 my-4 my-lg-0"
      onSubmit={handleSearch}
    >
      <InputGroup className="input-group-underlined">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm"
          aria-label="Search"
          className="form-control-underlined ps-3"
          value={searchTerm} // Gán giá trị cho input
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật trạng thái khi người dùng nhập
        />
        <Button
          variant="underlined"
          className="ms-0"
          aria-label="search button"
          type="submit" // Đặt type là submit
        >
          <Icon className="navbar-icon" icon="search-1" />
        </Button>
      </InputGroup>
    </Form>
  )
}
