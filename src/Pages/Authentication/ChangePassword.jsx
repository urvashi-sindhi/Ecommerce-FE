import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
import withRouter from "../../Components/Common/withRouter";

import * as Yup from "yup";
import { useFormik } from "formik";
import { RiLockPasswordLine } from "react-icons/ri";

import { changePassword } from "../../Api/LoginApi";
import {
  InputPlaceHolder,
  passwordRegex,
  validationMessages,
} from "../../Components/constants/validation";
import { loginLabels } from "../../Components/constants/common";
import { toast } from "react-toastify";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";

const ChangePassword = withRouter(() => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailValue = localStorage.getItem("email");
    setEmail(emailValue);
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(
        validationMessages.required(loginLabels.CurrentPassword)
      ),
      newPassword: Yup.string()
        .min(8, validationMessages.passwordLength(loginLabels.Password, 8))
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity(loginLabels.Password)
        )
        .required(validationMessages.required(loginLabels.Password)),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref(loginLabels.NewPassword), ""],
          validationMessages.passwordsMatch(
            loginLabels.Password,
            loginLabels.confirmPassword
          )
        )
        .required(validationMessages.required(loginLabels.confirmPassword)),
    }),
    onSubmit: async (values) => {
      setLoader(true);
      try {
        const payload = {
          email: email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        };
        const res = await changePassword(payload);
        if (res?.statusCode) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message ?? error?.message);
      } finally {
        setLoader(false);
      }
    },
  });

  document.title = "Change Password";
  return (
    <div className="page-content">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={8} xl={6}>
            <Card className="">
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Change Password</h5>
                  <RiLockPasswordLine
                    className="avatar-xl text-primary"
                    size={50}
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
                      disabled={true}
                      value={email}
                    />
                  </div>

                  <div className="mb-3">
                    <BaseInput
                      name={loginLabels.currentPassword}
                      label={loginLabels.CurrentPassword}
                      type={loginLabels.password}
                      placeholder={InputPlaceHolder(
                        loginLabels.CurrentPassword
                      )}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.currentPassword}
                      error={validation.errors.currentPassword}
                      touched={validation.touched.currentPassword}
                      required
                      invalid={
                        validation.touched.currentPassword &&
                        validation.errors.currentPassword
                      }
                    />
                    <FormFeedback>
                      {validation.errors.currentPassword}
                    </FormFeedback>
                  </div>

                  <Row>
                    <Col xs="12" sm="6">
                      <div className="mb-3">
                        <BaseInput
                          name={loginLabels.NewPassword}
                          label={loginLabels.Password}
                          type={loginLabels.password}
                          placeholder={InputPlaceHolder(loginLabels.Password)}
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
                    </Col>
                    <Col xs="12" sm="6">
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
                    </Col>
                  </Row>

                  <div className="mt-4">
                    <BaseButton
                      color="success"
                      className="w-100"
                      type="submit"
                      disabled={loader}
                      loader={loader}
                      label="Change Password"
                    />
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default ChangePassword;
