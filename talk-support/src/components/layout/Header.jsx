import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignOut from "../auth/SignOut";
import "../../styles/layout/header.css";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userType, user } = useSelector((state) => state.auth);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // 200ms delay
  };

  const navigationClient = [
    { name: "צ'אט", href: "/chat" },
    { name: "תומכים", href: "/supporters" },
    { name: "עזרה ומשאבים", href: "https://www.nafshi.info/?gad_source=1&gclid=CjwKCAjw4f6zBhBVEiwATEHFVksjVfWBlmzoFq5zStUbxpFrmTrOuV6IMYVJx9fYzkUKtw-P0mDjFxoCUGAQAvD_BwE", external: true },
    { name: "צור קשר", href: "/contact" }, // Added Contact link
  ];

  const navigationSupporter = [
    { name: "צ'אט", href: "/chat" },
    { name: "בית", href: "/supporters" },
    { name: "עזרה ומשאבים", href: "https://www.nafshi.info/?gad_source=1&gclid=CjwKCAjw4f6zBhBVEiwATEHFVksjVfWBlmzoFq5zStUbxpFrmTrOuV6IMYVJx9fYzkUKtw-P0mDjFxoCUGAQAvD_BwE", external: true },
    { name: "צור קשר", href: "/contact" }, // Added Contact link
  ];

  const navigation =
    userType === "client" ? navigationClient : navigationSupporter;

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Disclosure
      as="nav"
      className="bg-white fixed top-0 left-0 right-0 border-b z-50 "
      dir="rtl"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block size-7 text-gray-700" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block size-7 text-gray-700" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex space-x-24 rtl:space-x-reverse">
                    {navigation.map((item) => (
                      item.external ? (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classNames(
                            item.current
                              ? " "
                              : "text-gray-700 hover:text-indigo-500 hover:underline",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? " "
                              : "text-gray-700 hover:text-indigo-500 hover:underline",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
              <div className=" flex items-center justify-center mr-4">
                <SignOut />
              </div>
            </div>
          </div>
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={item.external ? "a" : Link}
                  to={item.external ? undefined : item.href}
                  href={item.external ? item.href : undefined}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={classNames(
                    item.current
                      ? ""
                      : "text-gray-700 hover:text-indigo-500 hover:underline",
                    "block rounded-md px-3 py-2 text-base font-medium rtl:text-right"
                  )}
                  onClick={handleLinkClick}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
