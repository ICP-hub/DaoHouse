import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Pagination = ({ totalItems, currentPage, setCurrentPage , costomClass}) => {
    const handleNextPage = () => {
            if (currentPage < totalItems) {
              setCurrentPage(prevPage => prevPage + 1);
            }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className={`${costomClass}`}>
            <div className="flex items-center gap-12 justify-center mt-5">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`text-black hover:text-gray-500 ml-1 text-xl flex items-center ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <FaArrowLeft /> Prev
                </button>

                <button onClick={handleNextPage}
                    disabled={currentPage >= totalItems || totalItems === 0}
                    className={`text-black hover:text-gray-500 text-xl flex items-center ${(currentPage >= totalItems || totalItems === 0) ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}>
                    Next <FaArrowRight />
                </button>
            </div>

            <div className="flex justify-center mb-5 text-xl">
              {currentPage} of {totalItems}
            </div>
        </div>
    );
};

export default Pagination;
