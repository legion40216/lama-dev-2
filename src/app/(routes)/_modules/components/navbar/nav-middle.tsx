import Logo from "./logo";
import NavDesktop from "./nav-middle/nav-desktop";

export default function NavMiddle() {
  return (
    <div>
      <div className="md:hidden flex">
        <Logo />
      </div>

      <div className="hidden md:flex">
        <NavDesktop />
      </div>
    </div>
  );
}
