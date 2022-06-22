import React from 'react'

const App = () => {
	const AllowNotification = () => {
		Notification.requestPermission().then(result => {
			if (result === 'granted') {
				new Notification('Hello!', { body: 'Hello world!' })
			}
		})
	}

	return <button onClick={AllowNotification}>Allow Notification</button>
}

export default App
