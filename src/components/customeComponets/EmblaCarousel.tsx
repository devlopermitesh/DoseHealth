import React, { useCallback } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import "./embla.css"
type PropType = {
  slides: string[] // Array of image URLs instead of numbers
  options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop

    resetOrStop()
  }, [])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  )

  return (
    <section className="embla" >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((imageUrl, index) => (
            <div className="embla__slide" key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={`Slide ${index}`}
                  fill // Replace layout="fill" with fill
                  className="object-cover"
                   sizes="100vw"
                  priority // Optional: adds priority loading for first image
                />
              </div>
            </div>
          ))}
        </div>
      </div>

     
    </section>
  )
}

export default EmblaCarousel
