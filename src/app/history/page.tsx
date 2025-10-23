import HistoryList from '@/components/history/history-list';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HistoryPage() {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Summary History</CardTitle>
          <CardDescription>
            Here are the summaries you have saved.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="mt-6">
        <HistoryList />
      </div>
    </div>
  );
}
