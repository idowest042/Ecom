import { assets } from "../assets/assets";
import Title from "../components/Title"
import NewsletterBox from "../components/NewsletterBox"
const Contact = () => {
    return ( <>
    <div className="">
        <div className="text-center text-2xl pt-10 border-t">
            <Title text1={"Contact"} text2={"Us"}/>
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
            <img src={assets.contact} alt="contact info" className="w-full md:max-w-[480px]" data-aos="zoom-in" data-aos-delay="100"/>
            <div className="flex flex-col justify-center items-start gap-6" data-aos="fade-down" data-aos-delay="100">
                <p className="font-semibold text-xl text-gray-600" data-aos="fade-down">Our Store</p>
                <p className="text-gray-500">Coal city <br/>Enugu state, Nigeria</p>
                <p className="text-gray-500">Tel: +234-811-657-0523 <br/>Email: idowujo042@gmail.com</p>
                <p className="font-semibold text-xl text-gray-600">Careers at <span className="font-joseph">Rattle</span></p>
                <p className="text-gray-500">Learn more about our teams and job openings.</p>
                <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
            </div>

        </div>
        <NewsletterBox/>
    </div>
    </> );
}
 
export default Contact;