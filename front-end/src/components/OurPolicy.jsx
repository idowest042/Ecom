import { Waypoints, ShieldCheck,Bus } from "lucide-react";

const OurPolicy = () => {
    return ( <>
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700">
     <div className="" data-aos="fade-down" data-aos-duration="1000" data-aos-once="false" data-aos-easing="ease">
        <Waypoints className="w-12 m-auto  mb-5 size-7"/>
        <p className="font-semibold">Easy Exchange Policy</p>
        <p className="capitalize text-gray-400">we offer hassle free exchange Policy</p>
     </div>
     <div className="" data-aos="fade-down" data-aos-delay="200" data-aos-duration="2000" data-aos-easing="ease" data-aos-once="false">
        <ShieldCheck  className="w-12 m-auto  mb-5 size-7"/>
        <p className="font-semibold">7 Days Return Policy</p>
        <p className="capitalize text-gray-400">we provide 7 days return Policy</p>
     </div>
     <div className="" data-aos="fade-down" data-aos-delay="400" aos-once="false" data-aos-duration="2500" data-aos-easing="ease" data-aos-once="false">
        <Bus  className="w-12 m-auto  mb-5 size-7"/>
        <p className="font-semibold">Fast Delivary</p>
        <p className="capitalize text-gray-400">get your product between 3-7 working days</p>
     </div>

    </div>
    </> );
}
 
export default OurPolicy;