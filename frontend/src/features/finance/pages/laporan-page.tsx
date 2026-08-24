import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatIDR, NAMA_BULAN } from '@/lib/format'
import { useReport } from '../hooks'

export function LaporanPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState<number | undefined>(now.getMonth() + 1)
  const { data, isLoading } = useReport(year, month)

  return (
    <>
      <Header>
        <h1 className='text-xl font-semibold'>Laporan Keuangan</h1>
      </Header>
      <Main>
        <div className='space-y-4'>
          <div className='flex flex-wrap items-end gap-3'>
            <div>
              <Label className='mb-1 block text-sm'>Tahun</Label>
              <Input
                type='number'
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className='w-32'
              />
            </div>
            <div>
              <Label className='mb-1 block text-sm'>Bulan</Label>
              <Select
                value={month?.toString() ?? 'all'}
                onValueChange={(v) => setMonth(v === 'all' ? undefined : Number(v))}
              >
                <SelectTrigger className='w-40'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Semua Bulan (Tahunan)</SelectItem>
                  {NAMA_BULAN.map((n, i) => (
                    <SelectItem key={n} value={(i + 1).toString()}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && <p className='text-muted-foreground'>Memuat laporan...</p>}

          {!isLoading && data && month && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Laporan {NAMA_BULAN[month - 1]} {year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mb-4 grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-md border p-3'>
                    <div className='text-sm text-muted-foreground'>Pemasukan</div>
                    <div className='text-xl font-bold text-emerald-600'>
                      {formatIDR(data.income)}
                    </div>
                  </div>
                  <div className='rounded-md border p-3'>
                    <div className='text-sm text-muted-foreground'>Pengeluaran</div>
                    <div className='text-xl font-bold text-rose-600'>
                      {formatIDR(data.expense)}
                    </div>
                  </div>
                  <div className='rounded-md border p-3'>
                    <div className='text-sm text-muted-foreground'>Selisih</div>
                    <div className='text-xl font-bold'>{formatIDR(data.net)}</div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className='text-right'>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className='text-center text-muted-foreground'>
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                    {data.rows.map((r: {
                      categoryId: string
                      categoryName: string
                      type: string
                      total: number
                    }) => (
                      <TableRow key={r.categoryId + r.type}>
                        <TableCell>{r.categoryName}</TableCell>
                        <TableCell>
                          {r.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran'}
                        </TableCell>
                        <TableCell className='text-right font-medium'>
                          {formatIDR(r.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isLoading && data && !month && (
            <Card>
              <CardHeader>
                <CardTitle>Laporan Tahunan {year}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bulan</TableHead>
                      <TableHead className='text-right'>Pemasukan</TableHead>
                      <TableHead className='text-right'>Pengeluaran</TableHead>
                      <TableHead className='text-right'>Selisih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.months.map((m: { month: number; income: number; expense: number; net: number }) => (
                      <TableRow key={m.month}>
                        <TableCell>{NAMA_BULAN[m.month - 1]}</TableCell>
                        <TableCell className='text-right text-emerald-600'>
                          {formatIDR(m.income)}
                        </TableCell>
                        <TableCell className='text-right text-rose-600'>
                          {formatIDR(m.expense)}
                        </TableCell>
                        <TableCell className='text-right font-medium'>
                          {formatIDR(m.net)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  )
}
