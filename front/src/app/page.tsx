"use client";

import styles from "./page.module.css";
import LoginForm from "@/components/Login/LoginForm";

export default function Home() {
  return (
    <section className={styles.container}>

      <div className={styles.left}>
        <div className={styles.leftContainer}>
          <img src="/clubeLogo.svg" alt="Clube Logo" className={styles.logo} />        
          <div className={styles.loginContainer}>
            <p className={styles.loginText}>
              Vendedores, monetizem suas paixões. Usuários, acessem conteúdos exclusivos. Crie sua conta na nossa plataforma hoje mesmo!
            </p>
            <LoginForm />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <header className={styles.header}>
          <nav>
            <ul className={styles.navList}>
              <li><a href="#">Preço</a></li>
              <li><a href="#">Como Funcion</a></li>
              <li><a href="#">Manifesto</a></li>
            </ul>
          </nav>
        </header>
        <img src="/imageHome.png" alt="Imagem Home" className={styles.imageHome} />
        {/* Outras seções da coluna verde podem ser adicionadas aqui */}
      </div>
    </section>
  );
}
