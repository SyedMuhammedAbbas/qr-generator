import React, { useState, useMemo, useRef, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import vCardsJS from "vcards-js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Link, 
  User, 
  Mail, 
  MessageSquare, 
  Wifi, 
  Type, 
  Phone, 
  MapPin, 
  Calendar, 
  Coins,
  Download,
  ChevronDown,
  Maximize,
  Image as ImageIcon,
  LayoutGrid,
  QrCode,
  Upload
} from 'lucide-react';

const QR_TYPES = {
  url: { label: "URL", icon: Link },
  vcard: { label: "vCard", icon: User },
  sms: { label: "SMS", icon: MessageSquare },
  email: { label: "Email", icon: Mail },
  wifi: { label: "WiFi", icon: Wifi },
  text: { label: "Text", icon: Type },
  phone: { label: "Phone", icon: Phone },
  location: { label: "Map", icon: MapPin },
  calendar: { label: "Event", icon: Calendar },
  bitcoin: { label: "Bitcoin", icon: Coins },
};

const QRCodeGenerator = () => {
  const qrRef = useRef(null);
  const [qrCode] = useState(new QRCodeStyling({
    width: 300,
    height: 300,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10
    }
  }));

  const [qrType, setQrType] = useState("url");
  const [qrColor, setQrColor] = useState("#4F46E5");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(512);
  const [dotsType, setDotsType] = useState("square");
  const [logo, setLogo] = useState("");

  // Input states
  const [url, setUrl] = useState("");
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" });
  const [smsData, setSmsData] = useState({ number: "", message: "" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "", security: "WPA" });
  const [text, setText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationData, setLocationData] = useState({ latitude: "", longitude: "", query: "" });
  const [calendarData, setCalendarData] = useState({ title: "", startDate: "", startTime: "" });
  const [bitcoinData, setBitcoinData] = useState({ address: "", amount: "" });

  const generateVCardString = () => {
    const vCard = vCardsJS();
    vCard.firstName = contactInfo.firstName;
    vCard.lastName = contactInfo.lastName;
    vCard.cellPhone = contactInfo.phone;
    vCard.email = contactInfo.email;
    return vCard.getFormattedString();
  };

  const generateQRValue = () => {
    switch (qrType) {
      case "url": return url || "";
      case "vcard": return generateVCardString();
      case "email":
        if (!emailData.to) return "";
        return `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      case "sms":
        if (!smsData.number) return "";
        return `sms:${smsData.number}${smsData.message ? `:${encodeURIComponent(smsData.message)}` : ""}`;
      case "wifi":
        if (!wifiData.ssid) return "";
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password || ""};;`;
      case "text": return text || "";
      case "phone": return phoneNumber ? `tel:${phoneNumber}` : "";
      case "location":
        if (locationData.latitude && locationData.longitude) return `geo:${locationData.latitude},${locationData.longitude}`;
        return locationData.query ? `geo:0,0?q=${encodeURIComponent(locationData.query)}` : "";
      case "calendar":
        if (!calendarData.title || !calendarData.startDate) return "";
        return `BEGIN:VEVENT\nSUMMARY:${calendarData.title}\nDTSTART:${calendarData.startDate.replace(/-/g, "")}T${(calendarData.startTime || "000000").replace(/:/g, "")}00\nEND:VEVENT`;
      case "bitcoin":
        return bitcoinData.address ? `bitcoin:${bitcoinData.address}?amount=${bitcoinData.amount}` : "";
      default: return "";
    }
  };

  const qrValue = useMemo(() => generateQRValue(), [
    qrType, url, contactInfo, emailData, smsData, wifiData, text, phoneNumber, locationData, calendarData, bitcoinData
  ]);

  useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, []);

  useEffect(() => {
    qrCode.update({
      data: qrValue || " ",
      dotsOptions: { color: qrColor, type: dotsType },
      backgroundOptions: { color: qrBgColor },
      image: logo,
      width: 300,
      height: 300,
    });
  }, [qrValue, qrColor, qrBgColor, dotsType, logo]);

  const handleDownload = (ext = "png") => {
    qrCode.update({ width: qrSize, height: qrSize });
    qrCode.download({ name: "qr-generator", extension: ext });
    setTimeout(() => qrCode.update({ width: 300, height: 300 }), 500);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => setLogo(f.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const renderForm = () => {
    const inputClass = "input-field";
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={qrType}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="form-container"
        >
          {qrType === "url" && (
            <div className="form-group">
              <label className="form-label">Link Address</label>
              <input type="url" className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourlink.com" />
            </div>
          )}
          {qrType === "vcard" && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className={inputClass} value={contactInfo.firstName} onChange={(e) => handleInputChange(setContactInfo, "firstName", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className={inputClass} value={contactInfo.lastName} onChange={(e) => handleInputChange(setContactInfo, "lastName", e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" className={inputClass} value={contactInfo.phone} onChange={(e) => handleInputChange(setContactInfo, "phone", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className={inputClass} value={contactInfo.email} onChange={(e) => handleInputChange(setContactInfo, "email", e.target.value)} />
              </div>
            </>
          )}
          {qrType === "email" && (
            <>
              <div className="form-group">
                <label className="form-label">Recipient Email</label>
                <input type="email" className={inputClass} value={emailData.to} onChange={(e) => handleInputChange(setEmailData, "to", e.target.value)} placeholder="hello@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input type="text" className={inputClass} value={emailData.subject} onChange={(e) => handleInputChange(setEmailData, "subject", e.target.value)} placeholder="Inquiry" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className={`${inputClass} textarea-field`} value={emailData.body} onChange={(e) => handleInputChange(setEmailData, "body", e.target.value)} placeholder="Write your message..." />
              </div>
            </>
          )}
          {qrType === "sms" && (
            <>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className={inputClass} value={smsData.number} onChange={(e) => handleInputChange(setSmsData, "number", e.target.value)} placeholder="+1 234 567 890" />
              </div>
              <div className="form-group">
                <label className="form-label">Message Text</label>
                <textarea className={`${inputClass} textarea-field`} value={smsData.message} onChange={(e) => handleInputChange(setSmsData, "message", e.target.value)} placeholder="Type your message..." />
              </div>
            </>
          )}
          {qrType === "wifi" && (
            <>
              <div className="form-group">
                <label className="form-label">Network Name (SSID)</label>
                <input type="text" className={inputClass} value={wifiData.ssid} onChange={(e) => handleInputChange(setWifiData, "ssid", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className={inputClass} value={wifiData.password} onChange={(e) => handleInputChange(setWifiData, "password", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Security</label>
                <select className={inputClass} value={wifiData.security} onChange={(e) => handleInputChange(setWifiData, "security", e.target.value)}>
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            </>
          )}
          {qrType === "text" && (
            <div className="form-group">
              <label className="form-label">Plain Text</label>
              <textarea className={`${inputClass} textarea-field`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter any text to encode..." />
            </div>
          )}
          {qrType === "phone" && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className={inputClass} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 234 567 890" />
            </div>
          )}
          {qrType === "location" && (
            <>
              <div className="form-group">
                <label className="form-label">Search Location</label>
                <input type="text" className={inputClass} value={locationData.query} onChange={(e) => handleInputChange(setLocationData, "query", e.target.value)} placeholder="Statue of Liberty" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" className={inputClass} value={locationData.latitude} onChange={(e) => handleInputChange(setLocationData, "latitude", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" className={inputClass} value={locationData.longitude} onChange={(e) => handleInputChange(setLocationData, "longitude", e.target.value)} />
                </div>
              </div>
            </>
          )}
          {qrType === "calendar" && (
            <>
              <div className="form-group">
                <label className="form-label">Event Summary</label>
                <input type="text" className={inputClass} value={calendarData.title} onChange={(e) => handleInputChange(setCalendarData, "title", e.target.value)} placeholder="Team Sync" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className={inputClass} value={calendarData.startDate} onChange={(e) => handleInputChange(setCalendarData, "startDate", e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input type="time" className={inputClass} value={calendarData.startTime} onChange={(e) => handleInputChange(setCalendarData, "startTime", e.target.value)} />
                </div>
              </div>
            </>
          )}
          {qrType === "bitcoin" && (
            <>
              <div className="form-group">
                <label className="form-label">Wallet Address</label>
                <input type="text" className={inputClass} value={bitcoinData.address} onChange={(e) => handleInputChange(setBitcoinData, "address", e.target.value)} placeholder="1A1zP1eP5QG..." />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (BTC)</label>
                <input type="number" step="any" className={inputClass} value={bitcoinData.amount} onChange={(e) => handleInputChange(setBitcoinData, "amount", e.target.value)} placeholder="0.00" />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownloadClick = (ext) => {
    handleDownload(ext);
    setShowDropdown(false);
  };

  return (
    <div className="generator-layout">
      <div className="generator-main">
        <header className="generator-header">
          <h1 className="generator-title">Generate QR</h1>
          <p className="generator-subtitle">Configure your dynamic or static code with surgical precision.</p>
        </header>

        {/* Step 1: Select Type */}
        <motion.section 
          className="step-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="step-header">
            <div className="step-number">1</div>
            <h2 className="step-title">Select Type</h2>
          </div>
          <div className="type-grid">
            {Object.entries(QR_TYPES).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                className={`type-card ${qrType === key ? "active" : ""}`}
                onClick={() => setQrType(key)}
              >
                <div className="type-icon"><Icon size={24} /></div>
                <span className="type-label">{label}</span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Step 2: Enter Details */}
        <motion.section 
          className="step-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="step-header">
            <div className="step-number">2</div>
            <h2 className="step-title">Enter Details</h2>
          </div>
          {renderForm()}
        </motion.section>

        {/* Step 3: Customize Design */}
        <motion.section 
          className="step-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="step-header">
            <div className="step-number">3</div>
            <h2 className="step-title">Customize Design</h2>
          </div>
          <div className="custom-grid">
            <div className="pattern-group">
              <h4 className="color-label">COLOR PALETTE</h4>
              <div className="color-option">
                <div className="color-preview" style={{ backgroundColor: qrColor }}>
                  <input type="color" className="color-input" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
                </div>
                <div className="color-info">
                  <span className="color-label">QR Color</span>
                  <span className="color-hex">{qrColor.toUpperCase()}</span>
                </div>
              </div>
              <div className="color-option">
                <div className="color-preview" style={{ backgroundColor: qrBgColor }}>
                  <input type="color" className="color-input" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} />
                </div>
                <div className="color-info">
                  <span className="color-label">Background</span>
                  <span className="color-hex">{qrBgColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="pattern-group">
              <h4 className="color-label">PATTERN STYLE</h4>
              <div className="pattern-selector">
                <button className={`pattern-btn ${dotsType === 'square' ? 'active' : ''}`} onClick={() => setDotsType('square')}>Square</button>
                <button className={`pattern-btn ${dotsType === 'dots' ? 'active' : ''}`} onClick={() => setDotsType('dots')}>Dots</button>
                <button className={`pattern-btn ${dotsType === 'rounded' ? 'active' : ''}`} onClick={() => setDotsType('rounded')}>Rounded</button>
              </div>
              <label className="logo-upload">
                <Upload size={20} />
                <span>{logo ? "CHANGE LOGO" : "UPLOAD LOGO"}</span>
                <input type="file" style={{ display: 'none' }} onChange={handleLogoUpload} accept="image/*" />
              </label>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Sticky Preview Column */}
      <aside className="preview-column">
        <motion.div 
          className="preview-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
         <div className="qr-frame">
            <div 
              ref={qrRef} 
              style={{ 
                width: '100%', 
                display: qrValue ? 'flex' : 'none', 
                justifyContent: 'center' 
              }}
            ></div>
            {!qrValue && (
              <div className="qr-empty-state">
                <QrCode size={48} strokeWidth={1} />
                <p>Enter data to generate</p>
              </div>
            )}
          </div>
          <div className="scan-hint">
            <Maximize size={16} />
            <span>Scan to test before download</span>
          </div>
          
          <div className="size-control">
            <div className="size-header">
              <span className="size-label">OUTPUT SIZE</span>
              <span className="size-value">{qrSize}PX</span>
            </div>
            <input type="range" min="256" max="2048" step="128" value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} className="size-slider" />
          </div>

          <div className="download-container">
            <div className="download-button-group">
              <button 
                className="download-btn" 
                onClick={() => handleDownload()} 
                disabled={!qrValue}
              >
                <Download size={20} />
                <span>DOWNLOAD QR</span>
              </button>
              <button 
                className={`download-dropdown ${showDropdown ? 'active' : ''}`}
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={!qrValue}
              >
                <ChevronDown size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  className="format-dropdown"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => handleDownloadClick('png')}>PNG Image</button>
                  <button onClick={() => handleDownloadClick('svg')}>SVG Vector</button>
                  <button onClick={() => handleDownloadClick('jpeg')}>JPG High Res</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </aside>
    </div>
  );
};

export default QRCodeGenerator;
