import React, { useState, useEffect } from "react"
import Link from "next/link"

import { Container, Row, Col, Card } from "react-bootstrap"

import NewArrivals from "../components/NewArrivals"
import Swiper from "../components/Swiper"
import { Swiper as SwiperCore, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper"

import products from "../data/products-clothes.json"

import Sale from "../components/Sale"
import OurHistory from "../components/OurHistory"
import Image from "../components/Image"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

export async function getStaticProps() {
  return {
    props: {
      header: {
        absolute: true,
        transparentBar: true,
        transparentNavbar: true,
      },
      title: "Trang chủ",
    },
  }
}

const Index = () => {
  const [banners, setBanners] = useState({
    sliders: [],
    leftCategory: null,
    rightCategory: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("http://localhost:8080/banners")
        const result = await response.json()

        if (result.success) {
          // Lọc các banner theo type
          const sliders = result.data.filter(banner => banner.type === "slider" && banner.active)
          const leftCategory = result.data.find(banner => banner.type === "left" && banner.active)
          const rightCategory = result.data.find(banner => banner.type === "right" && banner.active)

          setBanners({
            sliders,
            leftCategory,
            rightCategory
          })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching banners:", error)
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Cấu hình cho slider ảnh đơn giản
  const swiperParams = {
    modules: [Navigation, Pagination, Autoplay, EffectFade],
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    navigation: true,
    className: "home-slider",
    style: { height: "auto" }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      {/* carousel (trượt ngang) - từ API */}
      {banners.sliders.length > 0 && (
        <div className="slider-container" style={{
          position: "relative",
          backgroundColor: "#f8f9fa",
          overflow: "hidden"
        }}>
          <SwiperCore {...swiperParams}>
            {banners.sliders.map((slider, index) => (
              <SwiperSlide key={index}>
                <Link href={slider.link}>
                  <a style={{
                    cursor: "pointer",
                    display: "block",
                    textAlign: "center"
                  }}>
                    <img
                      src={slider.img}
                      alt={slider.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "90vh",
                        margin: "0 auto",
                        display: "block"
                      }}
                    />
                  </a>
                </Link>
              </SwiperSlide>
            ))}
          </SwiperCore>
          <style jsx global>{`
            .home-slider .swiper-button-next,
            .home-slider .swiper-button-prev {
              color: rgba(0, 0, 0, 0.7);
              background: rgba(255, 255, 255, 0.5);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              box-shadow: 0 2px 5px rgba(0,0,0,0.15);
              transition: all 0.3s;
            }
            
            .home-slider .swiper-button-next:hover,
            .home-slider .swiper-button-prev:hover {
              color: #000;
              background: rgba(255, 255, 255, 0.8);
            }
            
            .home-slider .swiper-button-next:after,
            .home-slider .swiper-button-prev:after {
              font-size: 18px;
            }
            
            .home-slider .swiper-pagination-bullet {
              background: rgba(0, 0, 0, 0.6);
            }
            
            .home-slider .swiper-pagination-bullet-active {
              background: #000;
            }
          `}</style>
        </div>
      )}
      {/* End carousel  */}
      {/* TRANG PHỤC VÀ PHỤ KIỆN từ API */}
      {banners.leftCategory && banners.rightCategory && (
        <div className="bg-gray-100 position-relative">
          <Container className="py-6">
            <Row>
              <Col sm="6" className="mb-5 mb-sm-0">
                <Card className="card-scale shadow-0 border-0 text-white text-hover-gray-900 overlay-hover-light text-center">
                  <div>
                    <img
                      className="img-scale card-img"
                      src={banners.leftCategory.img}
                      alt={banners.leftCategory.name}
                    />
                  </div>
                  <Card.ImgOverlay className="d-flex align-items-center">
                    <div className="w-100 py-3">
                      <h2 className="display-3 fw-bold mb-0">
                        {banners.leftCategory.name}
                      </h2>
                      <Link href={banners.leftCategory.link}>
                        <a className="stretched-link">
                          <span className="sr-only">MUA NGAY</span>
                        </a>
                      </Link>
                    </div>
                  </Card.ImgOverlay>
                </Card>
              </Col>
              <Col sm="6" className="mb-5 mb-sm-0">
                <Card className="card-scale shadow-0 border-0 text-white text-hover-gray-900 overlay-hover-light text-center">
                  <div>
                    <img
                      className="img-scale card-img"
                      src={banners.rightCategory.img}
                      alt={banners.rightCategory.name}
                    />
                  </div>
                  <Card.ImgOverlay className="d-flex align-items-center">
                    <div className="w-100 py-3">
                      <h2 className="display-3 fw-bold mb-0">
                        {banners.rightCategory.name}
                      </h2>
                      <Link href={banners.rightCategory.link}>
                        <a className="stretched-link">
                          <span className="sr-only">MUA NGAY</span>
                        </a>
                      </Link>
                    </div>
                  </Card.ImgOverlay>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
      {/* END TRANG PHỤC VÀ PHỤ KIỆN */}
      {/* Mới về  */}
      {/* <NewArrivals fluid headCenter products={products} /> */}
      {/* Sale */}
      <Sale className="py-6" backgroundImage="/img/photo/deal.webp" />
      {/* Our history */}
      <OurHistory />
      {/* Brands */}
      {/* <Brands className="pb-6" /> */}
    </React.Fragment>
  )
}

export default Index
