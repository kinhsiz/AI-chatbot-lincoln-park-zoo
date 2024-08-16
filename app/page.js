'use client'

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useRef, useEffect } from 'react'

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Lincoln Park Zoo support assistant. How can I help you today?",
    },
  ])

  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {

    if (!message.trim() || isLoading) return  // Don't send empty messages
    setIsLoading(false)

    setMessage('')

    setMessages((messages) => [...messages, { role: 'user', content: message }, { role: 'assistant', content: '' }])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      fontFamily= '"Roboto", "Helvetica", "Arial", sans-serif'
      
    >
      
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        borderRadius={7}
        border="1px solid black"
        spacing={3}
        overflow={'hidden'}
        backgroundColor= "#eeeeee" 
      > 
        
        <Stack
          width="100%"
          height="13%"
          direction={'column'}
          backgroundColor="#4fd98d"
          alignItems="center"
          justifyContent="center"
          
      >
          <Typography 
            variant='h5'
            spacing={2}
            direction='column'
            alignItems="center"
            fontWeight= "500"
            
            
            >Lincoln Park Zoo Chatbot</Typography>
      </Stack>
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          pl={2}
          pr={2}
          
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? "#4fd98d"
                    : '#f8cd23'
                }
                color="black"
                fontWeight='500' 
                borderRadius={11}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          
          <div ref={messagesEndRef} />

        </Stack>
        <Stack direction={'row'} spacing={2} p={2} backgroundColor='white'>

          <TextField
            label="Type your message here"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
          <Button variant="contained"
            style={{backgroundColor: "#4fd98d"}}
            onClick={sendMessage}
            disabled={isLoading}
            
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}