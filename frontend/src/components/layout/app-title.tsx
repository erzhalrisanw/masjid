import { Link } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile, state } = useSidebar()
  const collapsed = state === 'collapsed'
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-2 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <Link
            to='/'
            onClick={() => setOpenMobile(false)}
            className='flex flex-1 items-center gap-2 text-start text-sm leading-tight'
          >
            <div className='flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Building2 className='size-4' />
            </div>
            {!collapsed && (
              <div className='grid flex-1 leading-tight'>
                <span className='truncate font-bold'>Masjid Sayyidina Abubakar</span>
                <span className='truncate text-xs'>Sistem Manajemen</span>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
