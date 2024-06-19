import React, { useState } from "react";
import { db } from "../firebase_config";
import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useUser } from "../context/userContext";

export default function Search() {
  const [userName, setUserName] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const handleSearch = async () => {
    setLoading(true);
    setErr(null);
    setOtherUser(null);

    try {
      const q = query(
        collection(db, "listeners"),
        where("displayName", "==", userName)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErr("User not found");
      } else {
        querySnapshot.forEach((doc) => {
          setOtherUser(doc.data());
        });
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setErr("Error searching for user");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!otherUser) {
      setErr("Please select a user first");
      return;
    }

    const CombinedId =
      user.uid > otherUser.uid
        ? user.uid + otherUser.uid
        : otherUser.uid + user.uid;

    try {
      const chatDocRef = doc(db, "chats", CombinedId);
      const chatDocSnap = await getDoc(chatDocRef);

      if (!chatDocSnap.exists()) {
        await setDoc(chatDocRef, { messages: [] });
      }

      await Promise.all([
        setDoc(doc(db, "userChats", user.uid), {
          [CombinedId]: {
            userInfo: {
              uid: otherUser.uid,
              displayName: otherUser.displayName,
            },
            date: serverTimestamp(),
          },
        }),
        setDoc(doc(db, "userChats", otherUser.uid), {
          [CombinedId]: {
            userInfo: {
              uid: user.uid,
              displayName: user.displayName,
            },
            date: serverTimestamp(),
          },
        }),
      ]);

      console.log("Successfully updated user chats");
    } catch (error) {
      console.error("Error updating user chats:", error);
      setErr("Failed to update user chats");
    }

    setOtherUser(null);
    setUserName("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>

      {loading && <div>Loading...</div>}
      {err && <div style={{ color: "red" }}>{err}</div>}

      {otherUser && (
        <div className="userChat" onClick={handleSelect}>
          <img
            src={
              user.photoURL ||
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC"
            }
            alt=""
          />
          <div className="userChatInfo">
            <span>{otherUser.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
