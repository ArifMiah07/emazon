import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {


    const [products, setProducts] = useState([]);
    // const [cart, setCart] = useState([]);
    const cart = useLoaderData();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(10);
    // const {count} = useLoaderData();
    const [count, setCount] = useState(0);


    // const itemPerPage = 10;
    const numberOfPages = Math.ceil(count/itemPerPage);
    const pages = [...Array(numberOfPages).keys()];
    console.log(numberOfPages,count);

    // console.log();

    
    

    // const pages = [];
    // for(let i = 0; i < numberOfPages ; i++){
        //     pages.push(i);
        // }
    // console.log(pages);
    /**
     * todo 1: get the total number of products
     * todo 2: number of items per page dynamic
     * todo 3: get th current page
     */

    useEffect( ()=>{
        fetch('http://localhost:5000/productsCount')
        .then(res => res.json())
        .then(data =>{
            setCount(data.count)
        })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${currentPage}&size=${itemPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }
    
    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }
    
    
    const handleItemsPerPage = (e) =>{
        const val = parseInt(e.target.value);
        setItemPerPage(val);
        setCurrentPage(0)
        console.log(val);
    }
    const handlePreviousPage = ()=>{
        if(currentPage > 0 ){
            setCurrentPage(currentPage - 1);
        }
    }
    const handleNextPage =()=>{
        if(currentPage < pages.length -1){
            setCurrentPage(currentPage + 1)
        }
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div  className='pagination'>
                <p>cp:{currentPage}</p>
                <button
                onClick={handlePreviousPage}
                >Previous</button>
                
                {
                    pages.map(page => <button 
                        onClick={()=> setCurrentPage(page)}
                        key={page}
                        className={currentPage === page ? 'selected' : ''}
                        >{page}</button>)
                }
                <button
                onClick={handleNextPage}
                >Next</button>
                <select value={itemPerPage} onChange={handleItemsPerPage}
                 name="" id="">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Shop;