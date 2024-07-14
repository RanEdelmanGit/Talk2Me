import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormDetails,
  setUserType,
  userTypeSupporter,
  setUid,
} from "../redux/features/authSlice";
import FileInput from "../components/common/FileInput";
import Loading from "../components/common/Loading";
import { Field, Label, Switch } from "@headlessui/react";
import CityAutocomplete from "../components/common/CityAutocomplete";
import { texts } from "../constants/texts";
import {
  meetingOptions,
  genderOptions,
  areaOptions,
  referralSourceOptions,
  preferredLanguageOptions,
} from "../constants/selectOptions";
import BackArrowIcon from "../assets/svgs/BackArrowIcon";
import EyeIcon from "../assets/svgs/EyeIcon";
import EyeOffIcon from "../assets/svgs/EyeOffIcon";
import CheckIcon from "../assets/svgs/CheckIcon";

const SupporterRegistration = () => {
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [charCount, setCharCount] = useState(200);
  const navigate = useNavigate();
  const { status } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const resumeRef = useRef(null);
  const studentApprovalRef = useRef(null);

  const handleClick = (ref) => {
    ref.current.click();
  };

  const handleBadgeClick = (value) => {
    setRegistration((prevState) => {
      const { meeting } = prevState;
      if (meeting.includes(value)) {
        return {
          ...prevState,
          meeting: meeting.filter((v) => v !== value),
        };
      } else {
        return {
          ...prevState,
          meeting: [...meeting, value],
        };
      }
    });
  };

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;

    if (key === "meeting") {
      const options = target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setRegistration({ ...registration, [key]: selectedValues });
    } else if (key === "birthYear") {
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - value;
      if (calculatedAge >= 18) {
        setRegistration({ ...registration, [key]: value, age: calculatedAge });
      }
    } else {
      setRegistration({ ...registration, [key]: value });
    }
    if (key === "about") {
      setCharCount(200 - value.length); // Update character count
    }
  };

  const [registration, setRegistration] = useState({
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    meeting: [],
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    city: null,
    address: "",
    area: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
    approved: false,
    resume: "",
    studentApproval: "",
    about: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.id;
    setRegistration((prev) => ({ ...prev, [fieldName]: file }));
  };

  const uploadFile = async (file, filePath) => {
    const fileRef = storageRef(storage, filePath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const requiredFields = [
    { key: "firstName", label: texts.SupporterRegistration.firstNameLabel },
    { key: "lastName", label: texts.SupporterRegistration.lastNameLabel },
    { key: "email", label: texts.SupporterRegistration.emailLabel },
    { key: "phone", label: texts.SupporterRegistration.phoneLabel },
    { key: "password", label: texts.SupporterRegistration.passwordLabel },
    { key: "birthYear", label: texts.SupporterRegistration.birthYearLabel },
    { key: "gender", label: texts.SupporterRegistration.genderLabel },
    { key: "area", label: texts.SupporterRegistration.areaLabel },
    { key: "city", label: texts.SupporterRegistration.cityLabel },
    { key: "address", label: texts.SupporterRegistration.addressLabel },
    { key: "referralSource", label: texts.SupporterRegistration.referralSourceLabel },
    { key: "preferredLanguage", label: texts.SupporterRegistration.preferredLanguageLabel },
    { key: "meeting", label: texts.SupporterRegistration.meetingLabel },
    { key: "about", label: texts.SupporterRegistration.aboutLabel },
    { key: "resume", label: texts.SupporterRegistration.resumeLabel },
    { key: "studentApproval", label: texts.SupporterRegistration.studentApprovalLabel },
  ];

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!agreed) {
      setError(texts.SupporterRegistration.termsAgreementError);
      return;
    }

    if (!validateEmail(registration.email)) {
      setError(texts.SupporterRegistration.invalidEmailError);
      return;
    }

    if (!validatePhone(registration.phone)) {
      setError(texts.SupporterRegistration.invalidPhoneError);
      return;
    }

    // Validation for required fields
    for (let field of requiredFields) {
      if (
        registration[field.key] === "not-selected" ||
        registration[field.key] === "" ||
        registration[field.key] === null ||
        (Array.isArray(registration[field.key]) &&
          registration[field.key].length === 0)
      ) {
        setError(
          `${texts.SupporterRegistration.selectValidOptionError} ${field.label}`
        );
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: registration.firstName + " " + registration.lastName,
      });

      const user = { ...registration, uid: userId };

      if (user.resume) {
        const resumeURL = await uploadFile(
          user.resume,
          `supporters/${userId}/resume`
        );
        user.resume = resumeURL;
      }
      if (user.studentApproval) {
        const studentApprovalURL = await uploadFile(
          user.studentApproval,
          `supporters/${userId}/studentApproval`
        );
        user.studentApproval = studentApprovalURL;
      }

      user.chats = [];
      user.approved = false;
      await setDoc(doc(db, "supporters", userId), user);

      dispatch(setUserType(userTypeSupporter));
      dispatch(setFormDetails(user));
      dispatch(setUid(userId));
      // localStorage.setItem("userType", userTypeSupporter);
      navigate("/welcome");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError(texts.SupporterRegistration.emailExistsError);
      } else if (error.code === "invalid-argument") {
        setError(texts.SupporterRegistration.missingDataError);
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" dir="rtl">
      <div className="w-full h-full flex justify-center">
        <form
          className="w-fit space-y-12 md:pt-10 max-md:px-4"
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
              {texts.SupporterRegistration.registrationTitle}
            </h2>
            <p className="mt-1 text-lg leading-6 max-w-[700px] text-gray-600">
              {texts.SupporterRegistration.registrationDescription}
            </p>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              {texts.SupporterRegistration.profileTitle}
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              {texts.SupporterRegistration.profileDescription}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="firstName"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.firstNameLabel}
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
                  {texts.SupporterRegistration.lastNameLabel}
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
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.emailLabel}
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
                  {texts.SupporterRegistration.passwordLabel}
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

              <div className="sm:col-span-4">
                <label
                  htmlFor="phone"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.phoneLabel}
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="birthYear"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.birthYearLabel}
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
                      {texts.SupporterRegistration.selectYear}
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
              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.genderLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.gender}
                    onChange={handleChange}
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
                  htmlFor="area"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.areaLabel}
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
                  {texts.SupporterRegistration.cityLabel}
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
                  {texts.SupporterRegistration.addressLabel}
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

              <div className="sm:col-span-2">
                <label
                  htmlFor="preferredLanguage"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.preferredLanguageLabel}
                </label>
                <div className="mt-2">
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    autoComplete="language"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.preferredLanguage}
                    onChange={handleChange}
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

              <div className="sm:col-span-4">
                <label
                  htmlFor="meeting"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.meetingLabel}
                </label>
                <div className="mt-2 flex justify-around items-center">
                  {meetingOptions.map((option) => (
                    <span
                      key={option.value}
                      className={`relative inline-flex items-center rounded-md ${
                        option.bgColor
                      } px-8 py-1.5 text-base font-medium ${
                        option.textColor
                      } ring-1 ring-inset  bg-blue-50 cursor-pointer ${
                        registration.meeting.includes(option.value) ? "" : ""
                      }`}
                      onClick={() => handleBadgeClick(option.value)}
                    >
                      {option.label}
                      {registration.meeting.includes(option.value) && (
                        <CheckIcon />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="referralSource"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  {texts.SupporterRegistration.referralSourceLabel}
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
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  {texts.SupporterRegistration.aboutLabel}
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    maxLength={200} // Set the maximum character limit here
                    onChange={handleChange}
                    className="placeholder-custom block w-full rounded-md border-0 py-1.5 max-md:h-40 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                    placeholder={texts.SupporterRegistration.aboutPlaceholder}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-3 text-base leading-6 text-gray-600">
                    {texts.SupporterRegistration.aboutParagraph}
                  </p>
                  <p className="mt-1 text-base leading-6 text-gray-600">
                    200 / {charCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              {texts.SupporterRegistration.documentUploadTitle}
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              {texts.SupporterRegistration.documentUploadDescription}
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    id="studentApproval"
                    name="studentApproval"
                    type="file"
                    className="hidden"
                    ref={studentApprovalRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleClick(studentApprovalRef)}
                  >
                    <FileInput
                      text={texts.SupporterRegistration.studentApprovalLabel}
                      file={registration.studentApproval}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    className="hidden"
                    ref={resumeRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleClick(resumeRef)}
                  >
                    <FileInput
                      text={texts.SupporterRegistration.resumeLabel}
                      file={registration.resume}
                    />
                  </div>
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
                  {texts.SupporterRegistration.termsAgreementLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                />
              </Switch>
            </div>
            <Label className="text-sm leading-6 text-gray-600">
              על ידי בחירה זו, אתה מסכים ל{" "}
              <a href="#" className="font-semibold text-indigo-600">
                {texts.SupporterRegistration.termsAgreementLink}
              </a>
              .
            </Label>
          </Field>

          {error && <div className="flex w-full justify-center mb-4">{error}</div>}

          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Link
              to="/welcome"
              className="text-lg font-semibold leading-6 text-gray-900 mb-20 max-md:mb-28"
            >
              {texts.SupporterRegistration.cancelButton}
            </Link>

            <button
              type="submit"
              className="btn-wide mb-20 max-md:mb-20 flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="mx-2">
                {texts.SupporterRegistration.registerButton}
              </p>
              <Loading show={status == "loading"} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupporterRegistration;
