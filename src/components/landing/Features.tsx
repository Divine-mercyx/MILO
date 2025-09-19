import * as React from "react";
import img1 from '../../assets/icons/img.png';
import img2 from '../../assets/icons/img_1.png';
import img3 from '../../assets/icons/img_2.png';
import img4 from '../../assets/icons/img_3.png';
import img5 from '../../assets/icons/img_4.png';
import img6 from '../../assets/icons/img_5.png';



const Features: React.FC = () => {
    return (
        <div className="container mx-auto px-6 lg:p-[270px]  lg:pt-[100px] py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                {/* Main content (2fr) */}
                <div className="overflow-hidden">
                    <img src={img1} alt="Main feature" className="w-full h-full object-cover" />
                </div>

                {/* Side content (1fr) - stacked */}
                <div className="grid grid-rows-2 gap-8">
                    <div className="overflow-hidden">
                        <img src={img2} alt="Feature 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                        <img src={img3} alt="Feature 2" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
            <div className="grid mt-6 grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="overflow-hidden">
                    <img src={img4} alt="Feature 1" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <img src={img5} alt="Feature 2" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <img src={img6} alt="Feature 1" className="w-full h-full object-cover" />
                </div>
            </div>
            <div style={{ borderRadius: "20px", fontFamily: "poppins" }} className="pt-10 pl-8 pb-8 pr-10 bg-[#F3F3F3CF] rounded-lg mt-6">
                <h1 className="text-[#7062FF] text-[25px] lg:text-[20px] font-bold">
                    Works Everywhere
                </h1>
                <p style={{ position: "relative", bottom: "15px" }} className="text-[#787878] text-[18px] lg:text-[16px] mt-4">
                    RESPONSIVE WEB APP + iOS & ANDROID SOON.
                </p>
            </div>
        </div>
    );
};

export default Features;
