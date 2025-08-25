# 배달모아(Delivery-MoA) 리뉴얼 기획서

## 1. 프로젝트 개요

### 1.1 프로젝트명
"배달모아(Delivery-MoA)" - 배달 공동구매 플랫폼 리뉴얼

### 1.2 기획 의도 및 목적
- **기존 배달모아 서비스의 개선 및 확장**
- '공동구매'를 통한 배달비 절감과 최소주문금액 부담감 해소
- **관리자 페이지 및 사장님 페이지 신규 추가**로 다중 사용자 지원
- **Supabase에서 Oracle DB로 마이그레이션**하여 기업급 안정성 확보
- 실시간 채팅을 통한 커뮤니티 활성화 강화
- 위치 기반 서비스 개선으로 이웃 간 커뮤니티 형성
- 최소주문금액 부담 해소를 통한 접근성 향상

### 1.3 목적
- 비용 절감과 소통을 동시에 이루는 새로운 배달 문화 창출

### 1.4 차별점
- 최소주문금액 부담 해소에 따른 소량 주문 가능
- 지역 주민과 자연스러운 커뮤니티 형성
- 공구방 인원간 소통

### 1.5 리뉴얼의 차별점
- **React 기반 모던 웹 인터페이스** 도입
- **Spring Boot 마이크로서비스 아키텍처** 적용
- **관리자 페이지 신규 구축**: 전체 시스템 모니터링 및 관리 기능
- **사장님 페이지 전면 개편**: 가게 운영 및 주문 관리 시스템 고도화
- **Supabase → Oracle Database 마이그레이션**: 기업급 데이터베이스로 안정성 및 성능 향상
- **Flutter 기반 모바일 앱** 동시 개발
- **AWS 클라우드 인프라** 구축으로 확장성 확보

## 2. 기술 스택 상세

### 2.1 프론트엔드
- **React**: 컴포넌트 기반 SPA 개발
- **JavaScript ES6+**: 모던 자바스크립트 활용
- **HTML5/CSS3**: 시맨틱 마크업 및 반응형 디자인
- **Socket.IO**: 실시간 채팅 구현

### 2.2 백엔드
- **Java**: 객체지향 기반 서버 로직 개발
- **Spring Boot**: RESTful API 및 마이크로서비스 구축
- **Spring Security**: 인증 및 권한 관리
- **JPA/Hibernate**: 객체 관계 매핑

### 2.3 모바일
- **Flutter**: 크로스 플랫폼 모바일 앱 개발
- **Dart**: Flutter 개발 언어

### 2.4 데이터베이스 및 인프라
- **Oracle Database**: 관계형 데이터베이스 관리 (Supabase에서 마이그레이션)
  - **마이그레이션 사유**: 
    - 기업급 안정성 및 성능 요구사항 충족
    - 복잡한 트랜잭션 처리 최적화
    - 대용량 데이터 처리 능력 향상
    - 보안 및 백업/복구 시스템 강화
- **AWS EC2**: 웹 서버 호스팅
- **AWS S3**: 이미지 및 파일 저장소

### 2.5 개발 도구
- **Visual Studio Code**: 프론트엔드 개발 IDE
- **IntelliJ IDEA**: Java/Spring Boot 개발 IDE
- **Git/GitHub**: 버전 관리 및 협업
- **Docker**: 컨테이너화 배포

## 3. 주요 기능 상세

### 3.1 메인화면
- 내 위치 설정
- 카테고리별 가게 확인
- 진행중인 공구방 확인
- 검색창에 키워드 입력 시 가게, 메뉴, 공구방 출력

### 3.2 햄버거바
- 친절도 및 잔여 캐시 확인
- 입장한 공구방 리스트

### 3.3 사용자관리
- 사장님과 일반회원 회원가입 및 로그인
- 회원정보 수정 및 탈퇴

### 3.4 가게 리스트 및 상세페이지
- 카테고리에 맞춰 가게 출력
- 가게 위치 지도상에 표시
- 공구방 개설과 개설된 방 확인 가능

### 3.5 공구과정
- 공구방 입장하기
- 개인메뉴 주문 후 방장이 최종주문
- 배달완료 시 픽업
- 공구종료 및 사용자 평가

### 3.6 마이페이지
- 캐시(사이트 내 가상화폐) 충전
- 사용자 평가에 따른 친절도 게이지 업데이트
- 주문내역 확인
- 문의남기기 및 문의내역 확인
- 가게 리뷰 남기기 및 리뷰 확인

### 3.7 사장님페이지
- 가게등록 및 가게관리
- 메뉴관리
- 배달접수 및 현황 체크
- 리뷰관리
- 주문확인

### 3.8 관리자페이지
- 주문리스트 확인
- 회원리스트 확인
- 가게관리
- 탈퇴, 정지 회원 관리
- 문의내역
- 공구방리스트 확인
- 신고관리
- 환불관리
- 댓글관리


## 4. 데이터베이스 설계

### 4.1 주요 테이블 구조

