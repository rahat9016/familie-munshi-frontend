import ArticleInfoBoard from "@/src/components/admin/TownHall/ArticleInfoBoard";
import DashboardWelcome from "@/src/components/admin/TownHall/DashboardWelcome";
import MagicBoard from "@/src/components/admin/TownHall/MagicBoard";
import NoticeBoard from "@/src/components/admin/TownHall/NoticeBoard";
import OrderPipelineBoard from "@/src/components/admin/TownHall/OrderPipelineBoard";
import ProductInfoBoard from "@/src/components/admin/TownHall/ProductInfoBoard";
import TownHallBoard from "@/src/components/admin/TownHall/TownHallBoard";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-3">
      <DashboardWelcome />

      <TownHallBoard />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2 min-w-0">
          <MagicBoard />
        </div>
        <NoticeBoard />
      </div>

      <ArticleInfoBoard />
      <ProductInfoBoard />
      <OrderPipelineBoard />
    </div>
  );
}
