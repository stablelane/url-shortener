document.getElementById('shortUrlForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const fullUrl = document.getElementById('fullUrl').value
    const token = localStorage.getItem('token')
    const response = await fetch('/shortUrl', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullUrl })
    })
    if (response.ok) {
        window.location.reload();
    } else {
        console.error('Error shrinking URL');
    }
})
async function incrementClick(event) {
    await delay(1000)
    const response = await fetch(`/increment/${event.innerText}`)
    const result = await response.json()
    console.log(result)
    document.getElementById(event.innerText).textContent = `${result.clicks}`
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

