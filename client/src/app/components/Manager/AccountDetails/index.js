/**
 *
 * AccountDetails
 *
 */

import React from "react";

import { Row, Col } from "reactstrap";

import { EMAIL_PROVIDER } from "../../../constants";
import UserRole from "../UserRole";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import { ROLES } from "../../../constants";
import SelectOption from "../../Common/SelectOption";

const branches = [
  { value: "Wollo", label: "Wollo" },
  { value: "Gerado", label: "Gerado" },
  { value: "Shasmene", label: "Shasmene" },
  { value: "Harar", label: "Harar" },
  { value: "Gojam", label: "Gojam" },
];

const AccountDetails = (props) => {
  const { user, accountChange, updateProfile } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    updateProfile();
  };

  const handleSelectChange = (selectedOption) => {
    accountChange("branchBelong", selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="account-details">
      <div className="info">
        <div className="desc">
          <p className="one-line-ellipsis mr-3">
            {user.provider === EMAIL_PROVIDER.Email ? (
              user.email
            ) : (
              <span className="provider-email">
                Logged in With {user.provider}
              </span>
            )}
          </p>
          <UserRole user={user} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              label={"First Name"}
              name={"firstName"}
              placeholder={"Please Enter Your First Name"}
              value={user.firstName ? user.firstName : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
          <Col xs="12" md="6">
            <Input
              type={"text"}
              label={"Last Name"}
              name={"lastName"}
              placeholder={"Please Enter Your Last Name"}
              value={user.lastName ? user.lastName : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>
          {/* TODO: update email feature to be added instead form change */}
          {/* <Col xs='12' md='6'>
            <Input
              type={'text'}
              label={'Email'}
              name={'email'}
              placeholder={'Please Enter Your Email'}
              value={user.email ? user.email : ''}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col> */}
          <Col xs="12" md="12">
            <Input
              type={"text"}
              label={"Phone Number"}
              name={"phoneNumber"}
              placeholder={"Please Enter Your Phone Number"}
              value={user.phoneNumber ? user.phoneNumber : ""}
              onInputChange={(name, value) => {
                accountChange(name, value);
              }}
            />
          </Col>

          {user.role === ROLES.Member && (
            <Col xs="12" md="12">
              <SelectOption
                label={"Branch"}
                options={branches}
                value={
                  branches.find(
                    (branch) => branch.value === user.branchBelong
                  ) || ""
                }
                handleSelectChange={handleSelectChange}
              />
            </Col>
          )}
        </Row>
        <hr />
        <div className="profile-actions">
          <Button type="submit" variant="secondary" text="Save changes" />
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
