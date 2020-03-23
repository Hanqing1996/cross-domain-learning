function jsonp(url) {
    return new Promise((resolve,reject)=>{
        const random=Math.random()
        window[random]=(data)=>{
            resolve(data)
        }
        const script=document.createElement('script')
        script.src=`${url}?callback=${random}`
        document.body.appendChild(script)
        script.onload=()=>{
            script.remove()
        }
        script.onerror=()=>{
            reject()
        }
    })
}

jsonp('http://localhost:8888/friends.js')
    .then((data)=>{
        console.log(data)
    })




