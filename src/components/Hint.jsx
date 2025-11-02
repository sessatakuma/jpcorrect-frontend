import React, {useState, useRef, useEffect} from 'react';
import 'components/Hint.css';

export default function Hint() {
	const [messages, setMessages] = useState([
		{ id: 0, sender: 'ai', text: 'AI はまだ寝ている…' },
	]);
	const inputRef = useRef(null);
	const chatRef = useRef(null);

	useEffect(() => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	}, [messages]);

	const sendMessage = () => {
		const text = inputRef.current.textContent.trim();
		if (text === '') return;

		const newMessage = {
			id: Date.now(),
			sender: 'user',
			text,
		};
		setMessages((prev) => [...prev, newMessage]);
		inputRef.current.textContent = '';
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<section className='hint'>
			<div className='header'>AI 添削</div>

			<div className='response' ref={chatRef}>
				{messages.map((msg) => (
					<p key={msg.id} className={`bubble ${msg.sender}`}>
						{msg.text}
					</p>
				))}
			</div>
			<div className='input-area'>
				<p
					className='input'
					contentEditable
					ref={inputRef}
					onKeyDown={handleKeyDown}
					placeholder='メッセージを入力...'
				></p>
				<button className='send' onClick={sendMessage}>
					<i className='fa-solid fa-paper-plane'></i>
				</button>
			</div>
		</section>
	);
}