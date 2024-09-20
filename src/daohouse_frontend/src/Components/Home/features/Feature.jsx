import React, { useState } from 'react';
import feature1 from "../../../../assets/feature.png";
import Container from '../../Container/Container';

const Feature = () => {
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

  const cardData = [
    {
      title: "DAO Management",
      subtitle: "Our platform makes it easy to create and run DAOs. We provide clear ways for people to suggest ideas, vote on them, and make decisions together.",
      imageSrc: feature1
    },
    {
      title: "Content Management",
      subtitle: "Our platform handles everything you post and share, like on social media. It stores and shows your content, comments, and likes.",
      imageSrc: feature1
    },
    {
      title: "Token Management",
      subtitle: "Our platform manages special tokens to reward users for getting involved and active. These tokens are like digital rewards you earn for participating.",
      imageSrc: feature1
    }
  ];

  // Calculate the position of the thicker line
  const getLinePosition = () => {
    if (hoveredCardIndex === null) return '-100px'; // Hide off-screen to the left
    
    // Calculate the position of the line based on the hovered card
    const cardWidthPercentage = 100 / cardData.length;
    return `calc(${hoveredCardIndex * cardWidthPercentage + cardWidthPercentage / 2}% - 25px)`;
  };

  return (
    <>
      {/* Mobile View */}
      <div className='block lg:hidden bg-[#F5F5F5] py-16 translate-y-0 translate-y-[50px]'>
        <Container className='w-full'>
          <div className="text-center px-4">
            <h2 className="text-about-heading font-mulish text-[#0E3746] font-bold text-[10px] leading-tight mb-2">
              OUR FEATURES
            </h2>

            <p className="text-about-subheading font-mulish text-[#0E3746] font-bold text-[20px] leading-tight mb-4">
              Engaging Management Suite
            </p>
          </div>

          {/* Card grid with hover effect */}
          <div className="flex flex-col items-center gap-2 px-4 mt-10">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="relative bg-[#0E3746] text-white p-4 rounded-lg shadow-lg w-full sm:w-[300px] mb-6"
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              >
                {/* Icon and content */}
                <div className="flex flex-col items-start mb-[8px]">
                  <img 
                    src={card.imageSrc} 
                    alt={card.title} 
                    className="w-[24px] h-[24px] mb-[8px]"
                  />
                  <h3 className="text-[10px] font-mulish font-semibold text-left">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[11px] font-mulish mb-[8px] text-left">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Desktop View */}
      <div className='hidden lg:block bg-[#F5F5F5] py-6 '>
        <Container className='w-full'>
          <div className="flex flex-col items-center">
            <h2 className="text-about-heading font-mulish text-[#0E3746] font-bold text-[18px] lg:text-[24px] leading-tight mb-3">
              OUR FEATURES
            </h2>

            <p className="text-about-subheading font-mulish text-[#0E3746] font-bold text-[24px] lg:text-[32px] leading-tight mb-6">
              Engaging Management Suite
            </p>
          </div>

          {/* Horizontal line with a thicker rectangular center */}
          <div className="relative w-full flex justify-center mb-10">
            <hr className="border-t-2 border-[#0E3746] w-[82%] relative mb-4" />
            <div
              className="absolute h-[5px] w-[50px] bg-[#0E3746] rounded-full transition-all duration-500 ease-in-out"
              style={{
                left: getLinePosition(),
                top: '-1px',
                opacity: hoveredCardIndex === null ? 0 : 1,
                transform: hoveredCardIndex === null ? 'translateX(-100px)' : 'translateX(0)',
              }}
            />
          </div>

          {/* Card grid with hover effect */}
          <div className="flex flex-wrap justify-center gap-6 px-4 mt-10">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="relative bg-[#0E3746] text-white p-6 rounded-lg shadow-lg w-full sm:w-[300px] md:w-[300px] lg:w-[366px] lg:h-[252px] mb-6 hover:-translate-y-4"
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              >
                {/* Icon and content */}
                <div className="flex flex-col items-start mb-4">
                  <img src={card.imageSrc} alt={card.title} className="w-10 h-10 mb-4" />
                  <h3 className="text-lg font-mulish font-semibold text-left">
                    {card.title}
                  </h3>
                </div>
                <p className="text-base font-mulish mb-4 text-left">
                  {card.subtitle}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Feature;
