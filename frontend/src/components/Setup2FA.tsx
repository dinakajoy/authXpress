import { useState } from "react";
import axios from "axios";

interface Setup2FAModalProps {
  email: string;
  onClose: () => void;
}

const Setup2FAModal: React.FC<Setup2FAModalProps> = ({ email, onClose }) => {
  const [qrCode, setQrCode] = useState<string>("");

  const setup2FA = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/2fa/setup`, {
        email,
      });
      setQrCode(res.data.qr);
    } catch (err) {
      console.error("2FA setup failed", err);
    }
  };

  // Call setup when modal is mounted
  useState(() => {
    setup2FA();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">
          Enable Two-Factor Authentication
        </h2>
        {qrCode ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Scan the QR code below with your authenticator app (e.g., Google
              Authenticator):
            </p>
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto" />
          </>
        ) : (
          <p className="text-sm text-gray-500">Generating QR Code...</p>
        )}
        <button
          className="text-gray-500 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Setup2FAModal;
