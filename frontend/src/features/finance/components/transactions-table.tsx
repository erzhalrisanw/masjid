import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { formatDate, formatIDR } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteTransaction, useTransactions } from '../hooks'
import type { TransactionType } from '../api'

interface Props {
  type?: TransactionType
  pageSize?: number
}

export function TransactionsTable({ type, pageSize = 20 }: Props) {
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading } = useTransactions({ page, pageSize, type })
  const deleteMutation = useDeleteTransaction()

  return (
    <div className='space-y-3'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Keterangan</TableHead>
              {!type && <TableHead>Tipe</TableHead>}
              <TableHead className='text-right'>Jumlah</TableHead>
              <TableHead>Dibuat oleh</TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted-foreground'>
                  Memuat...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted-foreground'>
                  Belum ada transaksi
                </TableCell>
              </TableRow>
            )}
            {data?.data.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{formatDate(t.date)}</TableCell>
                <TableCell>{t.category.name}</TableCell>
                <TableCell className='max-w-xs truncate'>
                  {t.description || '-'}
                </TableCell>
                {!type && (
                  <TableCell>
                    <Badge
                      variant={t.type === 'PEMASUKAN' ? 'default' : 'destructive'}
                    >
                      {t.type === 'PEMASUKAN' ? 'Masuk' : 'Keluar'}
                    </Badge>
                  </TableCell>
                )}
                <TableCell
                  className={`text-right font-medium ${
                    t.type === 'PEMASUKAN' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {t.type === 'PEMASUKAN' ? '+' : '-'}
                  {formatIDR(t.amount)}
                </TableCell>
                <TableCell className='text-muted-foreground'>
                  {t.createdBy.name}
                </TableCell>
                <TableCell>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setDeleteId(t.id)}
                  >
                    <Trash2 className='h-4 w-4 text-rose-600' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className='flex items-center justify-between'>
          <div className='text-sm text-muted-foreground'>
            Halaman {data.meta.page} dari {data.meta.totalPages} • Total {data.meta.total} transaksi
          </div>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              size='sm'
              variant='outline'
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus transaksi?</AlertDialogTitle>
            <AlertDialogDescription>
              Data transaksi akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  await deleteMutation.mutateAsync(deleteId)
                  setDeleteId(null)
                }
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
