import { NextPage } from "next"
import Layout from "rbgs/components/layout/Layout";
import * as React from 'react';
import UserDataComp from "rbgs/components/auth/UserDataComp";
import axios from "axios";

const UserData: NextPage = () => {
    const handleClick = () => {
        axios.post('/api/hola', {
            body: "hii"

        }).then((res) => {
            console.log('res', res)
        }).catch((err) => {
            console.log('err', err)
        })
    }
    return (
        <Layout>
            <div>
                <UserDataComp />
            </div>
            <button onClick={handleClick}>
                hi
            </button>
        </Layout>
    )
}

export default UserData;