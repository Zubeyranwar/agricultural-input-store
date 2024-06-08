/**
 *
 * UserList
 *
 */

import React from "react";

import { formatDate } from "../../../utils/date";
import { ROLES } from "../../../constants";
import UserRole from "../UserRole";

const UserList = (props) => {
  const { users } = props;
  console.log(users);

  return (
    <div className="u-list">
      {users.map((user, index) => (
        <div key={index} className="mt-3 px-4 py-3 user-box">
          <label className="text-black">Name</label>
          <p className="fw-medium">
            {user?.firstName ? `${user?.firstName} ${user?.lastName}` : "N/A"}
          </p>
          <label className="text-black">Email</label>
          <p>{user?.email ?? "-"}</p>
          {user.role === ROLES.Member && (
            <>
              <label className="text-black">Branch</label>
              <p>{user?.branchBelong ?? "-"}</p>
            </>
          )}
          <label className="text-black">Provider</label>
          <p>{user?.provider}</p>
          <label className="text-black">Account Created</label>
          <p>{formatDate(user?.created)}</p>
          <label className="text-black">Role</label>
          <p className="mb-0">
            <UserRole user={user} className="d-inline-block mt-2" />
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
