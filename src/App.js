import { useState,useEffect } from "react"
// import request from "request";
import axios from 'axios';



const App = () => {

  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [previousChat, setPreviousChat] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)

  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
  }

  // console.log(previousChat)

  const getMessages = async () =>{

    axios.post('http://localhost:8001/completions', 
      {
        message : value
      },
      {
        headers:{
        "Content-Type": "application/json"
      }
      }).then( (response) => {
        // console.log('setMessage' + JSON.stringify(response.data.choices[0].message))
        setMessage(response.data.choices[0].message)
      }).catch( (error) => {
        console.error(error.status + error)
      })
      
    }

  useEffect(() => {
    // console.log(currentTitle, value, message)
    if (!currentTitle && value && message){
      console.log('set title to ' + value)
      setCurrentTitle(value)
    }
    if (currentTitle && value && message){
      setPreviousChat(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role:"you",
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
  }, [message,currentTitle] )


  const currenChat = previousChat.filter(previousChat => previousChat.title === currentTitle)
  // console.log(previousChat)
  const uniqueTitles = Array.from(new Set(previousChat.map(previousChat => previousChat.title)))
  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>made by wenkang</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>FanQiangGPT</h1>}
        <ul className="feed">
          {currenChat?.map((chatMessage, index) => 
          <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>
          )}
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
