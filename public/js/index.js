async function incrementClick( event ) {
    await delay(1000)
    const response = await fetch (`/increment/${event.innerText}`)
    const result = await response.json()
    console.log(result)
    document.getElementById(event.innerText).textContent = `${result.clicks}`
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }