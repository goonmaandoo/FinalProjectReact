import style from '../../CSS/FooterPolicy.module.css';

export default function MoaPolicy2() {
    return (
        <div className={style["container"]}>
            <h1>모아페이 이용약관</h1>
            <p>모아페이는 배달모아 플랫폼 내에서 충전하여 사용할 수 있는 전자화폐 서비스입니다.</p>

            <h2>1. 충전 및 사용</h2>
            <p>충전된 모아페이는 배달모아 플랫폼 내 모든 주문 시 결제 수단으로 사용할 수 있습니다.</p>

            <h2>2. 환불 정책</h2>
            <p>충전된 모아페이 잔액에 대한 환불은 언제든지 마이페이지 내 '문의하기'를 통해 신청할 수 있습니다.</p>
            <p>환불 신청이 접수되면 절차를 거쳐 신속하게 처리됩니다</p>

            <br/>
        </div>
    )
}