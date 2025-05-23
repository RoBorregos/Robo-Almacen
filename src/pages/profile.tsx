import { NextPage } from "next";
import Layout from "rbgs/components/layout/Layout";
import * as React from "react";
import UserDataComp from "rbgs/components/auth/UserDataComp";
import axios from "axios";

const UserData: NextPage = () => {
  return (
    <Layout>
      <div>
        <UserDataComp />
      </div>
    </Layout>
  );
};

export default UserData;
