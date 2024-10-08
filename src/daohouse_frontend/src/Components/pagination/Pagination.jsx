import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

// Correctly named Pagination component
const Pagination = ({ currentPage, setCurrentPage, hasMore }) => {
    const handleNext = () => {
      if (hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };
  
    const handlePrevious = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };
  
    return (
      <div className="pagination-container flex justify-center gap-10 items-center pb-10">
        <button
          className={`text-xl flex items-center ml-1 ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:text-gray-500 cursor-pointer"
          }`}
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FaArrowLeft /> Prev
        </button>
        <span className="text-xl">Page {currentPage}</span> {/* Optional: Display current page */}
        <button
          className={`text-xl flex items-center px-3 py-1 transition duration-300 ease-in-out ${
            !hasMore
              ? "text-gray-400 cursor-not-allowed"
              : "text-black hover:text-gray-500 cursor-pointer"
          }`}
          onClick={handleNext}
          disabled={!hasMore}
        >
          Next <FaArrowRight />
        </button>
      </div>
    );
  };


export default Pagination;
