import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks'
import type { TransactionType } from '../api'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  type: z.enum(['PEMASUKAN', 'PENGELUARAN']),
  description: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

function KategoriList({ type, title }: { type: TransactionType; title: string }) {
  const { data: categories = [], isLoading } = useCategories(type)
  const deleteMutation = useDeleteCategory()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className='text-muted-foreground'>Memuat...</p>}
        {!isLoading && categories.length === 0 && (
          <p className='text-muted-foreground'>Belum ada kategori</p>
        )}
        <ul className='divide-y'>
          {categories.map((c) => (
            <li key={c.id} className='flex items-center justify-between py-2'>
              <div>
                <div className='font-medium'>{c.name}</div>
                {c.description && (
                  <div className='text-sm text-muted-foreground'>{c.description}</div>
                )}
              </div>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => deleteMutation.mutate(c.id)}
              >
                <Trash2 className='h-4 w-4 text-rose-600' />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function KategoriPage() {
  const [open, setOpen] = useState(false)
  const createMutation = useCreateCategory()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', type: 'PEMASUKAN', description: '' },
  })

  const onSubmit = async (values: FormValues) => {
    await createMutation.mutateAsync(values)
    form.reset()
    setOpen(false)
  }

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold'>Kategori</h1>
      </Header>
      <Main>
        <div className='space-y-4'>
          <div className='flex justify-end'>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className='h-4 w-4' />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kategori</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama</FormLabel>
                          <FormControl>
                            <Input placeholder='cth: Infaq Jumat' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipe</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='PEMASUKAN'>Pemasukan</SelectItem>
                              <SelectItem value='PENGELUARAN'>Pengeluaran</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi (opsional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type='submit' disabled={createMutation.isPending}>
                      Simpan
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <KategoriList type='PEMASUKAN' title='Kategori Pemasukan' />
            <KategoriList type='PENGELUARAN' title='Kategori Pengeluaran' />
          </div>
        </div>
      </Main>
    </>
  )
}
