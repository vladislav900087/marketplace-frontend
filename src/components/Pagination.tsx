

interface PaginationProps {

    currentPage: number; // the current page the user is looking at
    totalPages: number; // the maximum pages calculated by the backend api
    onPageChange: (page: number) => void; // callback function to inform the parent page


    }


export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

    // if there's only one page, don't render navigation bar at all

    if (totalPages <= 1) return null;


    return (

        <div className='pagination-container'>
        {/* previous page button */}
        <button
            className='pagination-btn'
            disabled={currentPage === 1} // disable if the user is on the first page
            onClick={() => onPageChange(currentPage - 1)} // reverts to the previous page

        >
        Prev

        </button>

        {/* generate an array of the total number of the pages and loop over it to render numbers onto the screen */}

        { Array.from({ length: totalPages }, (_, index) => {

            const pageNumber = index + 1;
            return (
                <button key={pageNumber}
                // highlights the button blue if it matches the current page state
                className={`pagination-btn ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => onPageChange(pageNumber)}

                >
                {pageNumber}
                </button>


                );

            })}

        {/* next page button */}
        <button
            className='pagination-btn'
            disabled={currentPage === totalPages} // disable if the user is on the final page
            onClick={() => onPageChange(currentPage + 1)}

        >
        Next

        </button>

        </div>


        );



    }