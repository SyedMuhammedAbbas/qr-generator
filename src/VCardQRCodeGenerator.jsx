import React, { useState, useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import vCardsJS from "vcards-js";

const VCardQRCodeGenerator = () => {
  const qrCodeRef = useRef(null);

  // Contact information
  const [contactInfo] = useState({
    firstName: "Huzaifa",
    lastName: "Imran",
    organization: "Emergen",
    title: "CTO & Co-Founder",
    phone: "+92 309 9226663",
    email: "huzaifa@emergen.io",
    website: "emergen.io",
    linkedinUrl: "https://www.linkedin.com/in/huzaifaimran/",
  });

  const generateVCardString = () => {
    const vCard = vCardsJS();

    vCard.firstName = contactInfo.firstName;
    vCard.lastName = contactInfo.lastName;
    vCard.organization = contactInfo.organization;
    vCard.title = contactInfo.title;
    vCard.cellPhone = contactInfo.phone;
    vCard.email = contactInfo.email;
    vCard.url = `https://${contactInfo.website}`;

    // Get the base vCard string
    let vCardString = vCard.getFormattedString();

    // Add LinkedIn URL using X-SOCIALPROFILE (vCard 4.0 standard)
    if (contactInfo.linkedinUrl) {
      // Remove the END:VCARD line, add LinkedIn, then add END:VCARD back
      vCardString = vCardString.replace("END:VCARD", "");
      vCardString += `X-SOCIALPROFILE;TYPE=linkedin:${contactInfo.linkedinUrl}\r\n`;
      vCardString += "END:VCARD";
    }

    return vCardString;
  };

  // Memoize the vCard string to avoid regenerating on every render
  const qrCodeValue = useMemo(() => generateVCardString(), []);

  // Function to download QR code as PNG
  const downloadQRCode = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Set canvas size with padding for quiet zone
    const padding = 40;
    const size = 256 + padding * 2;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      // Fill white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, size, size);

      // Draw QR code with padding
      ctx.drawImage(img, padding, padding, 256, 256);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${contactInfo.firstName}_${contactInfo.lastName}_QRCode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  // Function to download vCard as VCF file
  const downloadVCF = () => {
    const vCardString = generateVCardString();
    const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contactInfo.firstName}_${contactInfo.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="vcard-qr-container">
      <div className="vcard-qr-content">
        <h1 className="vcard-qr-title">Scan to Add Contact</h1>

        <div className="vcard-qr-code-wrapper" ref={qrCodeRef}>
          <QRCode
            value={qrCodeValue}
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>

        <div className="vcard-qr-download-buttons">
          <button
            className="vcard-qr-download-btn"
            onClick={downloadQRCode}
            aria-label="Download QR Code"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download QR Code
          </button>

          <button
            className="vcard-qr-download-btn vcard-qr-download-btn-secondary"
            onClick={downloadVCF}
            aria-label="Download VCF File"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Download VCF
          </button>
        </div>

        <div className="vcard-qr-info">
          <p className="vcard-qr-name">
            {contactInfo.firstName} {contactInfo.lastName}
          </p>
          <p className="vcard-qr-title-text">{contactInfo.title}</p>
          <p className="vcard-qr-org">{contactInfo.organization}</p>
        </div>

        <p className="vcard-qr-hint">
          Scan this QR code with your phone to save the contact details
        </p>
      </div>
    </div>
  );
};

export default VCardQRCodeGenerator;
