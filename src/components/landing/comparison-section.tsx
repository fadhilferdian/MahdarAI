
import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function ComparisonSection() {
  return (
    <section id="comparison" className="w-full py-20 md:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                Mengapa Mahdar AI Berbeda?
            </h2>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] font-bold text-lg">Aspek</TableHead>
                <TableHead className="text-center font-bold text-lg text-primary">Mahdar AI</TableHead>
                <TableHead className="text-center font-bold text-lg">Alat Lain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Login Diperlukan</TableCell>
                <TableCell className="text-center">
                    <div className="flex justify-center">
                        <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex justify-center">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dukungan Multibahasa</TableCell>
                <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-1">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>3 Bahasa</span>
                    </div>
                </TableCell>
                <TableCell className="text-center">
                     <div className="flex justify-center">
                        <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Format Input</TableCell>
                 <TableCell className="text-center">
                     <div className="flex justify-center items-center gap-1">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span>Teks, Audio, PDF, DOCX</span>
                    </div>
                </TableCell>
                <TableCell className="text-center">
                    <div className="flex justify-center">
                        <span className="text-yellow-500 font-bold">⚠️ Terbatas</span>
                    </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Harga</TableCell>
                <TableCell className="text-center">
                    <span className="font-bold text-green-500">💯 Gratis</span>
                </TableCell>
                <TableCell className="text-center">
                    <span className="font-bold text-destructive">💰 Berbayar</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </section>
  );
}
