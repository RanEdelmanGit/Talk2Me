import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setFormDetails,
  setUserType,
  meetingAll,
  meetingOffline,
  meetingOnline,
  userTypeSupporter,
  setUid,
} from "../../redux/features/authSlice";

const SupporterRegistration = () => {
  const [error, setError] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [studentApproval, setStudentApproval] = useState(null);
  const [grades, setGrades] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;
    setRegistration({ ...registration, [key]: value });
  };

  const [registration, setRegistration] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
    meeting: "not-selected",
    gender: "not-selected",
    age: 18,
    location: "not-selected",
    relationshipStatus: "not-selected",
    religious: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
    approved: false,
  });

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Validation for "not-selected" or empty options
    const requiredFields = [
      { key: "gender", label: "Gender" },
      { key: "location", label: "Location" },
      { key: "relationshipStatus", label: "Relationship Status" },
      { key: "religious", label: "Religious Status" },
      { key: "referralSource", label: "Referral Source" },
      { key: "meeting", label: "Meeting Preference" },
    ];

    for (let field of requiredFields) {
      if (registration[field.key] === "not-selected") {
        setError(`Please select a valid option for ${field.label}`);
        return;
      }
    }

    if (registration.email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: registration.name,
      });

      await setDoc(doc(db, "userChats", userId), {});

      // Handle file uploads if necessary
      if (idDoc) {
        const idDocRef = storageRef(storage, `supporters/${userId}/idDoc`);
        await uploadBytes(idDocRef, idDoc);
        registration.idDocURL = await getDownloadURL(idDocRef);
      }
      if (studentApproval) {
        const studentApprovalRef = storageRef(
          storage,
          `supporters/${userId}/studentApproval`
        );
        await uploadBytes(studentApprovalRef, studentApproval);
        registration.studentApprovalURL = await getDownloadURL(
          studentApprovalRef
        );
      }
      if (grades) {
        const gradesRef = storageRef(storage, `supporters/${userId}/grades`);
        await uploadBytes(gradesRef, grades);
        registration.gradesURL = await getDownloadURL(gradesRef);
      }
      if (profilePic) {
        const profilePicRef = storageRef(
          storage,
          `supporters/${userId}/profilePic`
        );
        await uploadBytes(profilePicRef, profilePic);
        registration.profilePicURL = await getDownloadURL(profilePicRef);
      }

      await setDoc(doc(db, "supporters", userId), registration);
      dispatch(setUserType(userTypeSupporter));
      dispatch(setFormDetails(registration));

      dispatch(setUid(userId));
      navigate("/");
      setShowModal(true); // Show modal on successful registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              דוא"ל:
            </label>
            <input
              id="email"
              type="email"
              className="input w-full p-2 border border-gray-300 rounded-md text-sm pl-2"
              value={registration.email}
              style={{ direction: "ltr" }}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              שם מלא:
            </label>
            <input
              id="name"
              type="text"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="preferredLanguage"
              className="block text-sm font-medium"
            >
              שפה מועדפת?
            </label>
            <select
              id="preferredLanguage"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.preferredLanguage}
              onChange={handleChange}
              required
            >
              <option value="hebrew">עברית</option>
              <option value="english">אנגלית</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              סיסמא:
            </label>
            <input
              id="password"
              type="password"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium">
              זהות המגדרית?
            </label>
            <select
              id="gender"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.gender}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר</option>
              <option value="woman">אישה</option>
              <option value="man">גבר</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="religious" className="block text-sm font-medium">
              האם את/ה דתי?
            </label>
            <select
              id="religious"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.religious}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר</option>
              <option value="לא">לא</option>
              <option value="כן">כן</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              טלפון:
            </label>
            <input
              id="phone"
              type="text"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium">
              גיל:
            </label>
            <input
              id="age"
              type="number"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.age}
              onChange={(e) => {
                const newAge = e.target.value;
                if (newAge === "" || newAge >= 18) {
                  setRegistration({ ...registration, age: newAge });
                }
              }}
              min="18"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              איזור:
            </label>
            <select
              id="location"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.location}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר איזור</option>
              <option value="north">צפון</option>
              <option value="center">מרכז</option>
              <option value="south">דרום</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="meeting" className="block text-sm font-medium">
              אופן המפגש:
            </label>
            <select
              id="meeting"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.meeting}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר אופן מפגש</option>
              <option value={meetingOffline}>מפגש פנים אל פנים</option>
              <option value={meetingOnline}>מרחוק</option>
              <option value={meetingAll}>שניהם</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium">
              השכלה:
            </label>
            <select
              id="education"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.education}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר השכלה</option>
              <option value="תואר שני">תואר שני</option>
              <option value="תואר שלישי">תואר שלישי</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="school" className="block text-sm font-medium">
              מוסד לימודים:
            </label>
            <select
              id="school"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.school}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר מוסד</option>
              <option value="אונ' תל אביב">אונ' תל אביב</option>
              <option value="רייכמן">רייכמן</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <h2 className="text-center mb-4 font-bold underline">מסמכים</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="idDoc" className="block text-sm font-medium">
                תעודת זהות:
              </label>
              <input
                id="idDoc"
                type="file"
                className="file-input border border-gray-300"
                onChange={(e) => handleFileUpload(e, setIdDoc)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="studentApproval"
                className="block text-sm font-medium"
              >
                אישור סטודנט:
              </label>
              <input
                id="studentApproval"
                type="file"
                className="file-input border border-gray-300"
                onChange={(e) => handleFileUpload(e, setStudentApproval)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="grades" className="block text-sm font-medium">
                גיליון ציונים:
              </label>
              <input
                id="grades"
                type="file"
                className="file-input  border border-gray-300"
                onChange={(e) => handleFileUpload(e, setGrades)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profilePic" className="block text-sm font-medium">
                תמונת פרופיל:
              </label>
              <input
                id="profilePic"
                type="file"
                className="file-input  border border-gray-300"
                onChange={(e) => handleFileUpload(e, setProfilePic)}
                accept=".jpg,.jpeg,.png"
              />
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex flex-col items-end space-y-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            הרשמה
          </button>
          <div className="text-sm text-center w-full">
            כבר יש לך חשבון?{" "}
            <Link to="/login" className="text-blue-500">
              התחבר
            </Link>
          </div>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Registration Successful</h2>
            <p>Thank you for registering as a supporter!</p>
            <button
              onClick={() => {
                setShowModal(false);
                setTimeout(() => {
                  navigate("/");
                }, 1500);
              }}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupporterRegistration;
