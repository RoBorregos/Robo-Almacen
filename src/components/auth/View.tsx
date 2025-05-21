import { api } from "rbgs/utils/api";
import ViewElement from "./ViewElement";
import Avatar from "./Avatar";
import User from "./User";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ViewProps {
  handleClick: () => void;
  userId: string;
}

const View: React.FC<ViewProps> = ({ handleClick, userId }) => {
  const { data } = api.userData.getUserData.useQuery({
    id: userId,
  });

  const [currentRfid, setCurrentRfid] = useState("");
  const [lastRead, setLastRead] = useState("");
  const context = api.useUtils();
  const { data: userRfid } = api.userData.getUserRfid.useQuery();

  const rfidMutation = api.userData.updateOwnRFID.useMutation({
    onSuccess: () => {
      toast.success("Rfid modified!", {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      void context.userData.getUserOverviews.invalidate();
      void context.userData.getUserRfid.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });

  const handleSaveRfid = () => {
    rfidMutation.mutate({
      RFID: currentRfid,
    });
  };

  const rfidMutationRead = api.rfid.getRfid.useMutation({
    onSuccess: (data) => {
      setLastRead(data);
      toast.dismiss();
      toast.success(`RFID Read: ${data}`, {
        position: "top-center",
        autoClose: 5000,
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "Error reading RFID");
    },
  });

  const handleReadRfid = () => {
    toast.info("Reading RFID...", {
      position: "top-center",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    rfidMutationRead.mutate();
  };

  useEffect(() => {
    if (userRfid?.RFID) {
      setCurrentRfid(userRfid.RFID);
    }
  }, [userRfid?.RFID]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar image={data?.image || "Logo2.svg"} />
      <User />
      <div className="mt-4 flex flex-col items-start justify-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <label htmlFor="rfid" className="text-sm font-medium text-gray-200">
            RFID
          </label>
          <div className="flex flex-row gap-2">
            <input
              id="rfid"
              className="w-full rounded-md border p-2 text-black"
              value={currentRfid}
              onChange={(e) => setCurrentRfid(e.target.value)}
              placeholder="RFID"
            />
            <button
              className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
              onClick={handleReadRfid}
            >
              Read
            </button>
            <button
              className="rounded-md bg-blue-500 px-7 py-1 text-white hover:bg-blue-600"
              onClick={handleSaveRfid}
            >
              Save RFID
            </button>
          </div>

          {lastRead !== "" && (
            <p className="text-sm text-gray-400">Last RFID Read: {lastRead}</p>
          )}
        </div>
        {/* <ViewElement label="Major" value={data?.major || ""} />
        <ViewElement label="Semester" value={data?.semester || 0} />
        <ViewElement label="Phone" value={data?.phone || ""} />
        <ViewElement label="Area" value={data?.area || ""} /> */}
        {/* <div className="mt-2 flex w-full flex-row justify-between">
          <button
            className="rounded-md bg-blue-500 px-7 py-1 text-white hover:bg-blue-600"
            onClick={handleClick}
          >
            Edit
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default View;
