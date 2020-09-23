import React from 'react';
import styled from 'styled-components';
import { Popover, Avatar } from 'antd';
import 'antd/dist/antd.dark.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faUser, faUserCircle, faShare } from '@fortawesome/free-solid-svg-icons';

const Chat = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	background-color: #1f1f1f;
`;
const ChatHeader = styled.div`
	width: 100%;
	display: flex;
	border-radius: 3px;
	justify-content: space-between;
	align-items: center;
	background-color: #0d0d0d;
	line-height: 1.8;
	/* pc 가로 */
	@media (min-width: 961px) and (max-width: 1291px) {
		justify-content: space-between;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		justify-content: space-between;
		font-size: 13px;
		display: block;
		height: 5%;
		padding: 4% 0 3% 0;
		margin: 0;
		width: 100%;
	}
	&:hover {
		border-bottom: 1px solid #b5b5b5;
	}
`;
const ChatHeaderTitle = styled.span`
	margin-right: 3px;
`;
const HeaderRightWrap = styled.div`
	width: 100%;
	display: flex;
	font-size: 20px;
	align-items: center;
	justify-content: space-between;
	padding-left: 4%;

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		height: 10px;
		font-size: 10px;
		padding-bottom: 1%;
	}
`;
const Participant = styled.span`
	padding: 2px 2% 2px 2%;
	font-size: 8px;
	min-width: 20px;
	width: 35px;
	border: solid 1px white;
	border-radius: 8px;
	position: relative;
	left: 85%;
	margin-right: 5%;
	right: 5px;
	bottom: 5px;
	margin: 0 5px 6vh 0;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		margin: 0 3% 5vh 0;
	}
`;
const ClipWrap = styled.div`
	cursor: pointer;
	padding: 0px 15px 0px 0px;
	&:hover {
		color: gray;
	}
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		padding: 5px 4px 4px 15px;
		size: 5px;
	}
`;
const ChatHeaderProfile = styled(Popover)`
	margin-right: 20px;
	cursor: pointer;
	&:hover {
		color: gray;
	}
`;
const ChatHeaderProfileButton = styled(Avatar)`
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		font-size: 1px;
	}

	height: 30px;
	width: 30px;
`;
const ChatChatpg = styled.div`
	flex: 1;
	overflow: auto;
	padding: 10px 0px;
`;
const ChatChatpgMessage = styled.div`
	display: flex;
	align-items: center;
	padding: 5px 0px 5px 10px;
	word-break: break-word;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
	}
`;
const MessageProfile = styled(Avatar)`
	min-width: 30px;
	min-height: 30px;
	width: 30px;
	height: 30px;
	color: red;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		min-width: 20px;
		min-height: 20px;
		width: 20px;
		height: 20px;
	}
`;
const MessageText = styled.div`
	width: 100%;
	box-sizing: border-box;
	padding-left: 5px;
`;
const MessageTextName = styled.div`
	margin-bottom: 1%;
	font-size: 14px;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		font-size: 10px;
	}
`;
const MessageTextExplain = styled.div`
	width: 100%;
`;
const MessageTextChating = styled.div`
	font-size: 14px;
	color: #b5b5b5;
	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		font-size: 10px;
	}
`;
const MessageTextCaption = styled.div`
	font-size: 12px;
	color: gray;
`;
const ChatForm = styled.form`
	word-wrap: break-word;
	overflow-wrap: break-word;
`;

const ChatFormInput = styled.input`
	font-family: inherit;
	width: 100%;
	border: 0;
	border-bottom: 2px solid #9b9b9b;
	outline: 0;
	font-size: 18px;
	color: white;
	padding: 0 8px;
	background: transparent;
	transition: border-color 0.2s;
	&:required,
	&:invalid {
		box-shadow: none;
	}
	&::placeholder {
		color: transparent;
	}
	&:placeholder-shown ~ .form__label {
		font-size: 12px;
		cursor: text;
		top: 20px;
	}
	&:focus {
		~ .form__label {
			position: absolute;
			top: 0;
			display: block;
			transition: 0.5s;
			font-size: 12px;
			color: #11998e;
			font-weight: 300;
		}
		padding-top: 10px;
		padding-bottom: 6px;
		font-weight: 300;
		border-width: 3px;
		border-image: linear-gradient(to right, #11998e, #38ef7d);
		border-image-slice: 1;
	}

	margin: 1px;

	/* 스마트폰 가로 */
	@media (max-width: 823px) and (max-height: 540px) {
		font-size: 11px;
		height: 4vh;
		padding: 3% 0 3% 3%;
	}
`;
const ChatInputDiv = styled.div`
	position: relative;
	padding: 15px 0 0;
	margin-top: 10px;
	width: 100%;
`;
const CahtInputDivLabel = styled.label`
	left: 8px;
	position: absolute;
	top: 0;
	display: block;
	transition: 0.2s;
	font-size: 1px;
	color: gray;
	font-weight: 300;
`;

const Chatting = ({
	sendMessageEnterEvent,
	chatList,
	handleChange,
	popoverAvatarClickEvent,
	avatars,
	copyLinkClickEvent,
	changeAvartarClickEvent,
	myinfo,
	chatPg,
	chatInput,
	participant,
}) => {
	return (
		<Chat>
			<ChatHeader>
				<HeaderRightWrap>
					<ClipWrap onClick={copyLinkClickEvent}>
						<FontAwesomeIcon icon={faPaperclip} size={'1x'} />
					</ClipWrap>
					<ChatHeaderTitle>MEEKCY</ChatHeaderTitle>

					<ChatHeaderProfile
						content={avatars.map((value, index) => {
							return (
								<ChatHeaderProfileButton
									key={index}
									size="32"
									id={value.id}
									src={value.url}
									onClick={changeAvartarClickEvent}
								></ChatHeaderProfileButton>
							);
						})}
						placement="left"
						title="Avatar"
						trigger="click"
					>
						<FontAwesomeIcon
							icon={faUserCircle}
							onClick={popoverAvatarClickEvent}
							size={'1x'}
						></FontAwesomeIcon>
					</ChatHeaderProfile>
				</HeaderRightWrap>
			</ChatHeader>

			<ChatChatpg id="chatpg" ref={chatPg}>
				{chatList.map(({ value }, index) => {
					return (
						<ChatChatpgMessage key={index}>
							<MessageProfile src={value.avatar}></MessageProfile>
							<MessageText>
								<MessageTextName>{value.nickname}</MessageTextName>
								<MessageTextExplain>
									{value.message ? (
										<MessageTextChating>{value.message}</MessageTextChating>
									) : (
										<MessageTextCaption>{value.caption}</MessageTextCaption>
									)}
								</MessageTextExplain>
							</MessageText>
						</ChatChatpgMessage>
					);
				})}
			</ChatChatpg>
			<ChatForm onSubmit={sendMessageEnterEvent} autoComplete="off">
				<Participant className="Participant">
					<FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
					{` ${participant}`}
				</Participant>
				<ChatInputDiv className="form__group field">
					<ChatFormInput
						id="chatInput"
						onChange={handleChange}
						placeholder="Type a message..."
						autoComplete="off"
						ref={chatInput}
						className="form__field"
						name="chatInput"
						type="input"
					></ChatFormInput>
					<CahtInputDivLabel htmlFor="chatInput" className="form__label">
						Type a message...
					</CahtInputDivLabel>
				</ChatInputDiv>
			</ChatForm>
		</Chat>
	);
};
export default Chatting;
