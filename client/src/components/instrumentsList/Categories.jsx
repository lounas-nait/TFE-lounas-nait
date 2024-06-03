import React, { useState } from "react";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

const categories = [
  {
    id: '1',
    name: 'Guitares acoustique',
    image: 'https://1.bp.blogspot.com/-L4gywLA1UCc/YPzyOJDr2mI/AAAAAAAAEU0/FqmIrvHlA2YzhafGnmgBSmFd18rfvgZaQCLcBGAsYHQ/s858/akustik.jpg',
  },
  {
    id: '2',
    name: 'Guitares Electriques',
    image: 'https://cdn.shopify.com/s/files/1/2319/0503/products/5-fender-stained-strat-97655-bodyvert_1024x1024.jpg?v=1581754221',
  },
  {
    id: '3',
    name: 'Pianos numeriques',
    image: 'https://musicopolix.com/blog/wp-content/uploads/2022/06/como-saber-si-un-teclado-es-bueno-bonito-768x512.jpg',
  },
  {
    id: '4',
    name: 'Batteries',
    image: 'https://images.pexels.com/photos/7715647/pexels-photo-7715647.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
  },
  {
    id: '5',
    name: 'Instruments à vent',
    image: 'https://www.jardinsdefrance.org/wp-content/uploads/2020/12/DL_collection_personnelle_flutes_s_rie_2-min-211x300.png',
  },
];

function Categories({ setSelectedCategory }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedCategory, setSelectedCategoryState] = useState('');

  const handleMouseEnter = (categoryId) => {
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('');
      setSelectedCategoryState('');
    } else {
      setSelectedCategory(categoryId);
      setSelectedCategoryState(categoryId);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-center w-full h-full py-24 sm:py-8 px-4">
        <CarouselProvider
          className="lg:block hidden"
          naturalSlideWidth={100}
          isIntrinsicHeight={true}
          totalSlides={categories.length}
          visibleSlides={4}
          step={1}
          infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className="absolute z-30 left-0 ml-8 cursor-pointer"
              id="prev"
            >
              <svg width={16} height={40} viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1L1 7L7 13" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonBack>

            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700"
                >
                  {categories.map((categorie, index) => (
                    <Slide index={index} key={index}>
                      <div
                        className={`flex flex-shrink-0 relative w-full sm:w-auto h-[500px] cursor-pointer transform transition-transform duration-300 ${
                          selectedCategory === categorie.id || hoveredCategory === categorie.id ? 'scale-105' : ''
                        }`}
                        onClick={() => handleClick(categorie.id)}
                        onMouseEnter={() => handleMouseEnter(categorie.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <img
                          src={categorie.image}
                          alt={categorie.name}
                          className="object-cover object-center w-full h-full"
                        />
                        <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                          <div className="flex h-full items-end pb-6">
                            <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                              {categorie.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Slide>
                  ))}
                </div>
              </Slider>
            </div>

            <ButtonNext
              role="button"
              aria-label="slide forward"
              className="absolute z-30 right-0 mr-8 cursor-pointer"
              id="next"
            >
              <svg width={16} height={40} viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>
      </div>
    </div>
  );
}

export default Categories;
