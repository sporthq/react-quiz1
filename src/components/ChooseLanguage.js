const ChooseLanguage = ({ dispatch }) => {
	const handleChooseLanguage = (language) => {
		dispatch({ type: 'chooseLanguage', payload: language });
		dispatch({ type: 'setDifficultyLevel', payload: 'easy' });
	};

	return (
		<div className='container-flags'>
			
			<button className='btn btn-flags-container' onClick={() => handleChooseLanguage('Polish')}>
				<span>Polish</span>
				<img src='icons8-poland-48.png' alt='' />
			</button>
			<button className='btn btn-flags-container' onClick={() => handleChooseLanguage('English')}>
				<span>English</span>
				<img src='icons8-great-britain-48.png' alt='' />
			</button>
		</div>
	);
};

export default ChooseLanguage;
