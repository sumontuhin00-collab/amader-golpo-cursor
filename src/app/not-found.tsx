import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div
      className="container mx-auto px-4 py-24 text-center"
    >
      <h1 className="text-6xl font-bold text-gradient mb-4">৪০৪</h1>
      <h2 className="text-2xl font-semibold mb-4">পৃষ্ঠা পাওয়া যায়নি</h2>
      <p className="text-muted-foreground mb-8">
        আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই।
      </p>
      <Link href="/">
        <Button>হোমে ফিরুন</Button>
      </Link>
    </div>
  );
}
