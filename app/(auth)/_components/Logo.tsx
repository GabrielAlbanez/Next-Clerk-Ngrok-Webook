import Logoo from "@/assets/img/Disney_Plus_logo.svg.png"
import Image from "next/image";

const Logo = () => {
    return (
        <div>
            <Image src={Logoo} alt="logo" width={200} height={200}/>
        </div>
    );
}
 
export default Logo;