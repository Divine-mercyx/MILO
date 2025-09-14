import * as React from "react";
import img1 from '../../assets/icons/img.png';
import img2 from '../../assets/icons/img_1.png';
import img3 from '../../assets/icons/img_2.png';
import img4 from '../../assets/icons/img_3.png';
import img5 from '../../assets/icons/img_4.png';
import img6 from '../../assets/icons/img_5.png';
import img7 from '../../assets/icons/img_6.png';




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
            <img src={img7} alt="Feature 1" className="w-full mt-6 h-full object-cover" />
        </div>
    );
};

export default Features;
