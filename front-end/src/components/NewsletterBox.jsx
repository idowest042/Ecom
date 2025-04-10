const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
     event.preventDefault();
    }
    return ( <>
    <div className="text-center">
        <p className="text-2xl font-medium text-gray-800" data-aos="fade-down">Subscribe now & get 20% off</p>
        <p className="text-gray-400 mt-3 capitalize" data-aos="fade-down" data-aos-delay="100">Stay in style: get exclusive updates, promotions,
            and fashion tips delivered straight to your inbox
        </p>
        <form action=""  onSubmit={onSubmitHandler}className="w-full sm:w-1/2 items-center gap-3 mx-auto my-6 border pl-3 flex" data-aos="fade-down" data-aos-delay="200">
            <input type="email" placeholder="Enter your email" className=" w-full sm:flex-1" required />
            <button className="bg-black text-white text-xs px-10 py-4" type="submit">Subscribe</button>
        </form>
    </div>
    </> );
}
 
export default NewsletterBox;