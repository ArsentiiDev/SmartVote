import { useRef, useState } from "react";
import { getProviders, getSession, signIn } from "next-auth/react";
import React from "react";
import { Button } from "@react-email/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Router, useRouter } from "next/router";
import axios from "axios";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const Signin = ({ providers }: {providers:any}) => {
  const formikRef = useRef(null);
  const [authType, setAuthType] = useState<any>("Login");
  const oppAuthType = {
    Login: "Register",
    Register: "Login",
  };
  const router = useRouter();

  const registerUser = async (values: any) => {
    console.log(values)
    const res = await axios
    .post(
      "/api/register",
      { username: values.username, email: values.email, password: values.password },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (res: any) => {
        const {email, password} = res.data.object
      await loginUser({email: email, password: password});
      redirectToHome();
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(res);
  }

  const redirectToHome =() => {
    const { pathname } = router
    if (pathname.includes('/auth')) router.push("/")
  }

  const loginUser = async (values:any) => {
    const res:any = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: `${window.location.origin}`
      });
      res.error ? console.log(res.error) : redirectToHome()
  }

  const handleSubmit = async (values:any) => {
    authType === "Login" ? loginUser(values): registerUser(values)
  };

  return (
    <div className="flex items-center min-h-screen p-4 bg-background border lg:justify-center">
      <div className="flex flex-col overflow-hidden rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md border border-main-primary">
        <div className="p-4 py-6 bg-blue-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
          <div className="my-3 text-4xl font-bold tracking-wider text-center">
            <a href="#">Voting App</a>
          </div>
          <p className="flex flex-col items-center justify-center mt-10 text-center">
            <span>
              {authType === "Login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <a
              href="#"
              className="underline"
              onClick={() => setAuthType(oppAuthType[authType as "Login" | "Register"])}
            >
              {oppAuthType[authType as "Login" | "Register"]}
            </a>
          </p>
          <p className="mt-6 text-sm text-center text-gray-300">
            Read our <a href="#" className="underline">terms</a> and{" "}
            <a href="#" className="underline">conditions</a>
          </p>
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700 text-center">{authType}</h3>
          <Formik
            innerRef={formikRef}
            initialValues={{
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={
              authType === "Register" ? validationSchema : validationSchema.omit(["confirmPassword"])
            }
            onSubmit={handleSubmit}
          >
            <Form className="flex flex-col space-y-5">
              {authType === "Register" && (
                <div className="flex flex-col space-y-1">
                  <label htmlFor="username" className="text-sm font-semibold text-gray-500">Username</label>
                  <Field
                    type="text"
                    id="username"
                    autoFocus
                    className="px-4 py-2 transition duration-300 bg-background border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 text-neutral-primary"
                    name="username"
                  />
                  <ErrorMessage name="username" component="div" className="text-status-rejected" />
                </div>
              )}
              <div className="flex flex-col space-y-1">
                <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
                <Field
                  type="email"
                  id="email"
                  autoFocus
                  className="px-4 py-2 transition duration-300 bg-background border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 text-neutral-primary"
                  name="email"
                />
                <ErrorMessage name="email" component="div" className="text-status-rejected" />
              </div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-500">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline focus:text-blue-800">Forgot Password?</a>
                </div>
                <Field
                  type="password"
                  id="password"
                  className="px-4 py-2 rounded-md border-neutral-tertiary bg-background cursor-pointer text-sm mt-2 tracking-[0.075em] font-light transition duration-300 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 text-neutral-primary"
                  name="password"
                />
                <ErrorMessage name="password" component="div" className=" text-status-rejected" />
              </div>
              {authType === "Register" && (
                <div className="flex flex-col space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-500">Confirm Password</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    className="px-4 py-2 rounded-md border-neutral-tertiary bg-background cursor-pointer text-sm mt-2 tracking-[0.075em] font-light transition duration-300 border border-gray-300 focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200 text-neutral-primary"
                    name="confirmPassword"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-status-rejected" />
                </div>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow bg-main-primary hover:bg-hover focus:outline-none focus:ring-blue-200 focus:ring-4"
                >
                  Log in
                </button>
              </div>
              <div className="flex flex-col space-y-5">
                <span className="flex items-center justify-center space-x-2">
                  <span className="h-px bg-gray-400 w-14"></span>
                  <span className="font-normal text-gray-500">OR</span>
                  <span className="h-px bg-gray-400 w-14"></span>
                </span>
                <div className="flex flex-col space-y-4">
                  {providers &&
                    Object.values(providers).map((provider:any) => {
                      if (provider.name !== "Credentials") {
                        return (
                          <div key={provider.name} style={{ marginBottom: 0 }}>
                            <Button
                              href="#"
                              className="w-full flex items-center justify-center px-4 py-4 space-x-2 transition-colors duration-300 border border-gray-800 rounded-md group hover:bg-gray-800 focus:outline-none"
                              onClick={() => signIn(provider.id)}
                            >
                              <span className="text-md tracking-wider">
                                Sign in with {provider.name}
                              </span>
                            </Button>
                          </div>
                        );
                      }
                    })}
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signin;

export async function getServerSideProps(context:any) {
  const { req } = context;
  const session = await getSession({ req });
  const providers = await getProviders();
  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }
  return {
    props: {
      providers,
    },
  };
}
