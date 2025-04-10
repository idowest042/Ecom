import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox"

const About = () => {
    return ( <>
   <div className="">
    <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"About"} text2={"Us"}/>
    </div>
    <div className="my-10 flex flex-col md:flex-row gap-16">
        <img src={assets.img8} alt="" className="w-full md:max-w-[450px]" data-aos="zoom-out" data-aos-delay="100" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600" data-aos="fade-down" data-aos-delay="200">
        <p className=""><span className="font-joseph font-bold">Rattle</span> was born out of a passion for innovation and desire to revolutionize the way people shop online. our journey began with a simple idea: to provide a platform where customers caneasily discover,explore, and purchase a wide range of products from the comfort of their homes</p>
        <p className="">At <span className="font-joseph font-bold">Rattle,</span> we belive that fashion should be fun, comfortable,
        and accessible for creating clothing that's free from traditional gender norms, allowing individuals to express themselves freely</p>
        <b className="text-gray-800">Our Mission</b>
        <p className="">Our mission at <span className="font-joseph font-bold"> Rattle</span> mission is to provide high-quality, affordable unisex clothing and adorable
        kid's wear that's perfect for everyday life. We're dedicated to building a community that values self-expression, inclusivity,and comfort</p>
        </div>
    </div>
    <div className="text-xl py-4">
        <Title text1={"Why"} text2={"Choose Us"}/>
    </div>
    <div className="flex flex-col md:flex-row text-sm mb-20" >
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5" data-aos="slide-left" >
            <b className="">Quality Assurance</b>
            <p className="text-gray-600 ">At <span className="font-joseph font-bold">Rattle</span>,we're committed to delivering top-notch products
            that exceed your expectations. Our quality Assurance process ensures that every item meets our high standards</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5" data-aos="slide-left" data-aos-delay="100">
            <b className="">Convience</b>
            <p className="text-gray-600 ">Shopping with <span className="font-joseph font-bold">Rattle</span> is easy and hassle-free. offering 
            a range of payment method, fast shipping,easy return policy and 24/7 customer support</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5" data-aos="slide-left" data-aos-delay="200">
            <b className="">Exceptional customer service</b>
            <p className="text-gray-600 ">At <span className="font-joseph font-bold">Rattle,</span> we're dedicated to providing you with an unparalled
            shopping eperience</p>
        </div>
    </div>
    <NewsletterBox/>
   </div>
    </> );
}
 
export default About;