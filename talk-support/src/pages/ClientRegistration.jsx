import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  getDoc,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase_config";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/common/Loading";
import {
  setFormDetails,
  setUserType,
  userTypeClient,
  setUid,
} from "../redux/features/authSlice";
import { Field, Label, Switch } from "@headlessui/react";
import CityAutocomplete from "../components/common/CityAutocomplete";
import { texts } from "../constants/texts";
import {
  recentStatusOptions,
  genderOptions,
  areaOptions,
  referralSourceOptions,
  preferredLanguageOptions,
} from "../constants/selectOptions";
import BackArrowIcon from "../assets/svgs/BackArrowIcon";
import EyeIcon from "../assets/svgs/EyeIcon";
import EyeOffIcon from "../assets/svgs/EyeOffIcon";

const ClientRegistration = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { status } = useSelector((store) => store.auth);
  const [agreed, setAgreed] = useState(false);

  const [registration, setRegistration] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nickname: "",
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    city: null,
    address: "",
    area: "not-selected",
    recentStatus: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
  });

  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;

    if (key === "birthYear") {
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - value;
      if (calculatedAge >= 18) {
        setRegistration({ ...registration, [key]: value, age: calculatedAge });
      }
    } else {
      setRegistration({ ...registration, [key]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requiredFields = [
    { key: "nickname", label: "Nickname" },
    { key: "recentStatus", label: "Recent Status" },
    { key: "gender", label: "Gender" },
    { key: "birthYear", label: "Birth Year" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "area", label: "Area" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "referralSource", label: "Referral Source" },
    { key: "preferredLanguage", label: "Language" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!agreed) {
      setError(texts.ClientRegistration.termsAgreementError);
      return;
    }

    if (!validateEmail(registration.email)) {
      setError(texts.ClientRegistration.invalidEmailError);
      return;
    }

    if (
      registration.nickname
        .toLowerCase()
        .includes(registration.firstName.toLowerCase()) ||
      registration.nickname
        .toLowerCase()
        .includes(registration.lastName.toLowerCase())
    ) {
      setError(texts.ClientRegistration.nicknameError);
      return;
    }

    // Validation for required fields
    for (let field of requiredFields) {
      if (
        registration[field.key] === "not-selected" ||
        registration[field.key] === "" ||
        registration[field.key] === null
      ) {
        setError(
          `${texts.ClientRegistration.requiredFieldError}${field.label}`
        );
        return;
      }
    }

    try {
      // Check if nickname already exists
      const nicknameQuery = query(
        collection(db, "nicknames"),
        where("nickname", "==", registration.nickname)
      );
      const nicknameSnapshot = await getDocs(nicknameQuery);

      if (!nicknameSnapshot.empty) {
        setError(texts.ClientRegistration.nicknameExistsError);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;
      const user = { ...registration, uid: userId };
      user.chats = [];
      await updateProfile(userCredential.user, {
        displayName: registration.firstName + " " + registration.lastName,
      });

      await setDoc(doc(db, "clients", userId), user);

      // Add nickname to nicknames collection
      await setDoc(doc(db, "nicknames", userId), {
        nickname: registration.nickname,
      });

      // Update Redux
      dispatch(setUserType(userTypeClient));
      dispatch(setFormDetails(registration));
      setRegistrationComplete(true);
      dispatch(setUid(userId));
      localStorage.setItem("userType", userTypeClient);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" dir="rtl">
      <div className="w-full h-full flex justify-center">
        <form
          className="w-fit space-y-12 max-md:px-4 md:pt-10"
          onSubmit={handleSubmit}
        >
          <Link
            to="/welcome"
            className="md:absolute md:top-4 md:left-4 m-4 flex justify-end text-base font-semibold text-gray-900"
          >
            <BackArrowIcon />
          </Link>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl mb-4 font-semibold leading-7 text-gray-900 underline">
              {texts.ClientRegistration.registrationTitle}
            </h2>
            <p className="mt-1 text-lg leading-6 max-w-[700px] text-gray-600">
              {texts.ClientRegistration.registrationDescription}
            </p>
          </div>
          {/* --------------------------------------------------------------------------------------------------------------------------------- */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              {texts.ClientRegistration.profileTitle}
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              {texts.ClientRegistration.profileDescription}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.nicknameLabel}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    autoComplete="nickname"
                    value={registration.nickname}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="recentStatus"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.recentStatusLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="recentStatus"
                    name="recentStatus"
                    value={registration.recentStatus}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    {recentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.genderLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    value={registration.gender}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="birthYear"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.birthYearLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="birthYear"
                    name="birthYear"
                    value={registration.birthYear}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    <option value="not-selected">
                      {" "}
                      {texts.ClientRegistration.selectYear}{" "}
                    </option>
                    {Array.from(
                      { length: 83 },
                      (_, i) => new Date().getFullYear() - 18 - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* -------------------------------------------------------------------------------------------------------------------------- */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              {texts.ClientRegistration.personalDetailsTitle}
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              {texts.ClientRegistration.personalDetailsDescription}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.firstNameLabel}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="firstName"
                    value={registration.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="lastName"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.lastNameLabel}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="lastName"
                    value={registration.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.emailLabel}
                </label>
                <div className="mt-2" dir="ltr">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={registration.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.passwordLabel}
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.password}
                    onChange={handleChange}
                    required
                    dir="ltr"
                  />
                  <span
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {passwordVisible ? <EyeIcon /> : <EyeOffIcon />}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.areaLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="area"
                    name="area"
                    value={registration.area}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    {areaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="city"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.cityLabel}
                </label>
                <div className="mt-2">
                  <CityAutocomplete
                    value={registration.city}
                    onChange={(newValue) => {
                      setRegistration((prevState) => ({
                        ...prevState,
                        city: newValue || null,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="address"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.addressLabel}
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="address"
                    autoComplete="address"
                    value={registration.address}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="referralSource"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.referralSourceLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={registration.referralSource}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    {referralSourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="preferredLanguage"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.ClientRegistration.preferredLanguageLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={registration.preferredLanguage}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    {preferredLanguageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <Field className="flex gap-x-4 sm:col-span-2" id="terms" required>
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                dir="ltr"
                className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
              >
                <span className="sr-only">
                  {texts.ClientRegistration.termsLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                />
              </Switch>
            </div>
            <Label className="text-sm leading-6 text-gray-600">
              {texts.ClientRegistration.termsLabel}{" "}
              <a href="#" className="font-semibold text-indigo-600">
                {texts.ClientRegistration.termsLink}
              </a>
              .
            </Label>
          </Field>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Link
              to="/welcome"
              className="text-lg font-semibold leading-6 text-gray-900 mb-20 max-md:mb-28"
            >
              {texts.ClientRegistration.cancelButton}
            </Link>
            <button
              type="submit"
              className=" btn-wide mb-20 max-md:mb-20 flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2  text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="mx-2">{texts.ClientRegistration.registerButton}</p>
              <Loading show={status == "loading"} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientRegistration;
