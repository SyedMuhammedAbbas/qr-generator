import React, { useState, useMemo, useRef } from "react";
import QRCode from "react-qr-code";
import vCardsJS from "vcards-js";

const QR_TYPES = {
  url: { label: "URL/Link", icon: "🔗" },
  vcard: { label: "vCard", icon: "👤" },
  email: { label: "Email", icon: "📧" },
  sms: { label: "SMS", icon: "💬" },
  wifi: { label: "WiFi", icon: "📶" },
  text: { label: "Text", icon: "📝" },
  phone: { label: "Phone", icon: "📞" },
  location: { label: "Location", icon: "📍" },
  calendar: { label: "Calendar", icon: "📅" },
  bitcoin: { label: "Bitcoin", icon: "₿" },
};

const QRCodeGenerator = () => {
  const qrCodeRef = useRef(null);
  const [qrType, setQrType] = useState("url");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");

  // URL state
  const [url, setUrl] = useState("");

  // vCard state
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
    linkedinUrl: "",
  });

  // Email state
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });

  // SMS state
  const [smsData, setSmsData] = useState({
    number: "",
    message: "",
  });

  // WiFi state
  const [wifiData, setWifiData] = useState({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });

  // Text state
  const [text, setText] = useState("");

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("");

  // Location state
  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
    query: "",
  });

  // Calendar state
  const [calendarData, setCalendarData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });

  // Bitcoin state
  const [bitcoinData, setBitcoinData] = useState({
    address: "",
    amount: "",
    label: "",
    message: "",
  });

  const generateVCardString = () => {
    const vCard = vCardsJS();

    vCard.firstName = contactInfo.firstName;
    vCard.lastName = contactInfo.lastName;
    vCard.organization = contactInfo.organization;
    vCard.title = contactInfo.title;
    vCard.cellPhone = contactInfo.phone;
    vCard.email = contactInfo.email;
    if (contactInfo.website) {
      vCard.url = `https://${contactInfo.website}`;
    }

    let vCardString = vCard.getFormattedString();

    if (contactInfo.linkedinUrl) {
      vCardString = vCardString.replace("END:VCARD", "");
      vCardString += `X-SOCIALPROFILE;TYPE=linkedin:${contactInfo.linkedinUrl}\r\n`;
      vCardString += "END:VCARD";
    }

    return vCardString;
  };

  const generateQRValue = () => {
    switch (qrType) {
      case "url":
        return url || "";

      case "vcard":
        return generateVCardString();

      case "email":
        if (!emailData.to) return "";
        let emailString = `mailto:${emailData.to}`;
        const params = [];
        if (emailData.subject) params.push(`subject=${encodeURIComponent(emailData.subject)}`);
        if (emailData.body) params.push(`body=${encodeURIComponent(emailData.body)}`);
        if (params.length > 0) emailString += `?${params.join("&")}`;
        return emailString;

      case "sms":
        if (!smsData.number) return "";
        let smsString = `sms:${smsData.number}`;
        if (smsData.message) {
          smsString += `:${encodeURIComponent(smsData.message)}`;
        }
        return smsString;

      case "wifi":
        if (!wifiData.ssid) return "";
        const wifiString = `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password || ""};H:${wifiData.hidden ? "true" : "false"};;`;
        return wifiString;

      case "text":
        return text || "";

      case "phone":
        return phoneNumber ? `tel:${phoneNumber}` : "";

      case "location":
        if (locationData.latitude && locationData.longitude) {
          return `geo:${locationData.latitude},${locationData.longitude}`;
        } else if (locationData.query) {
          return `geo:0,0?q=${encodeURIComponent(locationData.query)}`;
        }
        return "";

      case "calendar":
        if (!calendarData.title || !calendarData.startDate) return "";
        const start = `${calendarData.startDate.replace(/-/g, "")}T${(calendarData.startTime || "000000").replace(/:/g, "")}00`;
        const end = calendarData.endDate
          ? `${calendarData.endDate.replace(/-/g, "")}T${(calendarData.endTime || "000000").replace(/:/g, "")}00`
          : start;
        
        let calendarString = `BEGIN:VEVENT\n`;
        calendarString += `SUMMARY:${calendarData.title}\n`;
        if (calendarData.description) calendarString += `DESCRIPTION:${calendarData.description}\n`;
        if (calendarData.location) calendarString += `LOCATION:${calendarData.location}\n`;
        calendarString += `DTSTART:${start}\n`;
        calendarString += `DTEND:${end}\n`;
        calendarString += `END:VEVENT`;
        return calendarString;

      case "bitcoin":
        if (!bitcoinData.address) return "";
        let bitcoinString = `bitcoin:${bitcoinData.address}`;
        const btcParams = [];
        if (bitcoinData.amount) btcParams.push(`amount=${bitcoinData.amount}`);
        if (bitcoinData.label) btcParams.push(`label=${encodeURIComponent(bitcoinData.label)}`);
        if (bitcoinData.message) btcParams.push(`message=${encodeURIComponent(bitcoinData.message)}`);
        if (btcParams.length > 0) bitcoinString += `?${btcParams.join("&")}`;
        return bitcoinString;

      default:
        return "";
    }
  };

  const qrCodeValue = useMemo(() => generateQRValue(), [
    qrType,
    url,
    contactInfo,
    emailData,
    smsData,
    wifiData,
    text,
    phoneNumber,
    locationData,
    calendarData,
    bitcoinData,
  ]);

  const downloadQRCode = () => {
    const svg = qrCodeRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const padding = 40;
    const size = 256 + padding * 2;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.fillStyle = qrBgColor || "white";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, padding, padding, 256, 256);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const filename = `QRCode_${qrType}_${Date.now()}.png`;
        link.download = filename;
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

  const downloadVCF = () => {
    const vCardString = generateVCardString();
    const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${contactInfo.firstName || "contact"}_${contactInfo.lastName || "card"}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const renderForm = () => {
    switch (qrType) {
      case "url":
        return (
          <div className="form-group">
            <label htmlFor="url-input">
              <span className="label-icon">🔗</span>
              Enter URL or Link
            </label>
            <input
              id="url-input"
              type="url"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        );

      case "vcard":
        return (
          <div className="vcard-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactInfo.firstName}
                  onChange={(e) =>
                    handleInputChange(setContactInfo, "firstName", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactInfo.lastName}
                  onChange={(e) =>
                    handleInputChange(setContactInfo, "lastName", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                type="text"
                className="form-input"
                value={contactInfo.organization}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "organization", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                value={contactInfo.title}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "title", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-input"
                value={contactInfo.phone}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "phone", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={contactInfo.email}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "email", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Website (without https://)</label>
              <input
                type="text"
                className="form-input"
                value={contactInfo.website}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "website", e.target.value)
                }
                placeholder="example.com"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                className="form-input"
                value={contactInfo.linkedinUrl}
                onChange={(e) =>
                  handleInputChange(setContactInfo, "linkedinUrl", e.target.value)
                }
                placeholder="https://www.linkedin.com/in/username/"
              />
            </div>
          </div>
        );

      case "email":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={emailData.to}
                onChange={(e) =>
                  handleInputChange(setEmailData, "to", e.target.value)
                }
                placeholder="recipient@example.com"
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-input"
                value={emailData.subject}
                onChange={(e) =>
                  handleInputChange(setEmailData, "subject", e.target.value)
                }
                placeholder="Email subject"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input form-textarea"
                value={emailData.body}
                onChange={(e) =>
                  handleInputChange(setEmailData, "body", e.target.value)
                }
                placeholder="Email message body"
                rows="4"
              />
            </div>
          </div>
        );

      case "sms":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={smsData.number}
                onChange={(e) =>
                  handleInputChange(setSmsData, "number", e.target.value)
                }
                placeholder="+1234567890"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-input form-textarea"
                value={smsData.message}
                onChange={(e) =>
                  handleInputChange(setSmsData, "message", e.target.value)
                }
                placeholder="SMS message text"
                rows="4"
              />
            </div>
          </div>
        );

      case "wifi":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Network Name (SSID) *</label>
              <input
                type="text"
                className="form-input"
                value={wifiData.ssid}
                onChange={(e) =>
                  handleInputChange(setWifiData, "ssid", e.target.value)
                }
                placeholder="WiFi Network Name"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                value={wifiData.password}
                onChange={(e) =>
                  handleInputChange(setWifiData, "password", e.target.value)
                }
                placeholder="WiFi Password"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Security Type</label>
                <select
                  className="form-input"
                  value={wifiData.security}
                  onChange={(e) =>
                    handleInputChange(setWifiData, "security", e.target.value)
                  }
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={wifiData.hidden}
                    onChange={(e) =>
                      handleInputChange(setWifiData, "hidden", e.target.checked)
                    }
                  />
                  <span>Hidden Network</span>
                </label>
              </div>
            </div>
          </div>
        );

      case "text":
        return (
          <div className="form-group">
            <label>Enter Text</label>
            <textarea
              className="form-input form-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text to encode in QR code"
              rows="6"
            />
          </div>
        );

      case "phone":
        return (
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
            />
          </div>
        );

      case "location":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Or Search by Address</label>
              <input
                type="text"
                className="form-input"
                value={locationData.query}
                onChange={(e) =>
                  handleInputChange(setLocationData, "query", e.target.value)
                }
                placeholder="Search address or place name"
              />
            </div>
            <div className="form-divider">
              <span>OR</span>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={locationData.latitude}
                  onChange={(e) =>
                    handleInputChange(setLocationData, "latitude", e.target.value)
                  }
                  placeholder="40.7128"
                />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  value={locationData.longitude}
                  onChange={(e) =>
                    handleInputChange(setLocationData, "longitude", e.target.value)
                  }
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Event Title *</label>
              <input
                type="text"
                className="form-input"
                value={calendarData.title}
                onChange={(e) =>
                  handleInputChange(setCalendarData, "title", e.target.value)
                }
                placeholder="Meeting Title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input form-textarea"
                value={calendarData.description}
                onChange={(e) =>
                  handleInputChange(setCalendarData, "description", e.target.value)
                }
                placeholder="Event description"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-input"
                value={calendarData.location}
                onChange={(e) =>
                  handleInputChange(setCalendarData, "location", e.target.value)
                }
                placeholder="Event location"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={calendarData.startDate}
                  onChange={(e) =>
                    handleInputChange(setCalendarData, "startDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={calendarData.startTime}
                  onChange={(e) =>
                    handleInputChange(setCalendarData, "startTime", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={calendarData.endDate}
                  onChange={(e) =>
                    handleInputChange(setCalendarData, "endDate", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={calendarData.endTime}
                  onChange={(e) =>
                    handleInputChange(setCalendarData, "endTime", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "bitcoin":
        return (
          <div className="vcard-form">
            <div className="form-group">
              <label>Bitcoin Address *</label>
              <input
                type="text"
                className="form-input"
                value={bitcoinData.address}
                onChange={(e) =>
                  handleInputChange(setBitcoinData, "address", e.target.value)
                }
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              />
            </div>
            <div className="form-group">
              <label>Amount (BTC)</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={bitcoinData.amount}
                onChange={(e) =>
                  handleInputChange(setBitcoinData, "amount", e.target.value)
                }
                placeholder="0.001"
              />
            </div>
            <div className="form-group">
              <label>Label</label>
              <input
                type="text"
                className="form-input"
                value={bitcoinData.label}
                onChange={(e) =>
                  handleInputChange(setBitcoinData, "label", e.target.value)
                }
                placeholder="Payment label"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <input
                type="text"
                className="form-input"
                value={bitcoinData.message}
                onChange={(e) =>
                  handleInputChange(setBitcoinData, "message", e.target.value)
                }
                placeholder="Payment message"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="qr-generator-container">
      <div className="qr-generator-content">
        <div className="qr-header">
          <h1 className="qr-title">QR Code Generator</h1>
          <p className="qr-subtitle">Make QR codes for whatever you need</p>
        </div>

        {/* QR Type Selection */}
        <div className="qr-type-selection">
          {Object.entries(QR_TYPES).map(([key, { label, icon }]) => (
            <button
              key={key}
              className={`qr-type-btn ${qrType === key ? "active" : ""}`}
              onClick={() => setQrType(key)}
              title={label}
            >
              <span className="qr-type-icon">{icon}</span>
              <span className="qr-type-label">{label}</span>
            </button>
          ))}
        </div>

        {/* Form Section */}
        <div className="form-section">
          <div className="form-header">
            <h3>{QR_TYPES[qrType].label} QR Code</h3>
          </div>
          {renderForm()}
        </div>

        {/* QR Style Section */}
        <div className="qr-style-section">
          <div className="qr-style-header">
            <h4>QR Style</h4>
            <p>Customize the colors of your QR code</p>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>QR Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  aria-label="QR foreground color"
                />
                <input
                  type="text"
                  className="form-input color-hex-input"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Background Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  className="color-input"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  aria-label="QR background color"
                />
                <input
                  type="text"
                  className="form-input color-hex-input"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        {qrCodeValue && (
          <div className="qr-display-section">
            <div className="qr-code-wrapper" ref={qrCodeRef}>
              <QRCode
                value={qrCodeValue}
                size={280}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 280 280`}
                fgColor={qrColor}
                bgColor={qrBgColor}
              />
            </div>

            <div className="qr-actions">
              <button
                className="qr-action-btn qr-action-btn-primary"
                onClick={downloadQRCode}
                aria-label="Download QR Code"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download QR Code
              </button>

              {qrType === "vcard" && (
                <button
                  className="qr-action-btn qr-action-btn-secondary"
                  onClick={downloadVCF}
                  aria-label="Download VCF File"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                  Download VCF
                </button>
              )}
            </div>
          </div>
        )}

        {!qrCodeValue && (
          <div className="qr-empty-state">
            <p>👆 Fill in the form above and your QR code will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
