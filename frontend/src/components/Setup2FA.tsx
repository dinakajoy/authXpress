import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

interface Setup2FAModalProps {
  id: string;
  onClose: () => void;
}

const Setup2FAModal: React.FC<Setup2FAModalProps> = ({ id, onClose }) => {
  const { user, setUser } = useUser();
  const [qrCode, setQrCode] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const setup2FA = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API}/2fa/setup`,
          {
            id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQrCode(res.data.qr);
      } catch (err) {
        console.error("2FA setup failed", err);
      }
    };
    setup2FA();
  }, [id]);

  const verify2FA = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API}/2fa/verify`,
        {
          id,
          token: code,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setVerified(true);
        if (user) {
          setUser({ ...user, twoFAEnabled: true });
        }
        setTimeout(() => onClose(), 1500);
      } else {
        alert("Invalid code. Try again.");
      }
    } catch (err) {
      alert("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">
          Enable Two-Factor Authentication
        </h2>

        {qrCode ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Scan the QR code below with your authenticator app:
            </p>
            <img
              src={qrCode}
              alt="2FA QR Code"
              className="w-48 h-48 mx-auto mb-4"
            />
            <div>
              <label className="block mb-1 text-sm font-medium">
                Enter the 6-digit code from your app:
              </label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="border rounded px-3 py-2 w-full mb-2"
              />
              <button
                onClick={verify2FA}
                disabled={loading || code.length !== 6}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
              >
                {loading ? "Verifying..." : "Verify & Enable 2FA"}
              </button>
              {verified && (
                <p className="text-green-600 font-medium mt-3">
                  ✅ 2FA successfully enabled!
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Generating QR Code...</p>
        )}

        <div className="flex justify-end">
          <button
            className="text-red-500 hover:underline text-sm mt-2"
            onClick={() => {
              onClose();
            }}
          >
            Setup later
          </button>
        </div>

        <button
          className="absolute top-2 right-2 text-white hover:text-red-300 text-lg bg-red-500 px-2 rounded-full"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Setup2FAModal;