#### 4.1.1 Users (사용자)
```sql
CREATE TABLE users (
    id NUMBER PRIMARY KEY,
    nickname VARCHAR2(100),
    user_rating NUMBER DEFAULT 50,
    role VARCHAR2(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    address VARCHAR2(255),
    profile_url VARCHAR2(1000),
    address_detail VARCHAR2(255),
    status VARCHAR2(20) DEFAULT 'active',
    cash NUMBER,
    email VARCHAR2(255),
    password VARCHAR2(255),
    phone_num VARCHAR2(20),
    active_at TIMESTAMP
);
```

#### 4.1.2 Room (공구방)
```sql
CREATE TABLE room (
    id NUMBER PRIMARY KEY,
    store_id NUMBER,
    room_name VARCHAR2(255),
    room_address VARCHAR2(1000),
    max_people NUMBER,
    users VARCHAR2(4000),
    leader_id NUMBER,
    status VARCHAR2(50) DEFAULT '모집중',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    room_address_detail VARCHAR2(1000),
    ready_people NUMBER DEFAULT 0
);
```

#### 4.1.3 Store (가게)
```sql
CREATE TABLE store (
    id NUMBER PRIMARY KEY,
    menu_category_id NUMBER,
    store_name VARCHAR2(255),
    store_address VARCHAR2(1000),
    min_price NUMBER,
    tel VARCHAR2(50),
    owner_id NUMBER,
    CONSTRAINT fk_store_users 
      FOREIGN KEY (owner_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);
```

### 4.2 ERD 주요 관계
- **Users ↔ Room**: 1:N (방장), N:M (참여자)
- **Store ↔ Room**: 1:N (가게별 공구방)
- **Room ↔ Chat**: 1:N (방별 채팅 내역)
- **Users ↔ Orders**: 1:N (사용자별 주문 내역)
- **Store ↔ Menu**: 1:N (가게별 메뉴)

## 5. React 컴포넌트 아키텍처

### 5.1 페이지 컴포넌트
- `<HomePage />`: 메인 대시보드
- `<LoginPage />`: 로그인/회원가입
- `<StoreListPage />`: 가게 목록
- `<StoreDetailPage />`: 가게 상세 정보
- `<RoomDetailPage />`: 공구방 상세
- `<MyPage />`: 일반 사용자 마이페이지
- `<OwnerPage />`: **사장님 전용 페이지** (신규)
  - `<StoreManagement />`: 가게 관리
  - `<MenuManagement />`: 메뉴 관리
  - `<OrderManagement />`: 주문 관리
  - `<ReviewManagement />`: 리뷰 관리
  - `<SalesAnalytics />`: 매출 분석
- `<AdminPage />`: **관리자 전용 페이지** (신규)
  - `<UserManagement />`: 회원 관리
  - `<StoreApproval />`: 가게 승인 관리
  - `<ReportManagement />`: 신고 관리
  - `<RefundManagement />`: 환불 관리
  - `<InquiryManagement />`: 문의 관리
  - `<SystemAnalytics />`: 시스템 통계

### 5.2 공통 컴포넌트
```jsx
// UI 컴포넌트
<Header />              // 네비게이션 바
<Sidebar />            // 햄버거 메뉴
<CategoryCard />       // 카테고리 카드
<StoreCard />          // 가게 정보 카드
<RoomCard />           // 공구방 카드

// 기능 컴포넌트
<ChatBox />            // 채팅 컴포넌트
<OrderForm />          // 주문 폼
<PaymentModule />      // 결제 모듈
<MapComponent />       // 지도 표시
<RatingSystem />       // 평가 시스템
```

### 5.3 상태 관리
```jsx
// Context API 활용
<UserContext />        // 사용자 정보
<RoomContext />        // 공구방 상태
<OrderContext />       // 주문 상태
<ChatContext />        // 채팅 상태
```

## 6. 개발 팀 구성 및 역할 분담

### 6.1 팀 구성 (5명)
- **박채원 (팀장/풀스택)**: Github 및 AWS 구축, 메인페이지, 가게리스트, 가게상세페이지, 주문상세페이지, 검색페이지, 햄버거바, 관리자페이지
- **선승희 (풀스택)**: 회원가입, 로그인, 회원정보 수정 및 탈퇴, 사장님페이지
- **강상욱 (풀스택/모바일)**: 마이페이지, 관리자페이지, flutter
- **김호수 (풀스택)**: 공구방 생성, 가게 리뷰페이지, 주문완료 영수증, 사장님페이지
- **이태웅 (풀스택)**: 공구방, 지도연동, 마이페이지, 관리자페이지

### 6.2 기술 스택별 담당
```
프론트엔드 (React)    ──── 선승희, 박채원, 강상욱, 김호수, 이태웅
백엔드 (Spring Boot)  ──── 선승희, 박채원, 강상욱, 김호수, 이태웅
모바일 (Flutter)      ──── 강상욱
인프라 (AWS)          ──── 박채원
데이터베이스 (Oracle) ──── 전체 (공통)
```
## 7 프로젝트 기간: 2025.07 ~ 2025.08 (1개월)

