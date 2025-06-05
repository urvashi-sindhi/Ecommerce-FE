import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import defaultAvatar from "../../assets/images/users/user-dummy-img.jpg";
import {
  listOfCity,
  listOfCountry,
  listOfState,
  viewProfile,
  updateProfile,
  uploadFile,
} from "../../Api/LoginApi";
import { baseURLForImage } from "../../Api/AuthApi";
import { toast } from "react-toastify";
import BaseInput from "../../Components/Base/BaseInput";
import BaseButton from "../../Components/Base/BaseButton";
import BaseSelect from "../../Components/Base/BaseSelect";
import { userProfileLabels } from "../../Components/constants/common";
import {
  validationMessages,
  InputPlaceHolder,
  numberRegex,
} from "../../Components/constants/validation";
import { BiPencil, BiX } from "react-icons/bi";
import BaseRadio from "../../Components/Base/BaseRadio";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: profileData?.name || "",
      email: profileData?.email || "",
      phone_number: profileData?.phone_number || "",
      gender: profileData?.gender || "",
      role: profileData?.role || "",
      country_id: profileData?.address?.country_id || "",
      state_id: profileData?.address?.state_id || "",
      city_id: profileData?.address?.city_id || "",
      address_label: profileData?.address?.label || "home",
      address_line1: profileData?.address?.address_line1 || "",
      address_line2: profileData?.address?.address_line2 || "",
      postal_code: profileData?.address?.postal_code || "",
      profile_image: profileData?.profile_image
        ? `${baseURLForImage}${profileData.profile_image}`
        : defaultAvatar,
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      email: Yup.string().email(
        validationMessages.format(userProfileLabels.Email)
      ),
      phone_number: Yup.string()
        .matches(
          numberRegex,
          validationMessages.otpFormat(userProfileLabels.PhoneNo)
        )
        .min(10, validationMessages.minLength(userProfileLabels.PhoneNo, 10)),
      gender: Yup.string(),
      country_id: Yup.number(),
      state_id: Yup.number(),
      city_id: Yup.number(),
      address_label: Yup.string(),
      address_line1: Yup.string(),
      address_line2: Yup.string(),
      postal_code: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsUpdating(true);
      try {
        const updateData = {
          name: values.name,
          phone_number: values.phone_number,
          gender: values.gender,
          address: {
            label: values.address_label,
            address_line1: values.address_line1,
            address_line2: values.address_line2,
            postal_code: values.postal_code,
            country_id: +values.country_id,
            state_id: +values.state_id,
            city_id: +values.city_id,
          },
        };

        if (imageUrl) {
          updateData.profile_image = imageUrl.filename;
        }

        const res = await updateProfile(updateData);
        const latestProfileResponse = await viewProfile();
        setProfileData(latestProfileResponse.data);
        setIsEditing(false);
        setImageUrl(null);
        toast.success(res.message);
      } catch (err) {
        toast.error(err.response?.data?.message);
      } finally {
        setIsUpdating(false);
      }
    },
  });

  const loadInitialDropdownData = async (profile) => {
    try {
      if (countryData.length === 0) {
        const countryResponse = await listOfCountry();
        setCountryData(countryResponse?.data || []);
      }

      if (profile?.address?.country_id) {
        setLoadingStates(true);
        try {
          const stateResponse = await listOfState(profile.address.country_id);
          setStateData(stateResponse?.data || []);

          if (profile?.address?.state_id) {
            setLoadingCities(true);
            try {
              const cityResponse = await listOfCity(profile.address.state_id);
              setCityData(cityResponse?.data || []);
            } catch (err) {
              toast.error(err.message);
            } finally {
              setLoadingCities(false);
            }
          }
        } catch (err) {
          toast.error(err.data.message);
        } finally {
          setLoadingStates(false);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCountryChange = async (event) => {
    const countryId = event.target.value;
    validation.setFieldValue(userProfileLabels.country_id, countryId);
    validation.setFieldValue(userProfileLabels.state_id, "");
    validation.setFieldValue(userProfileLabels.city_id, "");
    setStateData([]);
    setCityData([]);

    if (countryId) {
      setLoadingStates(true);
      await listOfState(countryId)
        .then((res) => {
          setStateData(res?.data || []);
        })
        .catch((err) => toast.error(err.data.message))
        .finally(() => setLoadingStates(false));
    }
  };

  const handleStateChange = async (event) => {
    const stateId = event.target.value;
    validation.setFieldValue(userProfileLabels.state_id, stateId);
    validation.setFieldValue(userProfileLabels.city_id, "");
    setCityData([]);

    if (stateId) {
      setLoadingCities(true);
      await listOfCity(stateId)
        .then((res) => {
          setCityData(res?.data || []);
        })
        .catch((err) => toast.error(err.data.message))
        .finally(() => setLoadingCities(false));
    }
  };

  const handleCityChange = (event) => {
    validation.setFieldValue(userProfileLabels.city_id, event.target.value);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    validation.resetForm();
    setImageUrl(null);
    setStateData([]);
    setCityData([]);

    if (profileData?.address?.country_id) {
      loadInitialDropdownData(profileData);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(validationMessages.imageValidation);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(validationMessages.imageSizeValidation);
      return;
    }

    setUploadingImage(true);
    try {
      const uploadResponse = await uploadFile(file);

      if (
        uploadResponse.data &&
        Array.isArray(uploadResponse.data) &&
        uploadResponse.data.length > 0
      ) {
        const filename = uploadResponse.data[0];
        const fullImageUrl = `${baseURLForImage}${filename}`;

        setImageUrl({
          url: fullImageUrl,
          filename: filename,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setUploadingImage(false);
    }
  };

  document.title = userProfileLabels.Profile;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const profileResponse = await viewProfile();
        const profile = profileResponse.data;
        setProfileData(profile);

        await loadInitialDropdownData(profile);
      } catch (err) {
        toast.error(err.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("user")) {
      fetchInitialData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        {!isEditing && (
          <div className="d-flex justify-content-end pb-3">
            <BaseButton
              color="primary"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              label={userProfileLabels.EditProfile}
            />
          </div>
        )}
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex">
                    <div className="mx-3 image position-relative">
                      <div
                        className="profile-image-wrapper"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <img
                          src={
                            imageUrl?.url ||
                            validation.values.profile_image ||
                            defaultAvatar
                          }
                          onError={(e) => (e.target.src = defaultAvatar)}
                          alt="Profile"
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                        {isEditing && (
                          <>
                            {isHovered && imageUrl && (
                              <div className="image-overlay">
                                <button
                                  className="cancel-image-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setImageUrl(null);
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = "";
                                    }
                                  }}
                                  title="Cancel image upload"
                                >
                                  <BiX size={24} />
                                </button>
                              </div>
                            )}
                            <div className="position-absolute bottom-0 end-0">
                              <input
                                type={userProfileLabels.file}
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden-file-input"
                              />
                              <BaseButton
                                color="primary"
                                size="sm"
                                className="rounded-circle"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                                loader={uploadingImage}
                              >
                                {!uploadingImage && <BiPencil />}
                              </BaseButton>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{validation.values.name}</h5>
                        <p className="mb-1">
                          Email Id: {validation.values.email}
                        </p>
                        <p className="mb-0">Id No: #{profileData?.id || ""}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title mb-4">User Details</h4>

        <Card>
          <CardBody>
            <Form
              className="form-horizontal"
              onSubmit={validation.handleSubmit}
            >
              <Row className="mb-3">
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.name}
                    type={userProfileLabels.text}
                    label={userProfileLabels.Name}
                    placeholder={InputPlaceHolder(userProfileLabels.name)}
                    value={validation.values.name}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.name && !!validation.errors.name
                    }
                    error={validation.errors.name}
                    touched={validation.touched.name}
                  />
                </Col>
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.phone_number}
                    type={userProfileLabels.text}
                    label={userProfileLabels.PhoneNo}
                    placeholder={InputPlaceHolder(
                      userProfileLabels.phone_number
                    )}
                    value={validation.values.phone_number}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.phone_number &&
                      !!validation.errors.phone_number
                    }
                    error={validation.errors.phone_number}
                    touched={validation.touched.phone_number}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.email}
                    value={validation.values.email}
                    disabled={true}
                    type={userProfileLabels.email}
                    label={userProfileLabels.Email}
                  />
                </Col>
                <Col lg="6">
                  <BaseRadio
                    name={userProfileLabels.gender}
                    label={userProfileLabels.Gender}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                    value={validation.values.gender}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    error={validation.errors.gender}
                    touched={validation.touched.gender}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg="4">
                  <BaseSelect
                    name={userProfileLabels.country_id}
                    label={userProfileLabels.Country}
                    value={validation.values.country_id}
                    onChange={handleCountryChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.country_id &&
                      !!validation.errors.country_id
                    }
                    error={validation.errors.country_id}
                    touched={validation.touched.country_id}
                    options={countryData}
                    defaultText={userProfileLabels.SelectCountry}
                    labelKey="country_name"
                  />
                </Col>
                <Col lg="4">
                  <BaseSelect
                    name={userProfileLabels.state_id}
                    label={userProfileLabels.State}
                    value={validation.values.state_id}
                    onChange={handleStateChange}
                    onBlur={validation.handleBlur}
                    disabled={
                      !isEditing ||
                      loading ||
                      isUpdating ||
                      !validation.values.country_id
                    }
                    invalid={
                      validation.touched.state_id &&
                      !!validation.errors.state_id
                    }
                    error={validation.errors.state_id}
                    touched={validation.touched.state_id}
                    options={stateData}
                    defaultText={userProfileLabels.SelectState}
                    loading={loadingStates}
                    loadingText={userProfileLabels.LoadingStates}
                    labelKey="state_name"
                  />
                </Col>
                <Col lg="4">
                  <BaseSelect
                    name={userProfileLabels.city_id}
                    label={userProfileLabels.City}
                    value={validation.values.city_id}
                    onChange={handleCityChange}
                    onBlur={validation.handleBlur}
                    disabled={
                      !isEditing ||
                      loading ||
                      isUpdating ||
                      !validation.values.state_id
                    }
                    invalid={
                      validation.touched.city_id && !!validation.errors.city_id
                    }
                    error={validation.errors.city_id}
                    touched={validation.touched.city_id}
                    options={cityData}
                    defaultText={userProfileLabels.SelectCity}
                    loading={loadingCities}
                    loadingText={userProfileLabels.LoadingCities}
                    labelKey="city_name"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.address_label}
                    type="text"
                    label={userProfileLabels.AddressType}
                    placeholder={InputPlaceHolder(
                      userProfileLabels.address_label
                    )}
                    value={validation.values.address_label}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.address_label &&
                      !!validation.errors.address_label
                    }
                    error={validation.errors.address_label}
                    touched={validation.touched.address_label}
                  />
                </Col>
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.address_line1}
                    type="textarea"
                    label={userProfileLabels.AddressLine1}
                    placeholder={InputPlaceHolder(
                      userProfileLabels.address_line1
                    )}
                    value={validation.values.address_line1}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.address_line1 &&
                      !!validation.errors.address_line1
                    }
                    error={validation.errors.address_line1}
                    touched={validation.touched.address_line1}
                    rows={3}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.address_line2}
                    type="textarea"
                    label={userProfileLabels.AddressLine2}
                    placeholder={InputPlaceHolder(
                      userProfileLabels.address_line2
                    )}
                    value={validation.values.address_line2}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.address_line2 &&
                      !!validation.errors.address_line2
                    }
                    error={validation.errors.address_line2}
                    touched={validation.touched.address_line2}
                    rows={3}
                  />
                </Col>
                <Col lg="6">
                  <BaseInput
                    name={userProfileLabels.postal_code}
                    type={userProfileLabels.text}
                    label={userProfileLabels.PostalCode}
                    placeholder={InputPlaceHolder(
                      userProfileLabels.postal_code
                    )}
                    value={validation.values.postal_code}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    disabled={!isEditing || loading || isUpdating}
                    invalid={
                      validation.touched.postal_code &&
                      !!validation.errors.postal_code
                    }
                    error={validation.errors.postal_code}
                    touched={validation.touched.postal_code}
                  />
                </Col>
              </Row>

              {isEditing && (
                <div className="text-center mt-4">
                  <BaseButton
                    type="submit"
                    color="danger"
                    disabled={loading || isUpdating || !validation.isValid}
                    label={
                      isUpdating
                        ? userProfileLabels.Updating
                        : userProfileLabels.UpdateProfile
                    }
                    loader={isUpdating}
                  />
                  <BaseButton
                    color="secondary"
                    className="ms-2"
                    onClick={handleCancelEdit}
                    disabled={loading || isUpdating}
                    label={userProfileLabels.Cancel}
                  />
                </div>
              )}
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;
