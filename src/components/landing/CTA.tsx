import * as React from "react";
import img from '../../assets/icons/img_12.png'

const CTA: React.FC = () => {
    return (
        <div className="container mx-auto px-6 lg:p-[2px]  lg:pt-[20px] py-16">
            <img src={img} className="w-auto h-[1000px]" alt="img"/>
        </div>
    )
}
export default CTA;
