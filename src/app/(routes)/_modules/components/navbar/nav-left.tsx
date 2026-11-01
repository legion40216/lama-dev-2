import Logo from "./logo";
import NavMobile from "./nav-left/nav-mobile";

export default function NavLeft() {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* hidden at md and above, show at smaller screens */}
      <div className="md:hidden">
        <NavMobile />
      </div>

      {/* hidden at md and above, show at smaller screens */}
      <div className="hidden md:flex">
        <Logo />
      </div>
    </div>
  );
}