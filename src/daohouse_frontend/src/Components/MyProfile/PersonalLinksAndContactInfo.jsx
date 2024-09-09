import React from "react";
import PropTypes from "prop-types";
import { FaPhone, FaEnvelope, FaTwitter, FaTelegram, FaGlobe } from "react-icons/fa";

const iconMapping = {
  "phone-icon": <FaPhone className="h-8 w-8 md:mr-12 mr-7 text-blue-300" />,
  "email-icon": <FaEnvelope className="h-8 w-8 md:mr-12 mr-7 text-blue-300" />,
  "X-icon": <FaTwitter className="h-8 w-8 md:mr-12 mr-7 text-blue-300" />,
  "telegram-icon": <FaTelegram className="h-8 w-8 md:mr-12 mr-7 text-blue-300" />,
  "web-icon": <FaGlobe className="h-8 w-8 md:mr-12 mr-7 text-blue-300" />,
};

const PersonalLinksAndContactInfo = ({ links }) => {
  const className = "PersonalLinksAndContactInfo";

  return (
    <div
      className={
        className +
        " bg-[#FFFFFF] lg:text-[16px] md:text-[14px] text-[12px] font-normal text-[#646464] p-2 my-2 rounded-lg"
      }
    >   
      <ul className="list-disc pl-4">
        {links.map((link, index) => (
          <li key={index} className="flex items-center my-4">
            {iconMapping[link.icon]}
            {link.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

PersonalLinksAndContactInfo.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PersonalLinksAndContactInfo;
