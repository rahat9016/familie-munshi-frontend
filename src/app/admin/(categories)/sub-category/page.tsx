import Categories from "@/src/components/admin/Categories/Categories";
import { ProductClassificationLevel } from "@/src/types/productClassification";

export default function page() {
  return <Categories level={ProductClassificationLevel.SUB_CATEGORY} />;
}
