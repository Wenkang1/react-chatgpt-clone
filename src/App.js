import { useState,useEffect } from "react"

const App = () => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChat, setPreviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState([])

  const getMessages = async () =>{
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers:{
        "Content-Type": "application/json"
    },
      
    }
    try {
      const res = await fetch('http://localhost:8000/completions', options)
      const data = await res.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if (currentTitle && value && message){
      setPreviousChat(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role:"user",
            cotent: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
      ]
      ))
    }

  }, [message, currentTitle, value] )
  console.log("previousChat: " ,previousChat)
  console.log("input value: " ,value)
  console.log("message we got back: " ,message)

  return (
    <div className="App">
      <section className="side-bar">
        <button>+ New Chat</button>
        <ul className="history">
          <li>yes</li>
        </ul>
        <nav>
          <p>made by wenkang</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>FanQiangGPT</h1>}
        <ul className="feed">


        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>SUBMIT</div>
          </div>
          <p className="info">
            here to store chatgpt info
          </p>
        </div>

      </section>
    </div>
  );
}

export default App;
