import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Form } from "reactstrap";
import { login } from "../../Api/UserApi";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "./ParticlesAuth";
import { toast } from "react-toastify";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import { loginLabels } from "../../Components/constants/common";
import {
  emailRegex,
  InputPlaceHolder,
  validationMessages,
} from "../../Components/constants/validation";
import { DASHBOARD } from "../../Api/ApiRoutes";

const Login = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required(loginLabels.Email))
        .matches(emailRegex, validationMessages.format(loginLabels.Email)),
      password: Yup.string().required(
        validationMessages.required(loginLabels.Password)
      ),
    }),
    onSubmit: async (values) => {
      setLoader(true);
      const payload = {
        email: values.email,
        password: values.password,
      };

      await login(payload)
        .then(async (res) => {
          if (res?.statusCode) {
            const token = res?.data?.token;
            const decodedToken = jwtDecode(token);
            const email = decodedToken.email;
            const role = decodedToken.role;
            const id = decodedToken.id;
            const authUser = {
              id,
              email,
              role,
              token,
            };

            localStorage.setItem("user", JSON.stringify(authUser));
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("role", role);
            localStorage.setItem("id", id);

            navigate(DASHBOARD);
            toast.success(res?.message);
          } else {
            toast.error(res?.message[0]);
          }
        })
        .catch((error) => {
          const errorMessage = Array.isArray(error?.response?.data?.message)
            ? error?.response?.data?.message[0]
            : error?.response?.data?.message;
          toast.error(errorMessage || error?.message);
        })
        .finally(() => setLoader(false));
    },
  });

  document.title = "Basic SignIn | Velzon - React Admin & Dashboard Template";
  return (
    <>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium">
                    Premium Admin & Dashboard Template
                  </p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">
                        Sign in to continue to Velzon.
                      </p>
                    </div>

                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="mb-3">
                          <BaseInput
                            name={loginLabels.email}
                            label={loginLabels.Email}
                            type={loginLabels.email}
                            placeholder={InputPlaceHolder(loginLabels.Email)}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email}
                            error={validation.errors.email}
                            touched={validation.touched.email}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                          <BaseInput
                            name={loginLabels.password}
                            label={loginLabels.Password}
                            type={loginLabels.password}
                            placeholder={InputPlaceHolder(loginLabels.Password)}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password}
                            error={validation.errors.password}
                            touched={validation.touched.password}
                            required
                          />
                        </div>

                        <div className="mt-4">
                          <BaseButton
                            color="success"
                            className="w-100"
                            type="submit"
                            loader={loader}
                            label="Sign In"
                          />
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                <div className="mt-4 text-center">
                  <p className="mb-0">
                    Don't have an account ?
                    <Link
                      to="/register"
                      className="fw-semibold text-primary text-decoration-underline"
                    >
                      Signup
                    </Link>
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </>
  );
};

const LoginWithRouter = withRouter(Login);
export default LoginWithRouter;
