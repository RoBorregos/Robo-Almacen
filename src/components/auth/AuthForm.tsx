import { Form, Formik, useFormikContext } from "formik";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Input from "rbgs/components/auth/Input";
import { api } from "rbgs/utils/api";
import { useCallback, useState } from "react";
import Avatar from "./Avatar";
import User from "./User";


interface FormProps {
    onSubmit: () => void;
    userId: string;
}

interface FormValues {
    major: string;
    semester: number;
    phone: string;
    area: string;
    image: string;
}

const AuthForm: React.FC<FormProps> = ({ onSubmit, userId }) => {
    const { mutateAsync: createUser } = api.userData.createUser.useMutation();
    const { mutateAsync: updateUser } = api.userData.updateUser.useMutation();
    const { mutateAsync: updateHasSeen } = api.userData.updateHasData.useMutation();
    
    const { data } = api.userData.hasData.useQuery({
        userId: userId,
    });


    const { data: userData } = api.userData.getUserData.useQuery({
        id: userId,
    });
    const [image, setImage] = useState<string>(userData?.image || 'Logo2.svg');



    const initialValues: FormValues = {
        major: userData?.major || '',
        semester: userData?.semester || 0,
        phone: userData?.phone || '',
        area: userData?.area || '',
        image: image,
    };

    const values = [
        { label: "Major", id: "major", placeholder: "ITC" },
        { label: "Semester", id: "semester", placeholder: "1" },
        { label: "Phone", id: "phone", placeholder: "" },
        { label: "Area", id: "area", placeholder: "Programming" },
    ]



    const handleUpload = (result: any) => {
        setImage(result?.info?.secure_url);
    }


    const handleCreate = async (values: FormValues) => {
        if (userId !== undefined) {

            if (data?.hasData) {

                const asd = await updateUser({
                    major: values.major, semester: Number(values.semester), phone: values.phone, area: values.area, image: image, userId: userId
                });

            } else {
                const asd = await createUser({
                    major: values.major, semester: Number(values.semester), phone: values.phone, area: values.area, image: image, userId: userId
                });
                const update = updateHasSeen({ userId: userId });

            }

        }
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={(handleUpload)}
                    uploadPreset="cerid1mq"
                >
                    <Avatar image={userData?.image || 'Logo2.svg'} edit />

                </CldUploadButton>
                <User />
            </div>


            <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => {
                    actions.setSubmitting(false);
                    handleCreate(values);
                    onSubmit();

                }}
            >
                <Form>


                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex flex-col items-end justify-center gap-4">
                            {values.map((value, id) => (
                                <Input key={id} label={value.label} id={value.id} placeholder={value.placeholder} />
                            ))}
                        </div>

                        <button className="rounded-md bg-blue-500 px-7 py-1 text-white self-end" type="submit">
                            Save
                        </button>
                    </div>
                </Form>
            </Formik>
        </>
    )
}
export default AuthForm;