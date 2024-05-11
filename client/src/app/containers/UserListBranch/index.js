// /*
//  *
//  * Users in Branch
//  *
//  */

// import React from "react";

// import { connect } from "react-redux";

// import actions from "../../actions";
// import { fetchProfile } from "../Account/actions";

// import SubPage from "../../components/Manager/SubPage";
// import NotFound from "../../components/Common/NotFound";

// import UserList from "../../components/Manager/UserList";
// import LoadingIndicator from "../../components/Common/LoadingIndicator";

// class UserListBranch extends React.PureComponent {
//   componentDidMount() {
//     this.props.fetchProfile();
//     this.props.fetchUsers();
//   }

//   render() {
//     const { user, users, isLoading } = this.props;
//     console.log(users);
//     let filteredUsers = [];
//     if (!isLoading) {
//       filteredUsers = users.length > 0 ? users : null;
//     }
//     // const filteredUsers = users.filter((user,index)=>)
//     return (
//       <>
//         {isLoading && <LoadingIndicator />}
//         <div className="users-dashboard">
//           <SubPage title="Users" />
//           {filteredUsers ? (
//             "I am runnig"
//           ) : (
//             <NotFound message="No users found." />
//           )}
//         </div>
//       </>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     user: state.account.user,
//     users: state.users.users,
//     isLoading: state.users.isLoading,
//   };
// };

// export default connect(mapStateToProps, actions)(UserListBranch);

/*
 *
 * Users
 *
 */

import React from "react";

import { connect } from "react-redux";

import actions from "../../actions";

import LoadingIndicator from "../../components/Common/LoadingIndicator";
import NotFound from "../../components/Common/NotFound";
import SearchResultMeta from "../../components/Manager/SearchResultMeta";
import SubPage from "../../components/Manager/SubPage";
import UserList from "../../components/Manager/UserList";
import UserSearch from "../../components/Manager/UserSearch";

class UserListBranch extends React.PureComponent {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    const { users, user: me, isLoading } = this.props;
    console.log(users);
    console.log(me);
    const filteredUsers = users.filter(
      (user) => user.branchBelong === me.merchant.branch
    );

    return (
      <div className="users-dashboard">
        <SubPage title="Users" />
        {isLoading && <LoadingIndicator />}
        {filteredUsers && (
          <>
            <SearchResultMeta label="users" count={filteredUsers.length} />
            <UserList users={filteredUsers} />
          </>
        )}
        {!isLoading && !filteredUsers && <NotFound message="No users found." />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.account.user,
    users: state.users.users,
    isLoading: state.users.isLoading,
  };
};

export default connect(mapStateToProps, actions)(UserListBranch);
