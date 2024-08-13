import { Link } from "react-router-dom";

const LandingPage = () =>{
    return(
        <div>
            랜딩페이지 입니다!
            <div>
                <Link to="/newPage">새 페이지로 이동</Link>
                <br></br>
                <Link to="/GetMyInfo">내 정보 페이지로 이동</Link>
            </div>
        </div>
    )
}

export default LandingPage;