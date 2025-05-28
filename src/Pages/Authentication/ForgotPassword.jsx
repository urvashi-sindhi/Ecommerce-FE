import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

import * as Yup from "yup";
import { useFormik } from "formik";
import { RiMailSendLine } from "react-icons/ri";

// import images
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "./ParticlesAuth";
import { forgotPassword, verifyEmail } from "../../Api/UserApi";
import {
  emailRegex,
  InputPlaceHolder,
  otpRegex,
  otpTypeRegex,
  passwordRegex,
  validationMessages,
} from "../../Components/constants/validation";
import { loginLabels } from "../../Components/constants/common";
import { toast } from "react-toastify";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import { LOGIN } from "../../Routes/commonRoutes";

const ForgetPasswordPage = withRouter(() => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (otpTypeRegex.test(value)) {
      validation.handleChange(e);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object(
      isOtpSent
        ? {
            otp: Yup.string()
              .required(validationMessages.required(loginLabels.OTP))
              .min(6, validationMessages.minLength(loginLabels.OTP, 6))
              .max(6, validationMessages.maxLength(loginLabels.OTP, 6))
              .matches(otpRegex, validationMessages.otpFormat(loginLabels.OTP)),
            newPassword: Yup.string()
              .min(
                8,
                validationMessages.passwordLength(loginLabels.newPassword, 8)
              )
              .matches(
                passwordRegex,
                validationMessages.passwordComplexity(loginLabels.newPassword)
              )
              .required(validationMessages.required(loginLabels.newPassword)),
            confirmPassword: Yup.string()
              .oneOf(
                [Yup.ref(loginLabels.NewPassword), ""],
                validationMessages.passwordsMatch(
                  loginLabels.newPassword,
                  loginLabels.confirmPassword
                )
              )
              .required(
                validationMessages.required(loginLabels.confirmPassword)
              ),
          }
        : {
            email: Yup.string()
              .required(validationMessages.required(loginLabels.Email))
              .matches(
                emailRegex,
                validationMessages.format(loginLabels.Email)
              ),
          }
    ),
    onSubmit: async (values) => {
      setLoader(true);
      if (!isOtpSent) {
        try {
          const payload = { email: values.email };
          const res = await verifyEmail(payload);
          if (res?.statusCode) {
            toast.success(res?.message);
            setIsOtpSent(true);
          } else {
            toast.error(res?.message[0]);
          }
        } catch (error) {
          const errorMessage = Array.isArray(error?.response?.data?.message)
            ? error?.response?.data?.message[0]
            : error?.response?.data?.message;
          toast.error(errorMessage || error?.message);
        } finally {
          setLoader(false);
        }
      } else {
        try {
          const payload = {
            email: values.email,
            otp: +values.otp,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          };
          const res = await forgotPassword(payload);
          if (res?.statusCode) {
            toast.success(res.message);
            navigate(LOGIN);
          } else {
            toast.error(res.message);
          }
        } catch (error) {
          const errorMessage = Array.isArray(error?.response?.data?.message)
            ? error?.response?.data?.message[0]
            : error?.response?.data?.message;
          toast.error(errorMessage || error?.message);
        } finally {
          setLoader(false);
        }
      }
    },
  });

  document.title = "Reset Password";
  return (
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
                    <h5 className="text-primary">Forgot Password?</h5>
                    <p className="text-muted">Reset your password</p>
                    <RiMailSendLine
                      className="avatar-xl text-primary"
                      style={{ width: "50px", height: "80px" }}
                    />
                  </div>
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
                        disabled={isOtpSent}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                        error={validation.errors.email}
                        touched={validation.touched.email}
                        required
                        invalid={
                          validation.touched.email && validation.errors.email
                        }
                      />
                      <FormFeedback>{validation.errors.email}</FormFeedback>
                    </div>
                    {isOtpSent && (
                      <>
                        <div className="mb-3">
                          <BaseInput
                            name={loginLabels.otp}
                            label={loginLabels.OTP}
                            placeholder={InputPlaceHolder(loginLabels.OTP)}
                            maxLength={6}
                            onChange={handleOtpChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.otp}
                            error={validation.errors.otp}
                            touched={validation.touched.otp}
                            required
                            invalid={
                              validation.touched.otp && validation.errors.otp
                            }
                          />
                          <FormFeedback>{validation.errors.otp}</FormFeedback>
                        </div>
                        <div className="mb-3">
                          <BaseInput
                            name={loginLabels.NewPassword}
                            label={loginLabels.newPassword}
                            type={loginLabels.password}
                            placeholder={InputPlaceHolder(
                              loginLabels.newPassword
                            )}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.newPassword}
                            error={validation.errors.newPassword}
                            touched={validation.touched.newPassword}
                            required
                            invalid={
                              validation.touched.newPassword &&
                              validation.errors.newPassword
                            }
                          />
                          <FormFeedback>
                            {validation.errors.newPassword}
                          </FormFeedback>
                        </div>
                        <div className="mb-3">
                          <BaseInput
                            name={loginLabels.ConfirmPassword}
                            label={loginLabels.confirmPassword}
                            type={loginLabels.password}
                            placeholder={InputPlaceHolder(
                              loginLabels.confirmPassword
                            )}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirmPassword}
                            error={validation.errors.confirmPassword}
                            touched={validation.touched.confirmPassword}
                            required
                            invalid={
                              validation.touched.confirmPassword &&
                              validation.errors.confirmPassword
                            }
                          />
                          <FormFeedback>
                            {validation.errors.confirmPassword}
                          </FormFeedback>
                        </div>
                      </>
                    )}

                    <div className="mt-4">
                      <BaseButton
                        color="success"
                        className="w-100"
                        type="submit"
                        disabled={loader}
                        loader={loader}
                        label={isOtpSent ? "Reset Password" : "Send OTP"}
                      />
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="text-center">
              <p className="text-muted">
                Remember your password?
                <Link
                  to={LOGIN}
                  className="fw-semibold text-primary text-decoration-underline"
                >
                  Login
                </Link>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
});

export default ForgetPasswordPage;
