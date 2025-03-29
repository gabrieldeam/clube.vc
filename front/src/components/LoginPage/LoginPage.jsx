"use client";

import { useState } from "react";
import LoginForm from "@/components/Login/LoginForm";
import styles from "./loginPage.module.css";

export default function LoginPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <div className={styles.leftContainer}>
          <img src="/clubeLogo.svg" alt="Clube Logo" className={styles.logo} />
          <div className={styles.loginContainer}>
            <p className={styles.loginText}>
              Vendedores, monetizem suas paixões. Usuários, acessem conteúdos
              exclusivos. Crie sua conta na nossa plataforma hoje mesmo!
            </p>
            <LoginForm />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.headerMobile}>
          <img
            src="/clubeLogo.svg"
            alt="Clube Logo"
            className={styles.logoMobile}
          />
          <img
            src="/menu-hamburguer.svg"
            alt="Menu"
            className={styles.icon}
            onClick={toggleMenu}
          />
        </div>

        {menuOpen && (
          <div
            className={styles.overlay}
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        <nav className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
          <button
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
          >
            X
          </button>
          <ul className={styles.navListMobile}>
            <li>
              <a href="#">Preço</a>
            </li>
            <li>
              <a href="#">Como Funcion</a>
            </li>
            <li>
              <a href="#">Manifesto</a>
            </li>
          </ul>
        </nav>

        <header className={styles.header}>
          <nav>
            <ul className={styles.navList}>
              <li>
                <a href="#">Preço</a>
              </li>
              <li>
                <a href="#">Como Funcion</a>
              </li>
              <li>
                <a href="#">Manifesto</a>
              </li>
            </ul>
          </nav>
        </header>
        <img
          src="/imageHome.png"
          alt="Imagem Home"
          className={styles.imageHome}
        />
      </div>
    </section>
  );
}
