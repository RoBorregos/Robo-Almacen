"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export default function RFIDPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const readToken = api.rfid.readToken.useMutation();

  const handleReadRFID = async () => {
    const result = await readToken.mutateAsync();
    setToken(result.token);
    setIsValid(result.isValid);
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={handleReadRFID} className="btn">
        Scan RFID
      </button>
      {token && (
        <p>Token: {token} - {isValid ? "Valid" : "Invalid"}</p>
      )}
    </div>
  );
}
