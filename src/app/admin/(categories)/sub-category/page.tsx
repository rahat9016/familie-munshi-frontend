import ClassificationList from "@/src/components/admin/Categories/ClassificationList/ClassificationList";
import { ProductClassificationLevel } from "@/src/types/ecommerce/productClassification";

export default function page() {
  return (
    <div>
      <ClassificationList level={ProductClassificationLevel.SUB_CATEGORY} />
    </div>
  );
}
