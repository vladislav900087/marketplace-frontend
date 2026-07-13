import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Product } from '../types/product';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';

export default function MarketplacePage() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]); // a memory cell for products gotten from the backend api
    const [loading, setLoading] = useState(true); // a boolean flag to show the loading text
    const [error, setError] = useState(''); // a memory cell to store and show the error text

    const [searchQuery, setSearchQuery] = useState(''); // a memory cell storing user's search queries
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // id integers tracking selected category keys

    // pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    // core engine fetching products using user's search queries and selected categories
    const loadMarketplaceContent = async (text: string, categoryId: number | null, pageNumber: number) => {
        try {
            setLoading(true);
            setError(''); // wipes all the previous error messages out

            const params = new URLSearchParams(); // a class for building url routes
            if (text) params.append('search', text); // adds the url parameter 'Search'
            if (categoryId !== null) params.append('category_id', categoryId.toString()); // adds category_id to the url route

            params.append('page', pageNumber.toString());
            params.append('limit', '20'); // static display clamp matching backend default limit specifications

            const queryString = params.toString(); // converts the params array to string
            const url = queryString ? `marketplace/products/public?${queryString}` : 'marketplace/products/public';

            const response = await api.get<any>(url);
            const payload = response.data?.items ? response.data : response;
            const extractedProducts = payload.items || payload;
            setProducts(Array.isArray(extractedProducts) ? extractedProducts : []);

            // syncs pagination data out of the search api response data
            setTotalPages(payload.pages || 0);
        } catch (err: any) {
            setError('Failed to load marketplace catalog. Try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMarketplaceContent('', null, 1);
    }, []);

    const handleSearchInput = (text: string) => {
        setSearchQuery(text);
        setCurrentPage(1);

        loadMarketplaceContent(text, selectedCategoryId, 1);
    };

    const handleCategorySelect = (id: number | null) => {
        setSelectedCategoryId(id);
        setCurrentPage(1);

        loadMarketplaceContent(searchQuery, id, 1);
    };

    // changing page function
    const handlePageChange = (newPageTarget: number) => {
        setCurrentPage(newPageTarget);

        loadMarketplaceContent(searchQuery, selectedCategoryId, newPageTarget);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // smooth scroll back up to grid top
    };

    const handleAddToCart = async (productId: number) => {
        try {
            await api.post('/cart/add', { 'product_id': productId, 'quantity': 1 });
            alert('Product successfully added to your shopping list');
        } catch (err: any) {
            alert("You can't add your own product to your cart.");
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-heading">Explore Marketplace</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for items, brands, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    className="search-input"
                />
            </div>

            <CategoryFilter
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategorySelect}
            />

            {error && <div className="center-status-text" style={{ color: '#dc2626' }}>{error}</div>}

            {loading && products.length === 0 ? (
                <div className="center-status-text">Updating catalog items...</div>
            ) : !loading && products.length === 0 ? (
                <div className="empty-state-wrapper">
                    <h3 className="empty-state-title">No matching products found</h3>
                    <p className="empty-state-subtext">We couldn't find anything matching "{searchQuery}". Try a different combination!</p>
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {products.map((product) => {
                            const currencySymbols: Record<string, string> = { dollar: '$', rouble: '₽', tenge: '₸' };
                            const symbol = currencySymbols[product.currency] || '$';

                            return (
                                <div className="product-card" key={product.id}>
                                    <div className="card-content">
                                        <h3 className="product-card-title">{product.title}</h3>
                                        <p className="product-card-price">{symbol}{product.price.toFixed(2)}</p>
                                    </div>

                                    <div className="button-group">
                                        <button
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="view-details-btn"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="add-to-cart-btn"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
}