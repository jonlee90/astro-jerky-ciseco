import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectCoverflow, Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

export default function ProductSwiper({
  items,
  className = 'max-w-6xl',
  renderSlide,
  onSlideChange,
  onSwiper,
  spaceBetween = 0,
  loop = false,
  initialSlide = 0,
  slidesPerView = 3,
  coverflowEffect ={
    rotate: 0,
    modifier: 5,
    slideShadows: false,
  },
  breakpoints = {
    640: {slidesPerView: 2},
    1024: {slidesPerView: 4},
  },
  ...swiperProps
}) {
  return (
    <Swiper
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      loop={loop}
      spaceBetween={spaceBetween}
      initialSlide={initialSlide}
      slidesPerView={slidesPerView}
      breakpoints={breakpoints}
      coverflowEffect={coverflowEffect}
      onSlideChange={onSlideChange}
      onSwiper={onSwiper}
      modules={[EffectCoverflow, Navigation]}
      className={`mySwiper ${className}`}
      {...swiperProps}
    >
      {items.map((item, i) => (
        <SwiperSlide key={item.id || i}>
          {renderSlide(item, i)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}