import React, { useState, useEffect, useRef } from "react";
import styles from "./TopMenu.module.css";
import { useAuthContext } from "@/context/AuthContext";
import { logoutUser, isAdmin } from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";

const TopMenu: React.FC = () => {
  const { user, authenticated } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = async () => {
    await logoutUser();
    Router.push("/login");
  };

  // Obtém a primeira letra do nome do usuário para o avatar
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  // Verifica se o usuário é admin assim que o usuário for autenticado
  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await isAdmin();
        if (response && response.is_admin) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status de admin:", error);
        setAdmin(false);
      }
    };

    if (authenticated) {
      fetchAdminStatus();
    }
  }, [authenticated]);

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
        <Link href="/" passHref>
          <Image
            src="/clubeLogo.svg"
            alt="Clube Logo"
            width={120}
            height={40}
            className={styles.logo}
          />
        </Link>
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
                  
                  <Link href="/" passHref className={styles.dropdownItem}>
                    <button>
                      <Image src="/business.svg" alt="Meus Negócios" width={16} height={16} />
                      <span>Meus Negócios</span>
                    </button>
                  </Link>
                  <button className={styles.dropdownItem}>
                    <Image src="/subscription.svg" alt="Minha Assinatura" width={16} height={16} />
                    <span>Minha Assinatura</span>
                  </button>
                  <button className={styles.dropdownItem}>
                    <Image src="/help.svg" alt="Ajuda" width={16} height={16} />
                    <span>Ajuda</span>
                  </button>
                  {admin && (
                    <Link href="/admin" passHref className={styles.dropdownItem}>
                      <button>
                        <Image src="/admin.svg" alt="Admin" width={16} height={16} />
                        <span>Admin</span>
                      </button>
                    </Link>
                  )}
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
