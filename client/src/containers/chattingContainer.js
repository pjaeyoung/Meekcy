import React, { useState, useEffect, useRef } from 'react';
import Chatting from '../components/Chat';
import { message as antdM } from 'antd';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const ChattingContainer = ({ socket }) => {
	/**
	 * state hook style
	 * avatarPopover : 아바타 설정 popup창 visible상태
	 * message : 현재 작성 message 저장
	 * messages : 서버에서 받아온 message 저장
	 * participant : 참여자들의 수를 저장
	 */
	const [avatarPopover, setAvatarVisible] = useState(true);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [avatars, setAvatars] = useState([]);
	const [participant, setParticipant] = useState(0);

	const chatPg = useRef(null);
	const chatInput = useRef(null);

	const history = useHistory();
	const roomName = history.location.pathname.substring(7);

	//message and caption socket.io 통신 useEffect
	useEffect(() => {
		//하나의 message 추가.
		socket.on('receiveMessage', (value) => {
			receivedMessage(value);
			//scroll
			chatPg.current.scrollTop = chatPg.current.scrollHeight;
		});
		//이전 message의 모든 정보를 저장
		socket.on('receiveHistoryMessages', (value) => {
			setMessages(value);
			chatPg.current.scrollTop = chatPg.current.scrollHeight;
		});
	}, []);
	//avatar change에 관한 내용을 server에서 받아 message state의 내용을 변경하는 useEffect
	useEffect(() => {
		socket.on('receiveChangeAvatar', (value) => {
			setMessages((oldMsgs) => {
				const chagedMsg = oldMsgs.map((element) => {
					if (element.value.id === value.userId) {
						element.value.avatar = value.avatar;
					}
					return element;
				});
				return chagedMsg;
			});
		});
	}, []);
	// 해당 방에 접속을 server에서 관리하기 위해
	// streaming page component에서 room정보를 받아 서버에게 room 정보를 주는 useEffect
	useEffect(() => {
		socket.emit('joinRoom', { roomName });
	}, []);
	//server에서 보내온 참여자의 수를 받아 state값 변경하기 위한 useEffect
	useEffect(() => {
		socket.on('receiveParticipants', (value) => {
			setParticipant(value.countParticipants);
		});
	}, []);

	//socket으로 받은 메세지지 state에 추가 하는 함수
	function receivedMessage(message) {
		setMessages((oldMsgs) => [...oldMsgs, message]);
	}
	//message 입력후 server로 socket을 날려주는 이벤트 함수
	const sendMessageEnterEvent = (e) => {
		e.preventDefault();
		if (chatInput.current.value === '') {
			return;
		}
		chatInput.current.value = '';
		setMessage('');
		socket.emit('sendMessage', { message: message });
	};

	//input 창에 text 쓸때마다 현재 메세지 state 변경
	function handleChange(e) {
		setMessage(e.target.value);
	}
	/**
	 * avatar들을 받아 오기위해 server와 API 통신하는 이벤트
	 */
	function popoverAvatarClickEvent() {
		setAvatarVisible(!avatarPopover);
		if (avatarPopover) {
			const token = localStorage.getItem('token');
			axios
				.get('http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/avatars', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setAvatars(res?.data);
				});
		}
	}
	//	 * avatar 변경을 위해 server와 API 통신하는 이벤트
	function changeAvartarClickEvent(e) {
		e.persist();
		const token = localStorage.getItem('token');

		axios
			.patch(
				'http://ec2-13-124-190-63.ap-northeast-2.compute.amazonaws.com:4000/user/profile',
				{
					avatar_id: e.target.parentNode.id,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				},
			)
			.then((response) => {
				localStorage.setItem('token', response.data.token);
				socket.emit('sendChangeAvatar', { user: { avatar: e.target?.src } });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	//링크 복사 click event 함수
	function copyLinkClickEvent() {
		const tempTextArea = document.createElement('textarea');

		tempTextArea.value = `http://meekcy.s3-website.ap-northeast-2.amazonaws.com/rooms/${roomName}`;
		document.body.appendChild(tempTextArea);
		tempTextArea.focus();
		tempTextArea.select();
		try {
			document.execCommand('copy');
			antdM.success({ content: '링크가 복사되었습니다!', duration: 0.8 });
		} catch (error) {
			antdM.success({ content: '링크복사에 실패하였습니다.', duration: 0.8 });
		}
		document.body.removeChild(tempTextArea);
	}

	return (
		<Chatting
			sendMessageEnterEvent={sendMessageEnterEvent}
			chatList={messages}
			handleChange={handleChange}
			popoverAvatarClickEvent={popoverAvatarClickEvent}
			avatars={avatars}
			copyLinkClickEvent={copyLinkClickEvent}
			changeAvartarClickEvent={changeAvartarClickEvent}
			myinfo={myinfo}
			chatPg={chatPg}
			chatInput={chatInput}
			participant={participant}
		/>
	);
};
export default ChattingContainer;
