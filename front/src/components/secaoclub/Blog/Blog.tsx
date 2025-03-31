"use client";

import React from "react";
import styles from "./Blog.module.css";

export default function BlogSection() {
  return (
    <div className={styles.blogContainer}>
      <h2>Blog</h2>
      <p>Aqui você configura o blog do clube.</p>
    </div>
  );
}
