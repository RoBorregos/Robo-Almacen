import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "rbgs/components/layout/Layout";
import { api } from "rbgs/utils/api";
import { useState } from "react";

const Admin: NextPage = () => {
  const { data: sessionData } = useSession();

  if (sessionData?.user.role !== "ADMIN") {
    return <h1>Unauthorized</h1>;
  }

  return (
    <Layout>
      <GroupManagement />
    </Layout>
  );
};

export default Admin;

const GroupManagement = () => {
  const [groupName, setGroupName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCelda, setSelectedCelda] = useState("");

  const createGroup = api.group.createGroup.useMutation({
    onSuccess: () => groupsQuery.refetch(),
  });

  const addUserToGroup = api.group.assignUserToGroup.useMutation({
    onSuccess: () => usersQuery.refetch(),
  });

  const removeUserFromGroup = api.group.removeUserFromGroup.useMutation({
    onSuccess: () => usersQuery.refetch(),
  });

  const deleteGroup = api.group.deleteGroup.useMutation({
    onSuccess: () => {
      setSelectedGroup(""); // Reset selection
      groupsQuery.refetch(); // Refresh group list
    },
  });

  const assignCeldaToGroup = api.group.assignCeldaToGroup.useMutation({
    onSuccess: () => celdasInGroupQuery.refetch(),
  });

  const removeCeldaFromGroup = api.group.removeCeldaFromGroup.useMutation({
    onSuccess: () => celdasInGroupQuery.refetch(),
  });

  const groupsQuery = api.group.getGroups.useQuery();
  const usersQuery = api.group.getUsersInGroup.useQuery(
    { groupId: selectedGroup },
    { enabled: !!selectedGroup }
  );

  const celdasQuery = api.celda.getAll.useQuery();
  const celdasInGroupQuery = api.group.getCeldasInGroup.useQuery(
    { groupId: selectedGroup },
    { enabled: !!selectedGroup }
  );

  const users = api.userData.getAllUsers.useQuery();

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold text-white">Group Management</h1>

      {/* Create Group */}
      <div className="my-4">
        <input
          className="border p-2"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
        />
        <button
          className="ml-2 bg-blue-500 p-2 text-white"
          onClick={() => createGroup.mutate({ name: groupName })}
        >
          Create Group
        </button>
      </div>

      {/* Select Group & Delete Group */}
      <div className="my-4 flex items-center gap-2">
        <select
          className="border p-2"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="">Select Group</option>
          {groupsQuery.data?.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        {selectedGroup && (
          <button
            className="bg-red-500 p-2 text-white"
            onClick={() => deleteGroup.mutate({ groupId: selectedGroup })}
          >
            Delete Group
          </button>
        )}
      </div>

      {/* Add User to Group */}
      {selectedGroup && (
        <div className="my-4">
          <select
            className="border p-2"
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.data?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button
            className="ml-2 bg-green-500 p-2 text-white"
            onClick={() =>
              addUserToGroup.mutate({ groupId: selectedGroup, userId })
            }
          >
            Add User
          </button>
        </div>
      )}

      {/* Users in Selected Group */}
      {usersQuery.data && (
        <div className="my-4 text-white">
          <h2 className="text-lg font-bold">Users in Group</h2>
          <ul>
            {usersQuery.data.map((user) => (
              <li
                key={user.userId}
                className="flex items-center justify-between"
              >
                {user.user.name} ({user.user.email})
                <button
                  className="ml-2 bg-red-500 p-2"
                  onClick={() =>
                    removeUserFromGroup.mutate({
                      groupId: selectedGroup,
                      userId: user.user.id,
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assign Celda to Group */}
      {selectedGroup && (
        <div className="my-4">
          <select
            className="border p-2"
            onChange={(e) => setSelectedCelda(e.target.value)}
          >
            <option value="">Select Celda</option>
            {celdasQuery.data?.map((celda: any) => (
              <option key={celda.id} value={celda.id}>
                {celda.name} (Row: {celda.row}, Column: {celda.column})
              </option>
            ))}
          </select>
          <button
            className="ml-2 bg-green-500 p-2 text-white"
            onClick={() =>
              assignCeldaToGroup.mutate({
                groupId: selectedGroup,
                celdaId: selectedCelda,
              })
            }
          >
            Assign Celda
          </button>
        </div>
      )}

      {/* Celdas in Selected Group */}
      {celdasInGroupQuery.data && (
        <div className="my-4 text-white">
          <h2 className="text-lg font-bold">Celdas in Group</h2>
          <ul>
            {celdasInGroupQuery.data.map((celda: any) => (
              <li
                key={celda.celdaId}
                className="flex items-center justify-between"
              >
                {celda.celda.name} (Row: {celda.celda.row}, Column:{" "}
                {celda.celda.column})
                <button
                  className="ml-2 bg-red-500 p-2"
                  onClick={() =>
                    removeCeldaFromGroup.mutate({
                      groupId: selectedGroup,
                      celdaId: celda.celdaId,
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
