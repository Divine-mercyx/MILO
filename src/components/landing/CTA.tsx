import * as React from "react";
import img from '../../assets/icons/img_12.png'

const CTA: React.FC = () => {
    return (
        <div className="container mx-auto px-6 lg:p-[190px]  lg:pt-[20px] py-16">
            <img src={img} className="w-full h-full"/>
        </div>
    )
}
export default CTA;
