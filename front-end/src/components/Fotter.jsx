const Footer = () => {
    return ( <>
    <div className="">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
            <div className="" data-aos="zoom-out" data-aos-easing="ease-in-out-back" data-aos-duration="1000">
                <h1 className="font-joseph mb-5 w-32 text-4xl font-bold">Rattle</h1>
                <p className="capitalize w-full md:w-2/3 text-gray-600">
                    Your ultimate fashion destination: explore the latest trends, styles, and must-haves
                </p>
            </div>
            <div className="" data-aos="fade-down" data-aos-delay="100">
                <p className="text-xl font-medium mb-5">Company</p>
                <ul className="flex flex-col gap-1">
                    <li className="text-gray-600">About Us</li>
                    <li className="text-gray-600">Contact Us</li>
                    <li className="text-gray-600">Home</li>
                    <li className="text-gray-600">Privacy Policy</li>
                </ul>
            </div>
            <div className="" data-aos="fade-down" data-aos-delay="200">
                <p className="text-xl font-medium mb-5">Get In Touch</p>
                <ul className="flex flex-col gap-1">
                    <li className="text-gray-600">+234-811-657-0523</li>
                    <li className="text-gray-600">idowujo042@gmail.com</li>
                </ul>
            </div>
        </div>
        <div className="text-center text-gray-600 text-xs border-t border-gray-300 py-5">
            <p>&copy; 2025 Rattle. All rights reserved.</p>
</div>
    </div>
    </> );
}
 
export default Footer;