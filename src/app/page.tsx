import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 gap-5">
      <div>
        <Button variant={"default"}>Click me</Button>
      </div>
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>

      {/* <WalletMultiButton /> */}
    </main>
  );
}
