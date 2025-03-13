import { type NextPage } from "next";
import AuthShowcase from "rbgs/components/auth/SAMPLE_AuthShowCase";
import Layout from "rbgs/components/layout/Layout";

const Showcase: NextPage = () => {
  return (
    <Layout>
      <AuthShowcase />
    </Layout>
  );
};

export default Showcase;
