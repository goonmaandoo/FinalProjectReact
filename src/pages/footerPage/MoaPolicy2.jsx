import style from '../../CSS/FooterPolicy.module.css';

export default function MoaPolicy2() {
    return (
        <div className={style["container"]}>
            <h1>모아페이 이용약관</h1>
            <p>모아페이는 배달모아 플랫폼 내에서 충전하여 사용할 수 있는 전자화폐 서비스입니다.</p>

            <h2>1. 충전 및 사용</h2>
            <p>이용자는 모아페이에 금액을 충전하여 배달 주문 시 결제 수단으로 사용할 수 있습니다.</p>

            <h2>2. 환불 정책</h2>
            <p>모아페이 잔액은 원칙적으로 환불되지 않으며, 예외적인 경우 회사가 정한 절차에 따릅니다.</p>

            <h2>3. 유효기간</h2>
            <p>모아페이 잔액은 충전일로부터 2년간 유효하며, 이후 자동 소멸됩니다.</p>

        </div>
    )
}