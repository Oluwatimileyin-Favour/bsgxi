import Link from 'next/link';

const Navbar = () => {
    return (
      <nav className="flex flex-col justify-center shadow-md lg:px-16 xs:px-6 w-[100%] h-[100%]">
          <div className="flex justify-between items-center">

            <Link href="/" className="text-2xl font-bold text-red-500">
              BSG-XI
            </Link>

            <div className="space-x-6">
              <Link
                  href="/"
                  className="hover:text-blue-500 font-medium"
              >
                  Home
              </Link>
              <Link
                href="stats"
                className="hover:text-blue-500 font-medium"
              >
                Stats
              </Link>
              <Link 
                href="admin"
                className="hover:text-blue-500 font-medium hidden md:inline"
              >
                Admin
              </Link> 
              <Link
                href="about"
                className="hover:text-blue-500 font-medium"
              >
                About
              </Link>
            </div>
          </div>
      </nav>
    );
  };
  
  export default Navbar;
  