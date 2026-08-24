import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories, useCreateTransaction } from '../hooks'
import type { TransactionType } from '../api'

interface Props {
  type: TransactionType
  onSuccess?: () => void
}

const schema = z.object({
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  description: z.string().max(500).optional(),
  reference: z.string().max(100).optional(),
})

type FormValues = z.infer<typeof schema>

export function TransactionForm({ type, onSuccess }: Props) {
  const { data: categories = [] } = useCategories(type)
  const createMutation = useCreateTransaction()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      categoryId: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      reference: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    await createMutation.mutateAsync({
      type,
      amount: values.amount,
      categoryId: values.categoryId,
      date: new Date(values.date).toISOString(),
      description: values.description || undefined,
      reference: values.reference || undefined,
    })
    form.reset({
      amount: 0,
      categoryId: '',
      date: new Date().toISOString().slice(0, 10),
      description: '',
      reference: '',
    })
    onSuccess?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <FormField
          control={form.control}
          name='amount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah (Rp)</FormLabel>
              <FormControl>
                <Input type='number' inputMode='decimal' step='1' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih kategori' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type='date' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='reference'
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Referensi (opsional)</FormLabel>
              <FormControl>
                <Input placeholder='Kwitansi/Nota' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder='Keterangan tambahan' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={createMutation.isPending}>
          {createMutation.isPending && <Loader2 className='h-4 w-4 animate-spin' />}
          Simpan Transaksi
        </Button>
      </form>
    </Form>
  )
}
