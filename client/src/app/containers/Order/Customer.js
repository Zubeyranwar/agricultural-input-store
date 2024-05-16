/*
 *
 * Customer
 *
 */

import React from "react";

import { connect } from "react-redux";

import actions from "../../actions";
import { ROLES } from "../../constants";
import SubPage from "../../components/Manager/SubPage";
import OrderList from "../../components/Manager/OrderList";
import OrderSearch from "../../components/Manager/OrderSearch";
import SearchResultMeta from "../../components/Manager/SearchResultMeta";
import NotFound from "../../components/Common/NotFound";
import LoadingIndicator from "../../components/Common/LoadingIndicator";
import Pagination from "../../components/Common/Pagination";

class Customer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
    };
  }

  componentDidMount() {
    this.props.fetchOrders();
  }

  handleOrderSearch = (e) => {
    if (e.value.length >= 2) {
      this.props.searchOrders({ name: "order", value: e.value });
      this.setState({
        search: e.value,
      });
    } else {
      this.setState({
        search: "",
      });
    }
  };

  handleOnPagination = (n, v) => {
    this.props.fetchOrders(v);
  };

  render() {
    const {
      history,
      user,
      orders,
      isLoading,
      searchedOrders,
      advancedFilters,
      searchOrders,
    } = this.props;
    const { search } = this.state;
    const isSearch = search.length > 0;
    console.log(orders)

    // const branchUserOrders = orders.filter((order)=>order._id === )


    const filteredOrders = search ? searchedOrders : orders;
    const displayPagination = advancedFilters.totalPages > 1;
    const displayOrders = filteredOrders && filteredOrders.length > 0;

    return (
      <div className="order-dashboard">
        <SubPage
          title="Customer Orders"
          actionTitle={(user.role !== ROLES.Admin) && "My Orders"}
          handleAction={() =>
            (user.role === ROLES.Merchant) &&
            history.push("/dashboard/orders")
          }
        >
          <OrderSearch
            onSearch={this.handleOrderSearch}
            onSearchSubmit={searchOrders}
          />
          {isLoading && <LoadingIndicator />}
          {displayOrders && (
            <>
              {!isSearch && displayPagination && (
                <Pagination
                  totalPages={advancedFilters.totalPages}
                  onPagination={this.handleOnPagination}
                />
              )}

              {/* <SearchResultMeta
                label="orders"
                count={isSearch ? filteredOrders.length : advancedFilters.count}
              /> */}
            <OrderList orders={filteredOrders} user={user} comefrom="customer"/>
            </>
          )}
          {!isLoading && !displayOrders && (
            <NotFound message="No orders found." />
          )}
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.account.user,
    orders: state.order.orders,
    searchedOrders: state.order.searchedOrders,
    isLoading: state.order.isLoading,
    advancedFilters: state.order.advancedFilters,
    isOrderAddOpen: state.order.isOrderAddOpen,
  };
};

export default connect(mapStateToProps, actions)(Customer);

// /*
//  *
//  * Customer
//  *
//  */

// import React from "react";

// import { connect } from "react-redux";

// import actions from "../../actions";
// import LoadingIndicator from "../../components/Common/LoadingIndicator";
// import NotFound from "../../components/Common/NotFound";
// import Pagination from "../../components/Common/Pagination";
// import OrderList from "../../components/Manager/OrderList";
// import OrderSearch from "../../components/Manager/OrderSearch";
// import SearchResultMeta from "../../components/Manager/SearchResultMeta";
// import SubPage from "../../components/Manager/SubPage";

// import axios from "axios";
// import { ROLES } from "../../constants";

// class Customer extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       search: "",
//       branchBelongInfo: {},
//     };
//   }

//   componentDidMount() {
//     this.props.fetchOrders();
//   }

//   async fetchBranchBelongInfo(order) {
//     try {
//       if (!order.user) {
//         return; // Skip fetching if order.user is undefined
//       }
//       const response = await axios.get(`/api/user/${order.user}`);
//       const { firstName, lastName, branchBelong } = response.data;
//       // Update branchBelongInfo state with the fetched branchBelong info
//       this.setState((prevState) => ({
//         branchBelongInfo: {
//           ...prevState.branchBelongInfo,
//           [order.user]: branchBelong,
//         },
//       }));
//     } catch (error) {
//       console.error("Error fetching user:", error);
//     }
//   }

//   // Fetch branchBelong info for each user when orders prop updates
//   componentDidUpdate(prevProps) {
//     if (prevProps.orders !== this.props.orders) {
//       this.props.orders.forEach((order) => {
//         this.fetchBranchBelongInfo(order);
//         console.log(order)
//       });
//     }
//   }

//   handleOrderSearch = (e) => {
//     if (e.value.length >= 2) {
//       this.props.searchOrders({ name: "order", value: e.value });
//       this.setState({
//         search: e.value,
//       });
//     } else {
//       this.setState({
//         search: "",
//       });
//     }
//   };

//   handleOnPagination = (n, v) => {
//     this.props.fetchOrders(v);
//   };

//   render() {
//     const {
//       history,
//       user,
//       orders,
//       isLoading,
//       searchedOrders,
//       advancedFilters,
//       searchOrders,
//     } = this.props;
//     const { search, branchBelongInfo } = this.state;
//     const isSearch = search.length > 0;

//     // const branchUserOrders = orders.filter((order)=>order._id === )

//     const filteredOrders = search ? searchedOrders : orders;
//     const displayPagination = advancedFilters.totalPages > 1;
//     const displayOrders = filteredOrders && filteredOrders.length > 0;

//     return (
//       <div className="order-dashboard">
//         <SubPage
//           title="Customer Orders"
//           actionTitle="My Orders"
//           handleAction={() =>
//             (user.role === ROLES.Admin || user.role === ROLES.Merchant) &&
//             history.push("/dashboard/orders")
//           }
//         >
//           <OrderSearch
//             onSearch={this.handleOrderSearch}
//             onSearchSubmit={searchOrders}
//           />
//           {isLoading && <LoadingIndicator />}
//           {displayOrders && (
//             <>
//               {!isSearch && displayPagination && (
//                 <Pagination
//                   totalPages={advancedFilters.totalPages}
//                   onPagination={this.handleOnPagination}
//                 />
//               )}

//               <SearchResultMeta
//                 label="orders"
//                 count={isSearch ? filteredOrders.length : advancedFilters.count}
//               />
//               {user.role === ROLES.Admin ? (
//                 <OrderList orders={filteredOrders} />
//               ) : (
//                 <OrderList
//                   orders={filteredOrders}
//                   branchBelongInfo={branchBelongInfo}
//                 />
//               )}
//             </>
//           )}
//           {!isLoading && !displayOrders && (
//             <NotFound message="No orders found." />
//           )}
//         </SubPage>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     user: state.account.user,
//     orders: state.order.orders,
//     searchedOrders: state.order.searchedOrders,
//     isLoading: state.order.isLoading,
//     advancedFilters: state.order.advancedFilters,
//     isOrderAddOpen: state.order.isOrderAddOpen,
//   };
// };

// export default connect(mapStateToProps, actions)(Customer);
