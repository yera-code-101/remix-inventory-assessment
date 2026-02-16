import { useFetcher } from "react-router";
import { Button, InlineStack, Text } from "@shopify/polaris";

function InventoryItem({ item }: { item: any }) {
  const fetcher = useFetcher();

  const isClaiming = fetcher.formData?.get("id") === item.id;
  const displayStock = isClaiming ? item.stock - 1 : item.stock;

  return (
    <InlineStack align="space-between" blockAlign="center">
      <Text as="span" variant="bodyMd">
        {item.name} — <strong>{displayStock} in stock</strong>
      </Text>

      <fetcher.Form method="post">
        <input type="hidden" name="id" value={item.id} />
        <Button
          submit
          variant="primary"
          disabled={isClaiming || displayStock <= 0}
        >
          Claim One
        </Button>
      </fetcher.Form>
    </InlineStack>
  );
}

export default InventoryItem;
