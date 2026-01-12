# QR Code Generator

A modern, feature-rich web application for generating QR codes for various purposes. **No login or account required** - simply open the app and start creating QR codes instantly!

## What It Does

This application allows you to create QR codes for a wide variety of use cases. Whether you need to share a website link, contact information, WiFi credentials, or even Bitcoin payment details, this tool has you covered. All processing happens locally in your browser - your data never leaves your device.

## Features

### Multiple QR Code Types

- **🔗 URL/Link** - Generate QR codes for any website or URL
- **👤 vCard** - Create contact cards with name, phone, email, organization, and social links
- **📧 Email** - Generate QR codes that open email clients with pre-filled recipient, subject, and message
- **💬 SMS** - Create QR codes for sending text messages with pre-filled content
- **📶 WiFi** - Share WiFi network credentials (SSID, password, security type)
- **📝 Text** - Encode any plain text into a QR code
- **📞 Phone** - Generate QR codes for phone numbers
- **📍 Location** - Create location QR codes using coordinates or address search
- **📅 Calendar** - Generate event QR codes with title, description, location, and date/time
- **₿ Bitcoin** - Create Bitcoin payment QR codes with address, amount, label, and message

### Key Capabilities

- ✅ **Real-time Preview** - See your QR code update instantly as you type
- ✅ **Download as PNG** - Save QR codes as high-quality images
- ✅ **Download VCF** - For vCard type, download the contact file directly
- ✅ **No Login Required** - Completely free and anonymous to use
- ✅ **Privacy-First** - All processing happens in your browser, no data sent to servers
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **react-qr-code** - QR code generation library
- **vcards-js** - vCard format generation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qr-generator
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can preview the production build with:

```bash
npm run preview
```

## Usage

1. **Select a QR Code Type** - Click on one of the QR code type buttons at the top
2. **Fill in the Form** - Enter the required information for your selected type
3. **Preview** - Your QR code will appear automatically as you fill in the form
4. **Download** - Click the "Download QR Code" button to save it as a PNG image
5. **For vCard** - You can also download the contact as a VCF file

## Privacy & Security

- **No Login Required** - Use the application immediately without creating an account
- **No Data Collection** - All QR code generation happens locally in your browser
- **No Server Processing** - Your information never leaves your device
- **No Tracking** - No analytics, cookies, or tracking scripts

## Project Structure

```
qr-generator/
├── src/
│   ├── App.jsx              # Root component
│   ├── App.css              # Application styles
│   ├── QRCodeGenerator.jsx  # Main QR code generator component
│   └── main.jsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions, issues, and feature requests are welcome!

---

**Made with ❤️ for easy QR code generation**
