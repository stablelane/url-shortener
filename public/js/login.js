// //authentication
// localStorage.removeItem('token')

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password})
        })
        const result = response.json()
        if(response.ok) {
            // localStorage.setItem('token', result.accessToken)
            // console.log(result.accessToken)
            window.location.href = '/'

        } else {
            console.log('login failed', result.message)
        }
        
        
    } catch (error) {
        console.log(error)
    }
})