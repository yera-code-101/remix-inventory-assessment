import { Suspense } from "react";
import {
  Await,
  useAsyncError,
  useLoaderData,
  useRevalidator,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import type { ActionFunctionArgs } from "react-router";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  SkeletonBodyText,
  Banner,
  Button,
} from "@shopify/polaris";
import { getInventory, claimStock } from "~/models/inventory.server";
import InventoryItem from "~/components/inventoryItem";


export async function loader() {
  const inventoryPromise = getInventory();

  return {
    inventory: inventoryPromise,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id === "string") {
    await claimStock(id);
  }

  return null;
}


export default function Dashboard() {
  const { inventory } = useLoaderData<typeof loader>();

  return (
    <Page title="Inventory Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Current Stock
              </Text>
              <Suspense fallback={<SkeletonBodyText lines={3} />}>
                <Await
                  resolve={inventory}
                  errorElement={<ErrorBanner />}
                >
                  {(items) => <InventoryList items={items} />}
                </Await>
              </Suspense>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}


function InventoryList({ items }: { items: any[] }) {
  return (
    <BlockStack gap="200">
      {items.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}
    </BlockStack>
  );
}

function ErrorBanner() {
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


export function ErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  let errorMessage = "Unknown error";
  let errorTitle = "Application Error";

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Page title="Inventory Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd">
                Current Stock
              </Text>
              
              <Banner
                title={errorTitle}
                tone="critical"
                action={{
                  content: "Retry Connection",
                  onAction: () => revalidator.revalidate(), 
                }}
              >
                <p>{errorMessage}</p>
                {errorMessage.includes("Failed to fetch") && (
                  <p><strong>Note:</strong> It looks like you are offline.</p>
                )}
              </Banner>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
