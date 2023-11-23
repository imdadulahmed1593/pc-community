'use client';

import { Bot } from 'lucide-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  MessageModel,
} from '@chatscope/chat-ui-kit-react';
import { useTheme } from 'next-themes';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { MessageDirection } from '@chatscope/chat-ui-kit-react/src/types/unions';

const API_KEY = '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';
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: 'system',
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

// interface Message {
//   message: string;
//   sentTime?: string;
//   sender: string;
//   direction: MessageDirection;
//   position: string;
// }

export const ChatPicker = () => {
  const { resolvedTheme } = useTheme();

  const [messages, setMessages] = useState<MessageModel[]>([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: 'ChatGPT',
      position: 'normal',
      direction: 'incoming',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message: string) => {
    const newMessage: MessageModel = {
      message,
      direction: 'outgoing',
      sender: 'user',
      position: 'normal',
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageModel[]) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = '';
      if (messageObject.sender === 'ChatGPT') {
        role = 'assistant';
      } else {
        role = 'user';
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo-1106',
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages,
      ],
    };

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: 'ChatGPT',
            direction: 'incoming',
            position: 'normal',
          },
        ]);
        setIsTyping(false);
      });
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Bot className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <div className="w-[350px] h-[350px] md:w-[350px] md:h-[450px] ">
          <MainContainer className="rounded-md py-3">
            <ChatContainer>
              <MessageList
                className="space-y-3"
                scrollBehavior="smooth"
                autoScrollToBottom={true}
                autoScrollToBottomOnMount={true}
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  return <Message key={i} model={message} />;
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
                className="py-2"
                attachButton={false}
              />
            </ChatContainer>
          </MainContainer>
        </div>
        {/* <h1>Hello </h1> */}
      </PopoverContent>
    </Popover>
  );
};
