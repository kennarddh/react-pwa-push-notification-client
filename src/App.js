import React from 'react'

const key =
	'BA2FfcD9savnPWC7GZUxtSJloSBJOJZNOGZTKBUeRm1KwDRJzO4KHSr3E6M7HYCT2vFTepjzR5yyeMFCHjOyzkA'

const urlBase64ToUint8Array = base64String => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/')

	const rawData = window.atob(base64)
	const outputArray = new Uint8Array(rawData.length)

	for (let i = 0; i < rawData.length; ++i) {
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
		Unsubscribe(key)

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

	const Unsubscribe = key => {
		global.registration.pushManager
			.getSubscription()
			.then(pushSubscription => {
				if (!pushSubscription) return

				//check if user was subscribed with a different key
				let json = pushSubscription.toJSON()
				let public_key = json.keys.p256dh

				if (public_key === key) return

				pushSubscription
					.unsubscribe()
					.then(() => {
						console.log('Successfully unsubscribe')
					})
					.catch(error => {
						console.error(error)
					})
			})
	}

	return (
		<>
			<button onClick={AllowNotification}>Allow Notification</button>
			<button onClick={Subscribe}>Subscribe</button>
			<button onClick={() => Unsubscribe(key)}>Unsubscribe</button>
		</>
	)
}

export default App
