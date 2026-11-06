import Cart from "./nav-right/cart";
import UserMenu from "./nav-right/user-menu";

export default function NavRight() {
  return (
    <div className="flex items-center gap-1">
      <UserMenu />
      <Cart />
    </div>
  );
}
