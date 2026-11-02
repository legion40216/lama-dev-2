import { products } from "@/data/data";
import SearchDialog from "@/components/search/search-dialog";
import Cart from "./nav-right/cart";
import UserMenu from "./nav-right/user-menu";

export default function NavRight() {
  return (
    <div className="flex items-center gap-1">
      <SearchDialog products={products} />
      <UserMenu />
      <div className="hidden md:block">
        <Cart />
      </div>
    </div>
  );
}
