'use client'

import { Message } from '@/lib/chat/actions'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { cn } from '@/lib/utils'
import { useAIState, useUIState } from 'ai/rsc'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessagesList } from './messages-list'
import { ChatPanel } from './chat-panel'
import { EmptyScreen } from './empty-screen'
import { ScrollArea } from '../ui/scroll-area'
import { Metadata } from './metadata'
// import { toast } from 'sonner'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
    session?: any // Session
    //   missingKeys: string[]
}

export function SupportChat({ id, className, session }: ChatProps) {
    const router = useRouter()
    const path = usePathname()
    const [input, setInput] = useState('')
    const [messages] = useUIState()
    const [aiState] = useAIState()

    const [_, setNewChatId] = useLocalStorage('newChatId', id)

    useEffect(() => {
        if (session?.user || session?.email) {
            if (!path.includes('chat') && messages.length === 1) {
                window.history.replaceState({}, '', `/chat/${id}`)
            }
        }
    }, [id, path, session?.user, messages])

    useEffect(() => {
        const messagesLength = messages?.length
        if (messagesLength === 2) {
            router.refresh()
        }
    }, [aiState.messages, router])

    useEffect(() => {
        const messagesLength = messages?.length
        if (messagesLength >= 3) {
            const postCategoryData = async () => {
                try {
                    const response = await fetch('/api/category', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            messages: messages.filter((m:any) => m.role === 'user')
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to post category data');
                    }

                    const data = await response.json();
                    console.log('Category data posted successfully:', data);
                } catch (error) {
                    console.error('Error posting category data:', error);
                    // Consider using a toast notification here instead of console.error
                    // toast.error('Failed to post category data');
                }
            };

            postCategoryData();
        }
    }, [messages])

    useEffect(() => {
        setNewChatId(id)
    })

    const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

    return (
        <div className='h-screen grid grid-cols-4 gap-0'>
            <div className='col-span-3 flex flex-col'>
                <ScrollArea className='flex-grow p-3'>
                    <div ref={scrollRef} className="flex flex-col size-full overflow-auto justify-between">
                        <div className={cn('flex-1 pb-[120px] overflow-auto max-h-[76vh]', className as string)} ref={messagesRef}>
                            {messages.length ?
                                (<MessagesList messages={messages} isShared={false} session={session} />) :
                                (<EmptyScreen user={session} />)
                            }
                            <div className="h-px w-full" ref={visibilityRef} />
                        </div>
                        <ChatPanel id={id}
                            input={input}
                            session={session}
                            setInput={setInput}
                            isAtBottom={isAtBottom}
                            scrollToBottom={scrollToBottom}
                        />
                    </div>
                </ScrollArea>
            </div>
            <div className='col-span-1 p-3'>
                <Metadata category='Hardware' severity='Alta' title='Mi mouse no funciona' />
            </div>
        </div>
    )
}