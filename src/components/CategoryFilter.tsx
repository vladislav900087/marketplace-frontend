import { useEffect, useState } from 'react';
import api from '../api/axios';


interface Category {

    id: number;
    title: string;

    }


interface CategoryFilterProps {
    selectedCategoryId: number | null;
    onCategoryChange: (id: number | null) => void;

    }


// main component

export default function CategoryFilter({ selectedCategoryId, onCategoryChange}: CategoryFilterProps) {

    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {

        try {
            // getting categories

            const response = await api.get<any>('/categories/');
            const extractedData = response.data?.items || response.data; // extracted categories
            setCategories(Array.isArray(extractedData) ? extractedData : []); // saves to memory only if data is a valid list
            } catch (err) {
                console.error('Failed to load filter category matrix data', err); // outputs debugging data to the developer console
                setCategories([]); // saves to memory an empty list to safeguard rendering steps if an error occurred

                }


        }; // ends the async fetchCategories function declaration


    useEffect(() => {
        // launches immediately after the page got loaded
        fetchCategories();

        }, []); // ensures the function gets executed only once on mount


    return ( // returns jsx html markup nodes

        <div className='filter-container'> {/*  a container rendering all the elements horizontally */}
            <button className={`filter-chip ${selectedCategoryId === null ? 'active' : ''}`} onClick={() => onCategoryChange(null)}> {/* the 'All products' reset button */}
                All products
            </button>

            {
                categories.map((category) => (
                    <button key={category.id} className={`filter-chip ${selectedCategoryId === category.id ? 'active' : ''}`} onClick={() => onCategoryChange(category.id)}>
                        {category.title}
                    </button>

                    ))

                }




        </div>


        );



    }