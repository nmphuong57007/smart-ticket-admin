// src/api/hooks/use-checkin.ts

import instance from "@/lib/instance";
import { CheckinResponseData } from "../interfaces/checkin-response";

export interface CheckinApiResponse {
  success: boolean;
  message: string;
  data: CheckinResponseData;
}

/**
 * Gọi API check-in vé bằng QR code (base64)
 */
export const checkinTicket = async (
  qrCode: string
): Promise<CheckinApiResponse> => {
  const res = await instance.post<CheckinApiResponse>(
    "/api/checkin",
    {
      qr_code: qrCode,
    }
  );

  return res.data;
};
