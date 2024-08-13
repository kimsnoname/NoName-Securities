<div align="center">
  <h1>모의해킹 수행을 위한 증권 거래 애플리케이션</h1>
  
  <h3>매인 취약점: Corss Site Scripting, SSRF, Ransomware</h3>

</div>
</br>
</br>



# 목차

1. [프로젝트 소개](#프로젝트-소개)
   - [프로젝트 개요](#프로젝트-개요)
   - [주요 시나리오](#주요-시나리오)
2. [개발 기간](#개발-기간)
3. [팀 멤버](#팀-멤버)
4. [주요 기능 소개](#주요-기능-소개)
   - [실시간 차트](#실시간-차트)
   - [매수매도](#매수매도)
   - [거래내역](#거래내역)
   - [계좌이체](#계좌이체)
   - [마이페이지](#마이페이지)
5. [프로젝트 아키텍처](#프로젝트-아키텍처)
6. [개발 환경](#개발-환경)


## 💻프로젝트 소개

<p>SK 쉴더스 루키즈 (19기) <b>최우수</b> 프로젝트</p>
<p>취약점 진단을 기반으로 3가지 시나리오 모의해킹 수행</p>
<p>시나리오 1. 자산 탈취</p>
<p>시나리오 2. 클라우드 리소스 무단 점유</p>
<p>시나리오 3. 모바일 악성코드</p>

## ⏲프로젝트 기간

2024.06.25 - 2024.08.14

## 👪팀 멤버

|    정성욱    |    권순형    |    김현진    |    류지원    |    장세훈    |  최유안    | 한재경    | 유성근    |
|:------------:|:------------:|:------------:|:------------:|:------------:| :------------:| :------------:| :------------:|
| 팀장 /   Frontend | 팀원 / Android Mobile | 팀원 / Frontend | 팀원 / Backend | 팀원 / Android Mobile | 팀원 / Backend | 팀원 / Frontend | 팀원 / Backend |


## 📷주요기능 소개



### [실시간 차트](#실시간-차트)
<p>한국투자증권, 한국거래소 API를 사용하고 실시간 국내 주식 정보를 시각적으로 제공</p>

![](https://velog.velcdn.com/images/wearetheone/post/6bd0f6af-3554-4647-a236-760b8afff770/image.png)


### [매수매도](#매수매도)
<p>저희 서비스로 회원가입을 하시면 주식을 매수매도 할 수 있습니다</p>


![](https://velog.velcdn.com/images/wearetheone/post/e5b3c37f-47f3-4f30-8256-82ae6cb9a97a/image.png)


### [거래내역](#거래내역)
<p>매수매도한 거래내역 조회</p>

![](https://velog.velcdn.com/images/wearetheone/post/1eac9d92-72d0-4ed8-9da2-0588ac5cfb62/image.png)


### [계좌이체](#계좌이체)
<p>타 사용자의 계좌로 현금을 이체 할 수 있습니다</p>

![](https://velog.velcdn.com/images/wearetheone/post/3fd14860-00dc-4179-b8e3-42b502f7f297/image.png)

### [마이페이지](#마이페이지)
<p>마이페이지에서 이메일, 닉네임, 개인 프로필 사진을 수정 할 수 있습니다</p>


![](https://velog.velcdn.com/images/wearetheone/post/83da9118-5022-46f4-95b4-07eacff6ef78/image.png)






## 🏛프로젝트 아키텍처
![](https://velog.velcdn.com/images/wearetheone/post/18e10a9a-b9b4-47ac-9675-d8f8b4e3c30f/image.png)


## ⚙개발 환경

![](https://velog.velcdn.com/images/wearetheone/post/c227326b-ffe3-473c-afa7-fa4248d7a908/image.PNG)


<ul>
  <li>Front-end: React.js@18.2.0, TypeScript, Antd</li>
  <li>Back-end: Spring Boot, Spring Security, Hibernate</li>
  <li>API: Flask</li>
  <li>Env: Node.js@v18.17.0, JAVA 17</li>
  <li>Build: Vite, Gradle</li>
  <li>IDE: VScode</li>
  <li>DB: MySQL</li>
  <li>CI/CD: Github Actions</li>
  <li>Deploy: AWS, Docker</li>
  <li>Collaboration: Github, Notion</li>
</ul>




