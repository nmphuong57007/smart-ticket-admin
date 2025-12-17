"use client";

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";
import { useEffect, useRef } from "react";

export interface QRScannerProps {
  onScan: (decodedText: string) => void;
}

const CONTAINER_ID = "qr-camera-container";

export default function QRScanner({ onScan }: QRScannerProps) {
  const hasScannedRef = useRef(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Xóa UI cũ nếu có (tránh double khi React dev mode)
    const container = document.getElementById(CONTAINER_ID);
    if (container) container.innerHTML = "";

    const html5Qr = new Html5Qrcode(CONTAINER_ID);
    html5QrCodeRef.current = html5Qr;

    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: { width: 260, height: 260 },
      aspectRatio: 1,
    };

    html5Qr
      .start(
        { facingMode: "environment" }, // camera sau nếu có
        config,
        (decodedText: string) => {
          // Chỉ handle lần đầu
          if (hasScannedRef.current) return;
          hasScannedRef.current = true;

          onScan(decodedText);
          // KHÔNG stop ở đây, để cleanup lo → tránh lỗi "Cannot stop..."
        },
        (_errorMessage: string) => {
          // lỗi mỗi frame → bỏ qua, không log để khỏi spam
        }
      )
      .then(() => {
        startedRef.current = true;
      })
      .catch((err) => {
        console.error("Không thể bật camera", err);
        startedRef.current = false;
      });

    // cleanup: khi đóng modal / unmount component
    return () => {
      const qr = html5QrCodeRef.current;
      if (!qr) return;

      if (startedRef.current) {
        // Chỉ stop nếu đã start thành công
        void qr.stop().then(() => {
          void qr.clear();
        });
      } else {
        // Nếu chưa start được thì chỉ clear container
        void qr.clear();
      }
    };
  }, [onScan]);

  return (
  <div
    id={CONTAINER_ID}
    className="w-[260px] h-[260px] mx-auto rounded-lg overflow-hidden bg-black"
  />
);

}
