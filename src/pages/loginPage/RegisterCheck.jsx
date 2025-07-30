import style from "../../CSS/RegisterCheck.module.css";
import { useNavigate } from "react-router-dom";

function RegisterCheck() {

    const navigate = useNavigate();

    const ownerRegister = async () => {

        navigate("/ownerregister");

    };

    const userRegister = async () => {
        navigate("/userregister");
    }

    return (
        <>
            <div className={style["button-box"]}>
                <h2> 사장님은 여기로 회원가입 해주세요↓ </h2>
                <button className={style["owner-btn"]} type="button"
                    onClick={ownerRegister}>
                    사장님
                </button>
                <h2> 일반사용자는 여기로 회원가입 해주세요↓ </h2>
                <button className={style["user-btn"]} type="button"
                    onClick={userRegister}>
                    일반사용자
                </button>
            </div>

        </>

    );
}

export default RegisterCheck;
