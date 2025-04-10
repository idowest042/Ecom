import image from '../assets/studio.jpg'
const Hero = () => {
    return ( <>
    <div className="flex flex-col sm:flex-row border border-gray-400 z-10 ">
        <div className="w-full sm:1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#414141]">
            <div className="flex items-center gap-2">
                <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
                <p className="font-medium text-sm md:text-base font-cute" data-aos="fade-left">OUR BEST SELLER</p>
            </div>
            <h1 className="text-3xl sm:py-3 lg:text-5xl leading-relaxed" data-aos="fade-left" data-aos-delay="200">Latest Arrivials</h1>
            <div className="flex items-center gap-2">
                <p className="font-bold text-sm md:text-base font-serif" data-aos="fade-left" data-aos-delay="300">Shop now</p>
                <p className="w-8 md:w-11 h-[1px] bg-[#414141]"></p>
            </div>
        </div>
        </div>
        <img src={image} alt="image" className='w-full sm:1/2 h-96 object-center' data-aos="zoom-out" data-aos-easing="ease-in-out-back" />
        

    </div>
    </> );
}
 
export default Hero;