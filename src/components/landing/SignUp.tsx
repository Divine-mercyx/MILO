
import * as React from "react";
import img from "../../assets/icons/img_14.png";



const SignUp: React.FC = () => {
    return (
        <img src={img} className="w-full h-full" alt="img"/>

        // <div className="container mx-auto px-6 lg:p-[190px]  lg:pt-[20px] py-16">
        //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        //         <div>
        //             <img src={img1} className="w-auto h-[300px]" />
        //             <img src={img2} className="w-auto h-[90px]" />
        //         </div>
        //         <div>
        //             {/*<h1 style={{ lineHeight: "70px", fontFamily: "poppins" }} className="text-5xl md:text-[70px] font-bold text-milo-dark-purpl bg-gradient-to-r from-[#7062FF] to-[#362F7B] bg-clip-text text-transparent leading-tight">*/}
        //             {/*    One<br/>*/}
        //             {/*    Sign-Up.<br />*/}
        //             {/*    Unlimited Access.*/}
        //             {/*</h1>*/}
        //             <img src={img4} className="w-auto h-auto" />
        //
        //             <img src={img3} className="w-auto mt-[70px] h-[170px]" />
        //
        //             {/*<p style={{ fontFamily: "poppins" }} className="text-[31.6px] mt-[50px] text-[#787878]">*/}
        //             {/*    Create your MILO wallet once and instantly chat, send, swap, and manage your assets. No extra apps, no friction.*/}
        //             {/*</p>*/}
        //         </div>
        //     </div>
        // </div>
    )
}
export default SignUp;
