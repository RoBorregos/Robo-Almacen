import { api } from "rbgs/utils/api";
import { useState } from "react";
import { toast } from "react-toastify";

export const AssignUserData = () => {
  const { data: users } = api.userData.getUserOverviews.useQuery();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserRFID, setSelectedUserRFID] = useState("");
  const context = api.useUtils();
  const rfidMutation = api.userData.updateUserRFID.useMutation({
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

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold">Modify User RFID</h1>
      <div className="flex flex-row gap-x-3 gap-y-3">
        <select
          className="border p-2 text-black"
          value={selectedUser}
          onChange={(e) => {
            setSelectedUser(e.target.value);
            setSelectedUserRFID(
              users?.find((user) => user.id === e.target.value)?.RFID || ""
            );
          }}
        >
          <option value="">{users ? "Select User" : "Loading..."}</option>
          {users?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {selectedUser !== "" && (
          <input
            className="border p-2 text-black"
            value={selectedUserRFID}
            onChange={(e) => setSelectedUserRFID(e.target.value)}
            placeholder="RFID"
          />
        )}
        {selectedUser !== "" && (
          <button
            className="bg-blue-500 p-2 text-white"
            onClick={() => {
              rfidMutation.mutate({
                userId: selectedUser,
                RFID: selectedUserRFID,
              });
            }}
          >
            Modify RFID
          </button>
        )}
      </div>
    </div>
  );
};
