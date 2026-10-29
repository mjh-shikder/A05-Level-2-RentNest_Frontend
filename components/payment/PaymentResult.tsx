import Link from "next/link";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

const paymentResults = {
  success: {
    title: "Payment submitted",
    description:
      "Your checkout is complete. Our payment provider is confirming the payment, and your tenant dashboard will show the updated status once confirmation arrives. Check your payment history before attempting another payment.",
    icon: CircleCheck,
    iconClassName: "bg-primary/10 text-primary",
    primaryLabel: "Go to tenant dashboard",
    secondaryLabel: "Browse properties",
  },
  cancel: {
    title: "Checkout cancelled",
    description:
      "Your checkout was cancelled before it finished. You can try again from your tenant dashboard when you are ready. If you think you completed the payment, check your payment history before retrying.",
    icon: CircleX,
    iconClassName: "bg-destructive/10 text-destructive",
    primaryLabel: "Return to tenant dashboard",
    secondaryLabel: "Browse properties",
  },
} as const;

const PaymentResult = ({ status }: { status: keyof typeof paymentResults }) => {
  const result = paymentResults[status];
  const StatusIcon = result.icon;

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <section
        aria-labelledby="payment-result-title"
        className="w-full max-w-xl rounded-3xl border border-white/30 bg-white/10 p-6 text-center shadow-sm backdrop-blur-xl dark:bg-black/10 sm:p-10"
      >
        <div
          aria-hidden="true"
          className={`mx-auto flex size-16 items-center justify-center rounded-full ${result.iconClassName}`}
        >
          <StatusIcon className="size-8" />
        </div>
        <h1
          id="payment-result-title"
          className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {result.title}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          {result.description}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard/tenant">{result.primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/properties">{result.secondaryLabel}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default PaymentResult;
