import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TransactionForm } from '../components/transaction-form'
import { TransactionsTable } from '../components/transactions-table'

export function PemasukanPage() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold'>Pemasukan</h1>
      </Header>
      <Main>
        <div className='space-y-4'>
          <div className='flex justify-end'>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='h-4 w-4' />
                  Tambah Pemasukan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pemasukan</DialogTitle>
                </DialogHeader>
                <TransactionForm type='PEMASUKAN' onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <TransactionsTable type='PEMASUKAN' />
        </div>
      </Main>
    </>
  )
}
