// import { AppSidebar } from "@/components/chat/panel/app-sidebar";
// import Protected from "@/components/protected/protected-content";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { getSession } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import { nanoid } from "@/lib/utils";

export default async function ChatLayout({ children } : { children : React.ReactNode }) {
    const id = nanoid()
    // const session = await getSession()
    
    return (
        <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
            <div className="flex min-h-screen w-full flex-col bg-transparent overflow-auto">
                {children}
            </div>
        </AI>
    )
}