import { NextPage } from "next"
import Layout from "rbgs/components/layout/Layout";
import * as React from 'react';
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps } from 'formik';
import User from "rbgs/components/auth/User";
import { useSession } from "next-auth/react";
import AuthForm from "rbgs/components/auth/AuthForm";
import View from "rbgs/components/auth/View";
import { api } from "rbgs/utils/api";


type Variant = "EDIT" | "VIEW";

interface FormValues {
    major: string;
    semester: number;
    phone: string;
    area: string;
    image: string;
}

const userData: NextPage = () => {
    const { mutateAsync } = api.userData.createUser.useMutation();
    const [variant, setVariant] = React.useState<Variant>("VIEW");
    const { data: sessionData } = useSession();
    const userId = sessionData?.user.id;

    
    

    const toggleVariant = React.useCallback(() => {
        if (variant == 'VIEW') {
            setVariant('EDIT');
        } else {
            setVariant('VIEW');
        }
    }, [variant]);




    return (
        <Layout>
            <div>

                {variant == 'VIEW' ? (
                    <View handleClick={() => toggleVariant()} userId={userId || "-1"} />
                ) : (
                    <AuthForm onSubmit={() => toggleVariant()} userId={userId || "-1"} />
                )}

            </div>
        </Layout>
    )
}

export default userData;