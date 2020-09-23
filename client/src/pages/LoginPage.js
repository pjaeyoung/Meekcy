import React from 'react';
import { useDispatch } from 'react-redux';
import { loginCheck } from '../modules/actions/changeLoginStatus';
import styled from 'styled-components';
import { GoogleLogin } from 'react-google-login';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const Container = styled.div`
	position: relative;
	width: 100%;
	height: 100vh;
`;

const BGIMG = styled.div`
	position: relative;
	width: 100%;
	height: 100vh;
	background-repeat: no-repeat;
	background-position: center center;
	background-image: url('images/LoginBG.jpg');
	background-size: cover;
	opacity: 0.2;
`;

const Logo = styled.h1`
	width: 50px;
	height: 50px;
	position: absolute;
	top: 20px;
	left: 20px;
	background-repeat: no-repeat;
	background-position: center center;
	background-image: url('images/Logo.png');
	background-size: cover;
`;

const LoginWrap = styled.div`
	width: 50%;
	max-width: 500px;
	min-width: 200px;
	height: 50%;
	max-height: 350px;
	min-height: 250px;
	background-color: rgb(0, 0, 0, 0.2);
	margin: 0 auto;
	display: grid;
	justify-content: center;
	padding-top: 40px;
	text-align: center;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 5px;
	transition: background-color 0.5s;
	&:hover {
		background-color: rgb(0, 0, 0, 0.5);
	}
`;

const LoginTitle = styled.h2`
	font-size: 50px;
	color: white;
`;

const LoginDetailText = styled.p`
	font-size: 12px;
`;

const LoginStrongText = styled.span`
	color: #900c3f;
	font-size: 15px;
`;

const LoginBtn = styled.div``;

const Login = () => {
	const dispatch = useDispatch();

	// googleLogin으로 전달받은 토큰을 서버로 전달 후 서버에서 전달받은 JWT토큰을 localstorage에 저장하는 함수
	const responseGoogle = (res) => {
		axios
			.post('http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/auth', {
				id_token: res.tokenId,
			})
			.then(function (response) {
				localStorage.setItem('token', response.data.token);
				// isLogin 상태값을 true로 변경한다.
				dispatch(loginCheck());
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const responseFailGoogle = (err) => {
		console.log(err);
	};

	return (
		<Container>
			<BGIMG></BGIMG>
			<Logo></Logo>
			<LoginWrap>
				<LoginTitle>LOGIN</LoginTitle>
				<LoginDetailText>
					비대면 온라인 소셜, Community, Hyper connect <LoginStrongText>Meekcy</LoginStrongText>
				</LoginDetailText>
				<LoginBtn>
					<GoogleLogin
						clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
						buttonText="Login with Google"
						onSuccess={responseGoogle}
						onFailure={responseFailGoogle}
						cookiePolicy={'single_host_origin'}
					/>
				</LoginBtn>
				<LoginDetailText>
					Powered by <LoginStrongText>DaBom</LoginStrongText>
				</LoginDetailText>
			</LoginWrap>
		</Container>
	);
};

export default Login;
