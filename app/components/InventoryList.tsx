import { BlockStack } from "@shopify/polaris";
import InventoryItem from "~/components/InventoryItem";

export default function InventoryList({ items }: { items: any[] }) {
  return (
    <BlockStack gap="200">
      {items.map((item) => (
        <InventoryItem key={item.id} item={item} />
      ))}
    </BlockStack>
  );
}
