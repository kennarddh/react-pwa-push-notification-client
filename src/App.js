import React from 'react'

const urlBase64ToUint8Array = base64String => {
	var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

	var rawData = window.atob(base64)
	var outputArray = new Uint8Array(rawData.length)

	for (var i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i)
	}
	return outputArray
}

const App = () => {
	const AllowNotification = () => {
		Notification.requestPermission().then(result => {
			if (result === 'granted') {
				new Notification('Hello!', { body: 'Hello world!' })
			}
		})
	}

	const Subscribe = () => {
		const key =
			'BDk-kDxLswQMajg9TJqpb9VFTjQeQmS0FE_rTVJ4f9G-v9GFkzcDt-vYkvz5dVkbCfrGmJeLTbvuNUKpOUojWB4'

		global.registration.pushManager
			.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(key),
			})
			.then(pushSubscription => {
				console.log('Subscribed!')

				fetch('http://localhost:8080/api/subscribe', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						subscriptionObject: JSON.parse(
							JSON.stringify(pushSubscription)
						),
					}),
				}).then(response => {
					if (!response.ok) {
						throw new Error('Bad status code from server.')
					}

					return response.json()
				})
			})
			.catch(error => {
				console.log('Did not subscribe.', error)
			})
	}

	return (
		<>
			<button onClick={AllowNotification}>Allow Notification</button>
			<button onClick={Subscribe}>Subscribe</button>
		</>
	)
}

export default App
