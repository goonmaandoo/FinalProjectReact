import styles from "../../CSS/UpdateStatus.module.css"
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';

export default function UpdateStatus() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    return(
        <div className={styles["main_container"]}>닉네임</div>
    )
}