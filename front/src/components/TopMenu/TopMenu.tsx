import React, { useState, useEffect, useRef } from "react";
import styles from "./TopMenu.module.css";
import { useAuthContext } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth";
import Image from "next/image";
import Router from "next/router";

const TopMenu: React.FC = () => {
  const { user, authenticated } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    await logoutUser();
    Router.push("/login");
  };

  // Obtém a primeira letra do nome do usuário para o avatar
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className={styles.topMenu}>
      <div className={styles.left}>
        <Image
          src="/clubeLogo.svg"
          alt="Clube Logo"
          width={120}
          height={40}
          className={styles.logo}
        />
      </div>
      <div className={styles.right}>
        <button className={styles.helpButton}>
          <Image src="/help.svg" alt="Ajuda" width={20} height={20} />
        </button>
        {authenticated && (
          <div className={styles.profile} onClick={toggleDropdown}>
            <div className={styles.avatar}>{firstLetter}</div>
            {dropdownOpen && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>{firstLetter}</div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{user?.name}</div>
                    <div className={styles.userEmail}>{user?.email}</div>
                  </div>
                </div>
                <div className={styles.dropdownItemGroup}>
                  <button className={styles.dropdownItem}>
                    <Image src="/business.svg" alt="Meus Negócios" width={16} height={16} />
                    <span>Meus Negócios</span>
                  </button>
                  <button className={styles.dropdownItem}>
                    <Image src="/subscription.svg" alt="Minha Assinatura" width={16} height={16} />
                    <span>Minha Assinatura</span>
                  </button>
                  <button className={styles.dropdownItem}>
                    <Image src="/help.svg" alt="Ajuda" width={16} height={16} />
                    <span>Ajuda</span>
                  </button>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <Image src="/logout.svg" alt="Logout" width={16} height={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopMenu;
