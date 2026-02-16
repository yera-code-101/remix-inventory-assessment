import { useAsyncError, useRevalidator } from "react-router";
import { Banner, SkeletonBodyText } from "@shopify/polaris";

export default function ErrorBanner() {
  const error = useAsyncError() as Error;
  const revalidator = useRevalidator();

  if (revalidator.state === "loading") {
    return <SkeletonBodyText lines={3} />;
  }

  return (
    <Banner
      title="Critical Error"
      tone="critical"
      action={{
        content: "Retry",
        onAction: () => revalidator.revalidate(),
      }}
    >
      <p>{error.message || "Failed to load inventory."}</p>
    </Banner>
  );
}
