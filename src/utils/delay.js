export function delay(ms) {
    let delayPromise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
    return delayPromise
}