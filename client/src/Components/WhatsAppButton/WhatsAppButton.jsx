import React from "react";
import "./WhatsAppButton.css";
import { ImWhatsapp } from "react-icons/im";
import { WhatsappNumber, Message } from "../../assets/assets";

const WhatsAppButton = () => {
    

    const encodedMessage = encodeURIComponent(Message);

    const whatsappURL = `https://wa.me/${WhatsappNumber}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappURL}
            className="whatsapp-float"
            target="_blank"
            rel="noopener noreferrer"
        >
            {/* <img
        src="/images/whatsapp.png"
        alt="WhatsApp"
        className="whatsapp-icon"
      /> */}
            <div className="whatsapp-icon">

                <ImWhatsapp />
            </div>
        </a>
    );
};

export default WhatsAppButton;